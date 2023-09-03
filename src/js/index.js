// Получение всех изображений в слайдере
const images = document.querySelectorAll('.slider .slider__line img');
// Получение элемента с классом "slider__line"
const sliderLine = document.querySelector('.slider__line');
// Получение кнопки для прокрутки влево
const buttonPrev = document.querySelector('.slider__prev');
// Получение кнопки для прокрутки вправо
const buttonNext = document.querySelector('.slider__next');
// Инициализация переменной "count" для отслеживания текущего слайда
let count = 0;
// Инициализация переменной "width" для хранения ширины слайдера
let width;

// Функция для инициализации слайдера и его свойств
function init() {
    // Получение текущей ширины элемента "slider" и сохранение в переменной "width"
    width = document.querySelector('.slider').offsetWidth;
    // Установка общей ширины линии слайдера в зависимости от количества изображений
    sliderLine.style.width = width * images.length + 'px';
    // Применение числа "width" для ширины каждого изображения и установка высоты в 'auto'
    images.forEach(item => {
        item.style.width = width + 'px';
        item.style.height = 'auto';
    });
}

// Добавление обработчика событий на изменение размера окна, вызывающего функцию "init"
window.addEventListener('resize', init);
// Вызов функции "init" также во время загрузки скрипта
init();

// Установка начальной прозрачности кнопки "buttonPrev"
buttonPrev.style.opacity = 0.5;

// Добавление обработчика события на нажатие кнопки "slider-prev"
buttonPrev.addEventListener('click', () => {
    // Уменьшение значения переменной "count"
    count--;

    // Проверка, чтобы "count" не стал отрицательным
    if(count < 0) {
        count += 1;
    }

    // Изменение стиля кнопки "buttonPrev", если достигли первого слайда
    if (count === 0) {
        buttonPrev.style.opacity = 0.5;
    }

    // Возврат стиля кнопки "buttonNext" при возврате назад с последнего слайда
    if (count !== images.length - 1) {
        buttonNext.style.opacity = 1;
    }

    // Вызов функции для прокрутки слайдера
    rollSlider();
});

// Добавление обработчика события на нажатие кнопки "slider-next"
buttonNext.addEventListener('click', () => {
    // Увеличение значения переменной "count"
    count++;

    // Проверка, чтобы "count" не стал больше, чем количество изображений в слайдере
    if(count > images.length - 1) {
        count -= 1;
    }

    // Изменение стиля кнопки "buttonNext", если достигли последнего слайда
    if(count === images.length - 1) {
        buttonNext.style.opacity = 0.5;
    }

    // Возврат стиля кнопки "buttonPrev" при продолжении прокрутки из первого слайда
    if (count !== 0) {
        buttonPrev.style.opacity = 1;
    }

    // Вызов функции для прокрутки слайдера
    rollSlider();
});

// Функция для прокрутки (перемещения) слайдера на основе значения переменной "count"
function rollSlider() {
    sliderLine.style.transform = 'translate(-' + count * width + 'px)';
}


// Зафиксированая кнопка на всём протяжении скролла
const scrollButton = document.getElementById('scroll-button');

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 500) {
        if (window.scrollY > 0) {
            scrollButton.style.display = "block";
        }
        else {
            scrollButton.style.display = "none";
        }

        let scrollTimeout;

        window.addEventListener("scroll", () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollButton.style.display = "none";
            }, 1000);
        });
    } 
});