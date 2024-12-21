
// получаем поп-апы (используем document.querySelector для нахождения каждого поп-апа по его классу)
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopupContent = document.querySelector('.popup_type_image');

// загружаем переменные для кнопки закрытия
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.querySelector('.popup');
  const popups = document.querySelectorAll('.popup');
  popups.forEach(popup => {
    popup.classList.add('popup_is-animated'); // Добавляем класс анимации
  });
  closeButton = popup.querySelector('.popup__close');
});

// Получаем ссылку на хранилище для карточек
const placesList = document.querySelector('.places__list');

// Функция для создания карточки
function createCard(cardData) {
  const cardTemplate = document.getElementById('card-template').content;
  const cardElement = cardTemplate.cloneNode(true);

  // Заполняем карточку данными
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик события для кнопки лайка
  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-button_is-active'); // Переключаем класс
  });

  // Добавляем обработчик события для кнопки удаления
  deleteButton.addEventListener('click', (event) => {
    const cardToDelete = event.target.closest('.card'); // Находим ближайший 
    // родительский элемент с классом .card

    if (cardToDelete) { //если нашли элемент (true), то удаляем его
    cardToDelete.remove(); // Удаляем карточку из DOM
    }
});

  // Добавляем обработчик события для открытия изображения
  cardImage.addEventListener('click', () => {
    const popupImage = imagePopupContent.querySelector('.popup__image');
    const popupCaption = imagePopupContent.querySelector('.popup__caption');

    popupImage.src = cardData.link; // Заполняем атрибуты поп-апа
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopupContent); // Открываем поп-ап
});

  return cardElement;
}

// Функция для добавления карточек на страницу
function renderCards(cards) {
  cards.forEach(card => {
    const cardElement = createCard(card);
    placesList.append(cardElement);
  });
}

// Загружаем карточки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  renderCards(initialCards);
});

// Функция для открытия поп-апа, добавляет класс popup_is-opened
function openModal(popup) {
  popup.classList.add('popup_is-opened');
}

// Функция для закрытия поп-апа, удаляет класс popup_is-opened
function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}
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

// Закрытие поп-апа при нажатии на область вне поп-апа
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('popup_is-opened')) {
    closeModal(event.target);
  }
});
// Создаю обработчик события для кнопки "сохранить"
document.addEventListener('DOMContentLoaded', () => {
  const profileFormElement = document.querySelector('.popup__button[type="submit"]'); // Выбор кнопки «Сохранить»
  const nameInput = document.querySelector('.popup__input_type_name'); // Поле ввода имени
  const descriptionInput = document.querySelector('.popup__input_type_description'); // Поле ввода описания
  const nameDisplay = document.querySelector('.profile__title'); // Элемент, отображающий имя
  const descriptionDisplay = document.querySelector('.profile__description'); // Элемент, отображающий описание

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
const newCardForm = document.querySelector('.popup_type_new-card');
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
