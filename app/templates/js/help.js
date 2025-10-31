// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initQuestionForm();
    initCategoryFilter();
    initSearch();
});

// Инициализация FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Добавляем CSS для плавных переходов
    const faqStyle = document.createElement('style');
    faqStyle.textContent = `
        .faq-item {
            transition: all 0.3s ease;
        }
        .faq-answer {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(faqStyle);
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    otherToggle.textContent = '+';
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
            const toggle = item.querySelector('.faq-toggle');
            toggle.textContent = item.classList.contains('active') ? '−' : '+';
            
            // Плавная прокрутка к открытому элементу
            if (!isActive && item.classList.contains('active')) {
                setTimeout(() => {
                    item.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            }
        });
    });
}

// Инициализация фильтра по категориям
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSection = document.querySelector('.faq-section');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Обновляем активную кнопку
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Плавная прокрутка к разделу FAQ
            faqSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Фильтруем FAQ элементы
            let visibleItems = 0;
            faqItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    visibleItems++;
                    // Добавляем анимацию появления
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Если нет видимых элементов, показываем сообщение
            if (visibleItems === 0) {
                showNoResultsMessage();
            } else {
                removeNoResultsMessage();
            }
        });
    });
}

// Инициализация формы вопроса
function initQuestionForm() {
    const form = document.getElementById('questionForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitQuestion();
    });
    
    // Добавляем валидацию в реальном времени
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Валидация поля формы
function validateField(field) {
    const value = field.value.trim();
    
    switch(field.type) {
        case 'text':
            if (field.name === 'name' && value.length < 2) {
                showFieldError(field, 'Имя должно содержать минимум 2 символа');
                return false;
            }
            if (field.name === 'title' && value.length < 5) {
                showFieldError(field, 'Тема вопроса должна содержать минимум 5 символов');
                return false;
            }
            break;
            
        case 'email':
            if (!validateEmail(value)) {
                showFieldError(field, 'Пожалуйста, введите корректный email');
                return false;
            }
            break;
            
        case 'textarea':
            if (value.length < 10) {
                showFieldError(field, 'Описание вопроса должно содержать минимум 10 символов');
                return false;
            }
            break;
    }
    
    clearFieldError(field);
    return true;
}

// Показать ошибку поля
function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#F44336';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #F44336;
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Очистить ошибку поля
function clearFieldError(field) {
    field.style.borderColor = '#E9ECEF';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Отправка вопроса
function submitQuestion() {
    const form = document.getElementById('questionForm');
    const formData = new FormData(form);
    
    const questionData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        category: formData.get('category'),
        title: formData.get('title').trim(),
        text: formData.get('text').trim(),
        date: new Date().toISOString(),
        id: 'Q-' + Date.now()
    };
    
    // Валидация всех полей
    let isValid = true;
    const fields = form.querySelectorAll('input[required], textarea[required]');
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showError('Пожалуйста, исправьте ошибки в форме');
        return;
    }
    
    // Проверка согласия на обработку данных
    const agreeCheckbox = form.querySelector('input[name="agree"]');
    if (!agreeCheckbox.checked) {
        showError('Необходимо согласие на обработку персональных данных');
        return;
    }
    
    // Сохраняем вопрос в localStorage (в реальном приложении отправляем на сервер)
    saveQuestion(questionData);
    
    // Очищаем форму
    form.reset();
    
    // Показываем сообщение об успехе
    showSuccessMessage('Ваш вопрос отправлен! Мы ответим вам в течение 2 часов.');
    
    // Анимация успешной отправки
    const submitBtn = form.querySelector('.submit-question-btn');
    submitBtn.textContent = '✓ Отправлено!';
    submitBtn.style.background = '#4CAF50';
    
    setTimeout(() => {
        submitBtn.textContent = 'Отправить вопрос';
        submitBtn.style.background = '#00A896';
    }, 3000);
}

// Валидация вопроса
function validateQuestion(data) {
    if (!data.name || data.name.length < 2) {
        showError('Пожалуйста, введите ваше имя (минимум 2 символа)');
        return false;
    }
    
    if (!data.email || !validateEmail(data.email)) {
        showError('Пожалуйста, введите корректный email');
        return false;
    }
    
    if (!data.title || data.title.length < 5) {
        showError('Пожалуйста, введите тему вопроса (минимум 5 символов)');
        return false;
    }
    
    if (!data.text || data.text.length < 10) {
        showError('Пожалуйста, подробно опишите ваш вопрос (минимум 10 символов)');
        return false;
    }
    
    return true;
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Сохранение вопроса
function saveQuestion(questionData) {
    const questions = JSON.parse(localStorage.getItem('userQuestions')) || [];
    questions.push(questionData);
    localStorage.setItem('userQuestions', JSON.stringify(questions));
    
    console.log('Вопрос сохранен:', questionData);
    
    // В реальном приложении здесь будет отправка на сервер
    // sendToServer(questionData);
}

// Показать сообщение об ошибке
function showError(message) {
    showMessage(message, 'error');
}

// Показать сообщение об успехе
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

// Показать сообщение
function showMessage(message, type) {
    // Удаляем предыдущие сообщения
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#E8F5E8';
        messageDiv.style.color = '#2E7D32';
        messageDiv.style.border = '2px solid #4CAF50';
    } else {
        messageDiv.style.background = '#FFEBEE';
        messageDiv.style.color = '#C62828';
        messageDiv.style.border = '2px solid #F44336';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Автоматическое скрытие сообщения
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.parentElement.removeChild(messageDiv);
                }
            }, 300);
        }
    }, 5000);
}

// Удаление всех сообщений
function removeMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        if (message.parentElement) {
            message.parentElement.removeChild(message);
        }
    });
}

// Сообщение, когда нет результатов
function showNoResultsMessage() {
    const faqList = document.querySelector('.faq-list');
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.style.cssText = `
            text-align: center;
            padding: 3rem;
            color: #6C757D;
            font-style: italic;
            background: #FFFFFF;
            border-radius: 12px;
            margin: 2rem 0;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        `;
        noResultsMsg.innerHTML = `
            <h3 style="color: #1E2A3A; margin-bottom: 1rem;">😊 Пока нет вопросов в этой категории</h3>
            <p>Но вы можете задать свой вопрос через форму ниже!</p>
        `;
        faqList.appendChild(noResultsMsg);
    }
    
    noResultsMsg.style.display = 'block';
}

// Удаление сообщения о отсутствии результатов
function removeNoResultsMessage() {
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Инициализация поиска по FAQ
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.placeholder = '🔍 Поиск по вопросам...';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 12px 20px;
        border: 2px solid #E9ECEF;
        border-radius: 25px;
        font-size: 1rem;
        margin: 0 auto 2rem auto;
        display: block;
        transition: border-color 0.3s ease;
    `;
    
    const faqSection = document.querySelector('.faq-section h2');
    faqSection.parentNode.insertBefore(searchInput, faqSection.nextSibling);
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const faqItems = document.querySelectorAll('.faq-item');
        let foundItems = 0;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                foundItems++;
                
                // Подсветка найденного текста
                highlightText(item, searchTerm);
            } else {
                item.style.display = 'none';
                removeHighlight(item);
            }
        });
        
        // Показываем сообщение, если ничего не найдено
        const searchResults = document.querySelector('.search-results-message');
        if (searchTerm && foundItems === 0) {
            if (!searchResults) {
                const message = document.createElement('div');
                message.className = 'search-results-message';
                message.style.cssText = `
                    text-align: center;
                    padding: 2rem;
                    color: #6C757D;
                    font-style: italic;
                    background: #FFFFFF;
                    border-radius: 12px;
                    margin: 2rem 0;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                `;
                message.textContent = 'По вашему запросу ничего не найдено';
                searchInput.parentNode.insertBefore(message, searchInput.nextSibling);
            }
        } else if (searchResults) {
            searchResults.remove();
        }
        
        if (!searchTerm) {
            removeHighlightAll();
        }
    });
    
    // Фокус на поиск при нажатии Ctrl+K
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Функция подсветки текста
function highlightText(element, searchTerm) {
    if (!searchTerm) return;
    
    const question = element.querySelector('.faq-question h3');
    const answer = element.querySelector('.faq-answer');
    
    [question, answer].forEach(el => {
        const text = el.innerHTML;
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        const highlighted = text.replace(regex, '<mark style="background: #FFF9C4; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        el.innerHTML = highlighted;
    });
}

// Удаление подсветки
function removeHighlight(element) {
    const question = element.querySelector('.faq-question h3');
    const answer = element.querySelector('.faq-answer');
    
    [question, answer].forEach(el => {
        el.innerHTML = el.innerHTML.replace(/<mark[^>]*>([^<]*)<\/mark>/gi, '$1');
    });
}

// Удаление всей подсветки
function removeHighlightAll() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        removeHighlight(item);
    });
}

// Экранирование специальных символов для RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Добавляем CSS анимации для сообщений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .search-input:focus {
        border-color: #00A896 !important;
        outline: none;
    }
`;
document.head.appendChild(style);

// Дополнительные утилиты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Экспорт функций для глобального использования (если нужно)
window.HelpSystem = {
    initFAQ,
    initQuestionForm,
    initCategoryFilter,
    initSearch,
    submitQuestion,
    validateEmail
};

console.log('Help system initialized successfully!');