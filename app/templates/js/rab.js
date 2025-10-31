// Обработка формы заявки
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobApplicationForm');
    const positionSelect = document.getElementById('position');
    const customPositionGroup = document.getElementById('customPositionGroup');
    const customPositionInput = document.getElementById('customPosition');
    const applyButtons = document.querySelectorAll('.apply-vacancy');

    // Показать/скрыть поле для ввода своей должности
    positionSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customPositionGroup.style.display = 'block';
            customPositionInput.required = true;
        } else {
            customPositionGroup.style.display = 'none';
            customPositionInput.required = false;
        }
    });

    // Обработка кнопок отклика на вакансии
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const position = this.getAttribute('data-position');
            const positionMap = {
                'watchmaker': 'Часовщик',
                'appraiser': 'Эксперт-оценщик',
                'consultant': 'Продавец-консультант'
            };
            
            if (positionMap[position]) {
                positionSelect.value = position;
                // Триггерим событие change для обновления формы
                positionSelect.dispatchEvent(new Event('change'));
                
                // Прокрутка к форме
                form.scrollIntoView({ behavior: 'smooth' });
                
                // Фокус на первом поле формы
                document.getElementById('fullName').focus();
            }
        });
    });

    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация формы
        if (!validateForm()) {
            return;
        }
        
        // Сбор данных формы
        const formData = new FormData(this);
        const applicationData = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            position: formData.get('position') === 'other' ? formData.get('customPosition') : formData.get('position'),
            experience: formData.get('experience'),
            message: formData.get('message'),
            resume: formData.get('resume') ? formData.get('resume').name : 'Не прикреплено',
            timestamp: new Date().toLocaleString('ru-RU')
        };
        
        // В реальном приложении здесь был бы AJAX-запрос к серверу
        console.log('Данные заявки:', applicationData);
        
        // Показ сообщения об успехе
        showSuccessMessage();
        
        // Очистка формы
        form.reset();
        customPositionGroup.style.display = 'none';
    });

    // Валидация формы
    function validateForm() {
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const agreement = document.getElementById('agreement').checked;
        
        // Простая валидация телефона
        const phoneRegex = /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            alert('Пожалуйста, введите корректный номер телефона');
            return false;
        }
        
        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Пожалуйста, введите корректный email адрес');
            return false;
        }
        
        // Проверка согласия
        if (!agreement) {
            alert('Необходимо согласие на обработку персональных данных');
            return false;
        }
        
        return true;
    }

    // Показ сообщения об успешной отправке
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #00A896;
            color: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;
        
        successMessage.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: white;">Заявка отправлена!</h3>
            <p style="margin-bottom: 1.5rem;">Мы свяжемся с вами в ближайшее время для обсуждения вакансии.</p>
            <button onclick="this.parentElement.remove()" style="
                background: white;
                color: #00A896;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            ">OK</button>
        `;
        
        document.body.appendChild(successMessage);
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (successMessage.parentElement) {
                successMessage.remove();
            }
        }, 5000);
    }

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }
        
        if (value.length > 0) {
            value = '+7 (' + value;
            
            if (value.length > 7) {
                value = value.substring(0, 7) + ') ' + value.substring(7);
            }
            if (value.length > 12) {
                value = value.substring(0, 12) + '-' + value.substring(12);
            }
            if (value.length > 15) {
                value = value.substring(0, 15) + '-' + value.substring(15);
            }
        }
        
        e.target.value = value;
    });

    // Ограничение размера файла
    const resumeInput = document.getElementById('resume');
    resumeInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('Файл слишком большой. Максимальный размер: 5MB');
                e.target.value = '';
            }
        }
    });
});

// Добавляем обработку нажатия кнопки "Работа у нас" на главной странице
// Этот код должен быть добавлен в script.js на главной странице
function setupWorkButton() {
    const workButton = document.querySelector('.clock-button[data-hour="11"]');
    if (workButton) {
        workButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'rab.html';
        });
    }
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupWorkButton);
} else {
    setupWorkButton();
}