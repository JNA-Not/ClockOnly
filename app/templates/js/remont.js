// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initRepairForm();
    initSmoothScroll();
    initPhoneMask();
});

// Инициализация формы ремонта
function initRepairForm() {
    const form = document.getElementById('repairForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateRepairForm()) {
            submitRepairForm();
        }
    });
}

// Валидация формы ремонта
function validateRepairForm() {
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const problem = document.getElementById('problem').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (!brand) {
        showMessage('Пожалуйста, выберите бренд часов', 'error');
        return false;
    }

    if (!model.trim()) {
        showMessage('Пожалуйста, укажите модель часов', 'error');
        return false;
    }

    if (!problem) {
        showMessage('Пожалуйста, выберите тип проблемы', 'error');
        return false;
    }

    if (!name.trim()) {
        showMessage('Пожалуйста, введите ваше имя', 'error');
        return false;
    }

    if (!validatePhone(phone)) {
        showMessage('Пожалуйста, введите корректный номер телефона', 'error');
        return false;
    }

    return true;
}

// Отправка формы ремонта
function submitRepairForm() {
    const form = document.getElementById('repairForm');
    const submitBtn = form.querySelector('.submit-button');
    const originalText = submitBtn.textContent;

    // Показываем индикатор загрузки
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    // Имитация отправки на сервер
    setTimeout(() => {
        showMessage('Заявка на ремонт успешно отправлена! Наш мастер свяжется с вами в течение 30 минут', 'success');
        
        // Сброс формы
        form.reset();
        
        // Восстановление кнопки
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        console.log('Данные формы ремонта отправлены на сервер');
    }, 2000);
}

// Валидация телефона
function validatePhone(phone) {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Маска для телефона
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        e.target.value = formatPhoneNumber(e.target.value);
    });
}

// Форматирование номера телефона
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    
    let formatted = '+7 ';
    
    if (cleaned.length > 1) {
        formatted += '(' + cleaned.substring(1, 4);
    }
    if (cleaned.length >= 4) {
        formatted += ') ' + cleaned.substring(4, 7);
    }
    if (cleaned.length >= 7) {
        formatted += '-' + cleaned.substring(7, 9);
    }
    if (cleaned.length >= 9) {
        formatted += '-' + cleaned.substring(9, 11);
    }
    
    return formatted;
}

// Плавная прокрутка
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Показать сообщение
function showMessage(message, type) {
    removeMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#E8F5E8';
        messageDiv.style.color = '#2E7D32';
        messageDiv.style.border = '1px solid #C8E6C9';
    } else {
        messageDiv.style.background = '#FFE6E6';
        messageDiv.style.color = '#D32F2F';
        messageDiv.style.border = '1px solid #FFCDD2';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Удалить все сообщения
function removeMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => message.remove());
}

// Добавляем CSS для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);