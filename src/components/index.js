import '../index.css';
import { getInitialCards, getUserInfo, updateProfile, addNewCard, updateAvatar } from './api.js';
import { validateProfileForm, validateNewCardForm, validateAvatarForm, toggleButtonState } from './validate.js';
import { createCard } from './card.js';
import { openModal } from './modal.js';
import { closeModal } from './modal.js';

// получаем поп-апы (используем document.querySelector для нахождения каждого поп-апа по его классу)
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__edit-icon');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarFormElement = document.querySelector('.popup__form[name="edit-avatar"]');

// загружаем переменные для кнопки закрытия
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.querySelector('.popup');
  const popups = document.querySelectorAll('.popup');
  popups.forEach(popup => {
    popup.classList.add('popup_is-animated'); // Добавляем класс анимации
  });
});

// Получаем ссылку на хранилище для карточек
const placesList = document.querySelector('.places__list');

// Функция для добавления карточек на страницу
function renderCards(cards, currentUserId) {
  cards.forEach(card => {
    const cardElement = createCard(card, currentUserId);
    placesList.append(cardElement);
  });
};

// Загружаем информацию о пользователе
document.addEventListener('DOMContentLoaded', () => {
  getUserInfo()
    .then(userData => {
      const profileNameElement = document.querySelector('.profile__title'); // Имя
      const profileImageElement = document.querySelector('.profile__image'); // Аватар
      const profileDescriptionElement = document.querySelector('.profile__description'); // Описание

      profileNameElement.textContent = userData.name;
      profileImageElement.style.backgroundImage = `url(${userData.avatar})`;
      profileDescriptionElement.textContent = userData.about;
    })
    .catch(error => {
      console.error('Не удалось загрузить данные пользователя:', error);
    });
}); 

// Загружаем карточки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  let currentUserId;
   // Получаем информацию о пользователе
  getUserInfo()
  .then(userInfo => {
    currentUserId = userInfo._id; // Сохраняем идентификатор текущего пользователя

    return getInitialCards();
  })
  .then(cards => {
    renderCards(cards, currentUserId); // Передаем идентификатор пользователя в renderCards
  })
  .catch(err => {
    console.log(err);
  });
});

// Добавляем обработчики событий на кнопки
// Открытие поп-апа редактирования аватара
avatarEditButton.addEventListener('click', () => {
  openModal(avatarPopup);
})
// Открытие поп-апа редактирования профил
editButton.addEventListener('click', () => {
  openModal(profilePopup);
});

// Открытие поп-апа добавления карточки
addButton.addEventListener('click', () => {
  openModal(cardPopup);
});

// Закрытие поп-апов при нажатии на кнопку X
// Внутри обработчика мы используем event.target.closest('.popup'), 
// чтобы найти ближайший родительский элемент с классом popup
const closeButtons = document.querySelectorAll('.popup__close');
closeButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const popup = event.target.closest('.popup');
    closeModal(popup);
  });
});

// Создаю обработчик события для кнопки "сохранить"
document.addEventListener('DOMContentLoaded', () => {
  const profileFormElement = document.querySelector('.popup__button[type="submit"]'); // Выбор кнопки «Сохранить»
  const nameInput = document.querySelector('.popup__input_type_name'); // Поле ввода имени
  const descriptionInput = document.querySelector('.popup__input_type_description'); // Поле ввода описания
  const nameDisplay = document.querySelector('.profile__title'); // Элемент, отображающий имя
  const descriptionDisplay = document.querySelector('.profile__description'); // Элемент, отображающий описание
  profileFormElement.disabled = true;

  if (profileFormElement) {
    profileFormElement.addEventListener('click', (event) => {
          event.preventDefault(); // Отменим отправку формы и перезагрузку страницы по умолчанию

          // Из полей ввода получаем значения
          const nameValue = nameInput.value;
          const descriptionValue = descriptionInput.value;

          //Получаем данные с сервера
          updateProfile(nameValue, descriptionValue)
          .then(updatedUser => {
          // Отображаем текстовые значения полученные с сервера
          nameDisplay.textContent = nameValue;
          descriptionDisplay.textContent = descriptionValue;

          closeModal(profilePopup);
          })
          .catch(err => {
            console.log(err);
          })
      });
    }
});

// Создаю обработчик события для нового аватара профиля
avatarFormElement.addEventListener('submit', (event) => {
  event.preventDefault();

  const avatarLinkInput = avatarPopup.querySelector('.popup__input_type_avatar-url');
  const newAvatarUrl = avatarLinkInput.value;
  console.log('URL для обновления аватара:', newAvatarUrl);
  updateAvatar(newAvatarUrl)
  .then((updatedUser) => {
    console.log('Аватар обновлен:', updatedUser);
    const profileImageElement = document.querySelector('.profile__image');
    profileImageElement.style.backgroundImage = `url(${updatedUser.avatar})`;
    closeModal(avatarFormElement);
    avatarFormElement.reset();
    toggleButtonState([avatarLinkInput], avatarFormElement.querySelector('.popup__button'));
    })
    .catch((error) => {
      console.error('Не удалось обновить аватар:', error);
    });
  });
  

// Создаю обработчик события для добавления новых карточек
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
newCardForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Предотвращаем отправку формы

  const placeName = newCardForm.querySelector('.popup__input_type_card-name').value;
  const placeLink = newCardForm.querySelector('.popup__input_type_url').value;

  // Проверка на уникальность
  const existingCards = Array.from(placesList.children);
  const isDuplicate = existingCards.some(card => {
    const cardName = card.querySelector('.card__title').textContent;
    const cardLink = card.querySelector('.card__image').getAttribute('src');
    return cardName === placeName && cardLink === placeLink;
  });

  if (isDuplicate) {
    alert('Карточка с таким именем и ссылкой уже существует!');
    return; // Прерываем выполнение функции
  }

  // Создаем новую карточку
  const newCardData = {
    name: placeName,
    link: placeLink
  };
  //отключим кнопку отправки после клика, чтобы случайно не нажать на кнопку лишний раз
  const submitButton = newCardForm.querySelector('button[type="submit"]');
  submitButton.disabled = true; 

  //Отправим данные на сервер, получим карточку
  addNewCard(newCardData)
  .then(newCard => {
    const newCardElement = createCard(newCard); 

  // Добавляем карточку в начало списка
    placesList.prepend(newCardElement);

  // Закрываем поп-ап
    closeModal(cardPopup);
  // Сбрасываем форму
    newCardForm.reset();
  })
  .catch(err => {
    console.log(err);
  })
  //А после ответа сервера включим кнопку обратно
  .finally(() => {
    submitButton.disabled = false;
  });
});

//Работа с валидацией форм
// Включение валидации
document.addEventListener('DOMContentLoaded', () => {
  const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
  validateProfileForm(profileFormElement);
  validateAvatarForm(avatarFormElement);
  const newCardForm = document.querySelector('.popup__form[name="new-place"]');
  validateNewCardForm(newCardForm, placesList, cardPopup);
});
