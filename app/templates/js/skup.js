// scup.js

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initFileUpload();
    initEvaluationForm();
    initSmoothScroll();
});

// Инициализация загрузки файлов
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('photos');
    const uploadedFiles = document.getElementById('uploadedFiles');
    const maxFiles = 5;
    let currentFiles = [];

    // Клик по области загрузки
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // Перетаскивание файлов
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#00A896';
        uploadArea.style.backgroundColor = '#FFFFFF';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#E9ECEF';
        uploadArea.style.backgroundColor = '#F8F9FA';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#E9ECEF';
        uploadArea.style.backgroundColor = '#F8F9FA';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Выбор файлов через input
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        const remainingSlots = maxFiles - currentFiles.length;
        
        if (files.length > remainingSlots) {
            showMessage(`Можно загрузить не более ${maxFiles} файлов`, 'error');
            return;
        }

        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            
            if (!file.type.startsWith('image/')) {
                showMessage('Пожалуйста, загружайте только изображения', 'error');
                continue;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB
                showMessage('Размер файла не должен превышать 5MB', 'error');
                continue;
            }

            currentFiles.push(file);
            displayFile(file);
        }

        fileInput.value = '';
    }

    function displayFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = function() {
            const index = currentFiles.indexOf(file);
            if (index > -1) {
                currentFiles.splice(index, 1);
            }
            fileItem.remove();
        };
        
        fileItem.appendChild(fileName);
        fileItem.appendChild(removeBtn);
        uploadedFiles.appendChild(fileItem);
    }
}

// Инициализация формы оценки
function initEvaluationForm() {
    const form = document.getElementById('evaluationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitEvaluation();
        }
    });

    // Валидация телефона в реальном времени
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        e.target.value = formatPhoneNumber(e.target.value);
    });
}

// Валидация формы
function validateForm() {
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
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

// Отправка формы оценки
function submitEvaluation() {
    const form = document.getElementById('evaluationForm');
    const submitBtn = form.querySelector('.submit-button');
    const originalText = submitBtn.textContent;

    // Показываем индикатор загрузки
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    // Имитация отправки на сервер
    setTimeout(() => {
        showMessage('Заявка успешно отправлена! Наш эксперт свяжется с вами в течение 15 минут', 'success');
        
        // Сброс формы
        form.reset();
        document.getElementById('uploadedFiles').innerHTML = '';
        
        // Восстановление кнопки
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        console.log('Данные формы отправлены на сервер');
    }, 2000);
}

// Валидация телефона
function validatePhone(phone) {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
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
    
    // Автоматическое удаление через 5 секунд
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