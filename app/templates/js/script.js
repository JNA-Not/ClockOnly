// script.js

// Создание делений циферблата
function createClockMarkers() {
    const markersContainer = document.getElementById('clockMarkers');
    
    for (let i = 0; i < 60; i++) {
        const marker = document.createElement('div');
        marker.className = i % 5 === 0 ? 'marker main' : 'marker';
        marker.style.transform = `rotate(${i * 6}deg)`;
        markersContainer.appendChild(marker);
    }
}

// Управление стрелками
function updateClockHands(targetHour, targetMinute) {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    
    // Рассчитываем угол для часовой стрелки (30 градусов на час + 0.5 градуса на минуту)
    const hourAngle = (targetHour % 12) * 30 + targetMinute * 0.5;
    // Рассчитываем угол для минутной стрелки (6 градусов на минуту)
    const minuteAngle = targetMinute * 6;
    
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
}

// Плавная прокрутка к элементу
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Обработчики событий для кнопок
function setupButtonInteractions() {
    const buttons = document.querySelectorAll('.clock-button');
    
    buttons.forEach(button => {
        // При наведении на кнопку
        button.addEventListener('mouseenter', function() {
            const hour = parseInt(this.getAttribute('data-hour'));
            // Устанавливаем минутную стрелку на 0 (ровно на час)
            updateClockHands(hour, 0);
        });
        
        // При уходе с кнопки - возвращаем к текущему времени
        button.addEventListener('mouseleave', function() {
            setCurrentTime();
        });
        
        // Клик по кнопке
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const buttonText = this.textContent;
            const href = this.getAttribute('href');
            
            console.log(`Нажата кнопка: ${buttonText}`);
            
            // Обработка разных типов ссылок
            if (href && href.startsWith('#')) {
                // Внутренняя ссылка - плавная прокрутка
                const targetId = href.substring(1);
                smoothScrollTo(targetId);
            } else if (href && href.endsWith('.html')) {
                // Внешняя ссылка - переход на другую страницу
                window.location.href = href;
            } else {
                // Обработка других кнопок
                switch(buttonText) {
                    case 'Оценка онлайн':
                        // Можно добавить модальное окно или переход
                        console.log('Открыть оценку онлайн');
                        break;
                    case 'Контакты':
                        smoothScrollTo('contacts');
                        break;
                    case 'О компании':
                        smoothScrollTo('about');
                        break;
                    case 'Отзывы':
                        // Можно добавить переход к отзывам
                        console.log('Показать отзывы');
                        break;
                    case 'Доставка':
                        // Можно добавить информацию о доставке
                        console.log('Информация о доставке');
                        break;
                    case 'Гарантия':
    smoothScrollTo('warranty');
    break;
                    case 'FAQ':
                        // Можно добавить раздел FAQ
                        console.log('Часто задаваемые вопросы');
                        break;
                        case 'Ремонт':
    window.location.href = 'remont.html';
    break;
                    default:
                        console.log(`Обработка для "${buttonText}" не реализована`);
                        case 'Скупка часов':
    window.location.href = 'skup.html';
    break;
                    case 'Корзина':
    window.location.href = 'korzina.html';
    break;
                }
            }
        });
    });
}

// Установка текущего времени
function setCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    updateClockHands(hours, minutes);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    createClockMarkers();
    setupButtonInteractions();
    setCurrentTime();
    
    // Обновление времени каждую минуту
    setInterval(setCurrentTime, 60000);
    
    // Обработка якорных ссылок при загрузке страницы
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        setTimeout(() => {
            smoothScrollTo(targetId);
        }, 100);
    }
});

