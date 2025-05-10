
const imagePopupContent = document.querySelector('.popup_type_image');
import { openModal } from './modal.js';
import { addLike, removeLike, deleteCard } from './api.js';

// Функция для создания карточки
export function createCard(cardData, currentUserId) {
    const cardTemplate = document.getElementById('card-template').content;
    const cardElement = cardTemplate.cloneNode(true);
  
    // Заполняем карточку данными
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likesCount = cardElement.querySelector('.card__likes-count');
  
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    likesCount.textContent = cardData.likes.length;

    // Проверяем, являемся ли мы владельцем созданной карточки
    if (cardData.owner._id === currentUserId) {
      deleteButton.style.display = 'block';
      deleteButton.addEventListener('click', () => {
          // Запрос на удаление карточки
          deleteCard(cardData._id)
          .then(() => {
              console.log('Карточка удалена');
              const cardToDelete = deleteButton.closest('.card'); 
              if (cardToDelete) {
                  cardToDelete.remove();
              }
          })
          .catch(error => console.error(error));
      });
    } else {
      deleteButton.style.display = 'none';
    }

    //нужно проверить ставил ли пользователь уже лайк
    if (cardData.likes.some(like => like._id === currentUserId)) {
      likeButton.classList.add('card__like-button_is-active'); // Если пользователь уже поставил лайк
  } else {
      likeButton.classList.remove('card__like-button_is-active'); // Если пользователь ещё не ставил лайк
  }
  
    // Добавляем обработчик события для кнопки лайка
    likeButton.addEventListener('click', () => {
      likeButton.classList.toggle('card__like-button_is-active');

      if (!cardData._id) {
        console.error('ID карточки не определен');
        return;
    }
      if (likeButton.classList.contains('card__like-button_is-active')) {
        addLike(cardData._id)
        .then(updatedCard => {
          console.log('Лайк поставлен', updatedCard);
          likesCount.textContent = updatedCard.likes.length;
        })
        .catch(error => console.log(error))
      } else {
        removeLike(cardData._id)
        .then(updatedCard => {
          console.log('Лайк убран', updatedCard);
          likesCount.textContent = updatedCard.likes.length;
        })
        .catch(error => console.log(error));
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