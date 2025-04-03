
const imagePopupContent = document.querySelector('.popup_type_image');
import { openModal } from './modal.js';

// Функция для создания карточки
export function createCard(cardData) {
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
  };