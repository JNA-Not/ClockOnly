// js/scr.js

// Переключение между формами входа и регистрации
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchLink = document.getElementById('switchLink');
    const switchText = document.getElementById('switchText');

    // Обработчик переключения форм
    switchLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (loginForm.style.display !== 'none') {
            // Переключаем на регистрацию
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            switchText.innerHTML = 'Уже есть аккаунт? <a href="#" id="switchLink">Войти</a>';
        } else {
            // Переключаем на вход
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            switchText.innerHTML = 'Нет аккаунта? <a href="#" id="switchLink">Зарегистрироваться</a>';
        }
        
        // Обновляем обработчик для новой ссылки
        document.getElementById('switchLink').addEventListener('click', arguments.callee);
    });

    // Обработчик формы входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Валидация
        if (!validateEmail(email)) {
            showError('Пожалуйста, введите корректный email');
            return;
        }
        
        if (password.length < 6) {
            showError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        // Имитация успешного входа
        showSuccess('Вход выполнен успешно! Перенаправление на главную страницу...');
        console.log('Вход:', { email, password });
       
        // Редирект на главную страницу через 2 секунды
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });

    // Обработчик формы регистрации
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const agreement = document.querySelector('input[name="agreement"]').checked;
        
        // Валидация
        if (name.length < 2) {
            showError('Имя должно содержать минимум 2 символа');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Пожалуйста, введите корректный email');
            return;
        }
        
        if (!validatePhone(phone)) {
            showError('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        if (password.length < 6) {
            showError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Пароли не совпадают');
            return;
        }
        
        if (!agreement) {
            showError('Необходимо согласиться с условиями использования');
            return;
        }
        
        // Имитация успешной регистрации
        showSuccess('Регистрация прошла успешно! Автоматический вход...');
        console.log('Регистрация:', { name, email, phone, password });

        
        // Автоматическое переключение на форму входа и редирект
        setTimeout(() => {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            switchText.innerHTML = 'Нет аккаунта? <a href="#" id="switchLink">Зарегистрироваться</a>';
            document.getElementById('switchLink').addEventListener('click', switchLink.click);
            
            // Заполняем форму входа
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            // Показываем сообщение об автоматическом входе
            showSuccess('Автоматический вход... Перенаправление на главную страницу...');
            
            // Редирект на главную страницу через 2 секунды
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 2000);
    });

    // Валидация email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Валидация телефона
    function validatePhone(phone) {
        const re = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    // Показать сообщение об ошибке
    function showError(message) {
        // Удаляем предыдущие сообщения
        removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error';
        errorDiv.style.cssText = `
            background: #FFE6E6;
            color: #D32F2F;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #FFCDD2;
            font-size: 0.9rem;
        `;
        errorDiv.textContent = message;
        
        const activeForm = loginForm.style.display !== 'none' ? loginForm : registerForm;
        activeForm.insertBefore(errorDiv, activeForm.firstChild);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Показать сообщение об успехе
    function showSuccess(message) {
        // Удаляем предыдущие сообщения
        removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'message success';
        successDiv.style.cssText = `
            background: #E8F5E8;
            color: #2E7D32;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #C8E6C9;
            font-size: 0.9rem;
        `;
        successDiv.textContent = message;
        
        const activeForm = loginForm.style.display !== 'none' ? loginForm : registerForm;
        activeForm.insertBefore(successDiv, activeForm.firstChild);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }

    // Удалить все сообщения
    function removeMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => message.remove());
    }

    // Добавляем кнопку "Назад" функциональность для логотипа
    document.querySelector('.logo a').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
    });
});