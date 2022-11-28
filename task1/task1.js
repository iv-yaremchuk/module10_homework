// Задание 1

const btn = document.querySelector('.btn');

// Создаём функцию добавления класса при нажатии на
// кнопку, если переданный класс отсутствует,
// добавляем его, иначе убераем
function changeInnerIcon() {
  btn.classList.toggle('is-filled');
}

btn.addEventListener('click', changeInnerIcon);
