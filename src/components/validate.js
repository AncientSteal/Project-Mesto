//общая валидация
import { createCard } from './card.js';
import { closeModal } from './modal.js';
export const toggleButtonState = (inputs, buttonElement) => {
    let isValid = true;

    inputs.forEach(input => {
        if (!input.validity.valid) {
            isValid = false;
            showInputError(input);
        } else {
            hideInputError(input);
        }
    });

    buttonElement.classList.toggle('popup__button_state_inactive', !isValid);
    buttonElement.disabled = !isValid;
};

const showInputError = (input) => {
    const errorElement = document.querySelector(`.${input.name}-error`);
    if (errorElement) {
        errorElement.textContent = input.validity.valueMissing ? 'Вы пропустили это поле.' :
                                   input.validity.typeMismatch ? 'Введите корректный URL.' :
                                   input.validity.tooShort ? 'Минимальное количество символов: 2.' :
                                   '';
    }
};

const hideInputError = (input) => {
    const errorElement = document.querySelector(`.${input.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
};
//валидация редактирования профиля
export const validateProfileForm = (formElement) => {
    const nameInput = formElement.querySelector('.popup__input_type_name');
    const descriptionInput = formElement.querySelector('.popup__input_type_description');
    const saveButton = formElement.querySelector('.popup__button');

    // Добавляем класс для неактивного состояния при загрузке
    saveButton.classList.add('popup__button_state_inactive');
    saveButton.disabled = true; // Делаем кнопку недоступной

    nameInput.addEventListener('input', () => toggleButtonState([nameInput, descriptionInput], saveButton));
    descriptionInput.addEventListener('input', () => toggleButtonState([nameInput, descriptionInput], saveButton));

    formElement.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!nameInput.validity.valid || !descriptionInput.validity.valid) return;

        // Обновляем отображаемые текстовые значения
        const nameDisplay = document.querySelector('.profile__title');
        const descriptionDisplay = document.querySelector('.profile__description');
        nameDisplay.textContent = nameInput.value;
        descriptionDisplay.textContent = descriptionInput.value;

        // Закрываем поп-ап
        closeModal(document.querySelector('.popup_type_edit'));
    });
};

//валидация редактирования аватара
export const validateAvatarForm = (avatarFormElement) => {
    const avatarLinkInput = avatarFormElement.querySelector('.popup__input_type_avatar-url');
    const addButton = avatarFormElement.querySelector('.popup__button');

    // Добавляем класс для неактивного состояния при загрузке
    addButton.classList.add('popup__button_state_inactive');
    addButton.disabled = true; // Делаем кнопку недоступной

    avatarLinkInput.addEventListener('input', () => toggleButtonState([avatarLinkInput], addButton));

    avatarFormElement.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!isValidURL(avatarLinkInput.value)) return;

        // Закрываем поп-ап
        closeModal(document.querySelector('.popup_type_edit-avatar'));

        // Сбрасываем форму
        avatarFormElement.reset();
        
        // Инициализируем проверку валидности при сбросе формы
        toggleButtonState([avatarLinkInput], addButton);
    });
};

// Валидация добавления карточки
export const validateNewCardForm = (formElement, placesList, cardPopup) => {
    const placeNameInput = formElement.querySelector('.popup__input_type_card-name');
    const placeLinkInput = formElement.querySelector('.popup__input_type_url');
    const addButton = formElement.querySelector('.popup__button');

    // Добавляем класс для неактивного состояния при загрузке
    addButton.classList.add('popup__button_state_inactive');
    addButton.disabled = true; // Делаем кнопку недоступной

    placeNameInput.addEventListener('input', () => toggleButtonState([placeNameInput, placeLinkInput], addButton));
    placeLinkInput.addEventListener('input', () => toggleButtonState([placeNameInput, placeLinkInput], addButton));

    formElement.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Проверяем валидность полей перед отправкой формы
        if (!placeNameInput.validity.valid || !isValidURL(placeLinkInput.value)) return;

        // Создаем новую карточку
        const newCardData = { name: placeNameInput.value, link: placeLinkInput.value };
        const newCardElement = createCard(newCardData);
        
        // Добавляем карточку в начало списка
        placesList.prepend(newCardElement);

        // Закрываем поп-ап
        closeModal(cardPopup);

        // Сбрасываем форму
        formElement.reset();
        
        // Инициализируем проверку валидности при сбросе формы
        toggleButtonState([placeNameInput, placeLinkInput], addButton);
    });
};


// Функция для проверки валидности URL
export const isValidURL = (url) => {
  try {
      new URL(url); // Если URL некорректный, будет выброшено исключение
      return true; // Если URL корректный, возвращаем true
  } catch (e) {
      return false; // Если возникло исключение, URL некорректный
  }
};