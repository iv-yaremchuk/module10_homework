// Задание 3

const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
const btnGeo = document.querySelector('.btn-geo');
const chat = document.querySelector('.chat');
const wsUrl = 'wss://echo-ws-service.herokuapp.com';

let websocket;

// Создаём событие oninput с логикой валидации ввода,
// запрещающей отправку "пустого" сообщения
input.oninput = () => {
  if (input.value && input.value[0] !== ' ') {
    btn.removeAttribute('disabled', '');
  } else {
    input.value = '';
    btn.setAttribute('disabled', '');
  }
};
// создаём обработчик события click, при нажатии
// на кнопку отправляется на сервер результат ввода
// пользователя, также он добавляется в html,
// принемается ответ сервера и добавляется в html,
// очищается input
btn.addEventListener('click', sendMessage)

function sendMessage(e) {
  e.preventDefault();
  websocket.send(input.value);
  addMessage(input.value, 'sender');
  websocket.onmessage = function (evt) {
    addMessage(evt.data, 'recipient');
  };
  input.value = '';
  btn.setAttribute('disabled', '');
}

// Создаём функцию вставки переданных данных в
// соответствующий тег html, приемающий содержание
// и название класса css, отражающий тип сообщения
function addMessage(message, type) {
  chat.innerHTML += `
  <p class="message ${type}">${message}</p>
  `;
  let lastMessage = document.querySelector(".message:last-child")
  lastMessage.scrollIntoView({behavior: "smooth", block: "center", inline: "end"})
}

function addStatus(text) {
  chat.innerHTML = `
  <p class="message status">${text}</p>
  `;
}

// Создаём обработчик события click, при нажатие на
// кнопку, вызывается функция определения геолокации
// формирование ссылки на часть карты, соответствующий
// переданным ранее координатам, готовая ссылка передаётся
// в функцию добавления сообщения в разметку(addMessage)
btnGeo.addEventListener('click', getGeoLocation);

function getGeoLocation(e) {
  e.preventDefault();
  const error = () => {
    addStatus(`Невозможно получить ваше местоположение`)
    btnGeo.setAttribute('disabled', '');
  };
  const success = (position) => {
    btnGeo.removeAttribute('disabled', '');
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    let geoMessage = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" class="link" target="_blank">Гео-локация</a>`;
    websocket.send(geoMessage);
    websocket.onmessage = function (evt) {
      addMessage(evt.data, 'sender');
    };
  };

  if (!navigator.geolocation) {
    alert('Geolocation не поддерживается вашим браузером');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  websocket = new WebSocket(wsUrl);
  websocket.onopen = function () {
    addStatus(`Соединение установленно`)

  };
});
