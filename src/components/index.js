import '../index.css';
import { initialCards } from '../scripts/cards.js';
import { validateProfileForm, validateNewCardForm } from './validate.js';
import { createCard } from './card.js';
import { openModal } from './modal.js';
import { closeModal } from './modal.js';

// получаем поп-апы (используем document.querySelector для нахождения каждого поп-апа по его классу)
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');

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
function renderCards(cards) {
  cards.forEach(card => {
    const cardElement = createCard(card);
    placesList.append(cardElement);
  });
};

// Загружаем карточки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  renderCards(initialCards);
});

// Закрытие поп-апа при нажатии на область вне поп-апа
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('popup_is-opened')) {
    closeModal(event.target);
  }
});

// Добавляем обработчики событий на кнопки
// Открытие поп-апа редактирования профил
const editButton = document.querySelector('.profile__edit-button');
editButton.addEventListener('click', () => {
  openModal(profilePopup);
});

// Открытие поп-апа добавления карточки
const addButton = document.querySelector('.profile__add-button');
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

          // Обновляем отображаемые текстовые значения
          nameDisplay.textContent = nameValue;
          descriptionDisplay.textContent = descriptionValue;

          closeModal(profilePopup);
      });
    }
});

// Создаю обработчик события для добавления новых карточек
const newCardForm = document.querySelector('.popup__form');
newCardForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Предотвращаем отправку формы

  const placeName = newCardForm.querySelector('.popup__input_type_card-name').value;
  const placeLink = newCardForm.querySelector('.popup__input_type_url').value;

  // Создаем новую карточку
  const newCardData = {
    name: placeName,
    link: placeLink
  };
  const newCardElement = createCard(newCardData);

  // Добавляем карточку в начало списка
  placesList.prepend(newCardElement);

  // Закрываем поп-ап
  closeModal(cardPopup);

  // Сбрасываем форму
  newCardForm.reset();
});

//Работа с валидацией форм
// Включение валидации
document.addEventListener('DOMContentLoaded', () => {
  const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
  validateProfileForm(profileFormElement);

  const newCardForm = document.querySelector('.popup__form[name="new-place"]');
  validateNewCardForm(newCardForm, placesList, cardPopup);
});
