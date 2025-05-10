//подключаемся к серверу(условно)
const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
    headers: {
      authorization: 'fec4067f-f71a-4209-9bf0-a47e5ffd1c2c',
      'Content-Type': 'application/json'
    }
  }
//получаем карточки с сервера
  export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    });
  };

//Получаем id пользователя
// Функция для получения информации о пользователе
export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers
  })
  .then(response => {
      if (!response.ok) {
          return Promise.reject(`Ошибка: ${res.status}`);
      }
      return response.json();
  });
};

//функция перезаписывает данные имени и описания профиля на сервере
  export function updateProfile(name, about) {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers, 
        body: JSON.stringify({
            name: name,
            about: about
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка при обновлении профиля ${response.status}`);
        }
        return response.json();
    })
    .then(updatedUser => {
        console.log('Профиль обновлен:', updatedUser); // Выводим обновленные данные в консоль
        return updatedUser;
      });
};

//функция обновления аватара
export function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
        headers: config.headers, 
        body: JSON.stringify({
            avatar: avatarUrl
        })
  })
  .then(response => {
  if (!response.ok) {
    throw new Error(`Ошибка при обновлении аватара: ${response.status}`);
  }
  return response.json();
});
}

//Отправим данные новой карточки на сервер
export function addNewCard(data) {
    return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка при создании карточки: ${response.status}`);
        }
        return response.json();
    });
};

//Функция добавления лайка
export function addLike(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка добавления лайка: ${response.status}`);
        }
        return response.json();
    });
};

//Функция удаления лайка
export function removeLike(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE', 
    headers: config.headers
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка удаления лайка: ${response.status}`);
    }
    return response.json();
  })
};

//функция удаления карточки с сервера
export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  })
  .then(response => {
    if(!response) {
      throw new Error(`Ошибка удаления карточки: ${response.status}`);
    }
    return response.json();
  });
};