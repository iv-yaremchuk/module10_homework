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
btn.addEventListener('click', function (e) {
  e.preventDefault();
  websocket.send(input.value);
  addMessage(input.value, 'sender');
  websocket.onmessage = function (evt) {
    addMessage(evt.data, 'recipient');
  };
  input.value = '';
  btn.setAttribute('disabled', '');
});

// Создаём функцию вставки переданных данных в
// соответствующий тег html, приемающий содержание
// и название класса css, отражающий тип сообщения
function addMessage(message, type) {
  chat.innerHTML += `
  <p class="messange ${type}">${message}</p>
  `;
}

// Создаём обработчик события click, при нажатие на
// кнопку, вызывается функция определения геолокации
// формирование ссылки на часть карты, соответствующий
// переданным ранее координатам, готовая ссылка передаётся
// в функцию добавления сообщения в разметку(addMessage)
btnGeo.addEventListener('click', (e) => {
  e.preventDefault();
  getGeoLocation();
});

function getGeoLocation() {
  const error = () => {
    alert('Невозможно получить ваше местоположение');
  };
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`${latitude} , ${longitude}`);
    let geoMessage = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" class="link" target="_blank">Гео-локация</a>`;
    websocket.send(geoMessage);
    addMessage(geoMessage, 'sender');
    websocket.onmessage = function (evt) {
      addMessage(evt.data, 'recipient');
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
    console.log('connected');
  };
});
