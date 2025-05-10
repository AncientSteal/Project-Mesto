// Функция для закрытия поп-апа по клавише Esc
function closeByEsc(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
};

// Функция для открытия поп-апа, добавляет класс popup_is-opened
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEsc);
};

// Функция для закрытия поп-апа, удаляет класс popup_is-opened
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEsc);
};

// Закрытие поп-апа при нажатии на область вне поп-апа
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('popup_is-opened')) {
    closeModal(event.target);
  }
});