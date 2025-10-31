// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    setupEventHandlers();
    updateStats();
});

// Загрузка отзывов из localStorage
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewsList = document.getElementById('reviewsList');
    const emptyReviews = document.getElementById('emptyReviews');
    
    if (reviews.length === 0) {
        reviewsList.style.display = 'none';
        emptyReviews.style.display = 'block';
        return;
    }
    
    reviewsList.style.display = 'flex';
    emptyReviews.style.display = 'none';
    
    // Сортируем отзывы
    const sortBy = document.getElementById('sortReviews').value;
    const sortedReviews = sortReviews(reviews, sortBy);
    
    // Очищаем список
    reviewsList.innerHTML = '';
    
    // Добавляем отзывы
    sortedReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsList.appendChild(reviewElement);
    });
}

// Создание элемента отзыва
function createReviewElement(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    // Форматируем дату
    const reviewDate = new Date(review.date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Создаем звезды рейтинга
    const starsHTML = createStarsHTML(review.rating);
    
    // Получаем название услуги
    const serviceNames = {
        'purchase': 'Покупка часов',
        'repair': 'Ремонт часов',
        'buyout': 'Скупка часов',
        'consultation': 'Консультация',
        'other': 'Другая услуга'
    };
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-name">${review.name}</div>
                ${review.service ? `<div class="review-service">${serviceNames[review.service] || review.service}</div>` : ''}
            </div>
            <div class="review-date">${reviewDate}</div>
        </div>
        
        <div class="review-rating">
            ${starsHTML}
        </div>
        
        <div class="review-text">
            ${review.text}
        </div>
        
        <div class="review-footer">
            <div class="review-id">ID: ${review.id}</div>
            <div class="review-actions">
                <button class="like-btn" data-id="${review.id}">
                    👍 Полезно (${review.likes || 0})
                </button>
                <button class="report-btn" data-id="${review.id}">
                    ⚐ Пожаловаться
                </button>
            </div>
        </div>
    `;
    
    return reviewCard;
}

// Создание HTML для звезд рейтинга
function createStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<span class="star">★</span>';
        } else {
            starsHTML += '<span class="star empty">★</span>';
        }
    }
    return starsHTML;
}

// Сортировка отзывов
function sortReviews(reviews, sortBy) {
    switch (sortBy) {
        case 'newest':
            return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
            return reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'highest':
            return reviews.sort((a, b) => b.rating - a.rating);
        case 'lowest':
            return reviews.sort((a, b) => a.rating - b.rating);
        default:
            return reviews;
    }
}

// Настройка обработчиков событий
function setupEventHandlers() {
    // Отправка формы отзыва
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addReview();
    });
    
    // Сортировка отзывов
    document.getElementById('sortReviews').addEventListener('change', function() {
        loadReviews();
    });
    
    // Лайки и жалобы
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('like-btn')) {
            const reviewId = e.target.dataset.id;
            likeReview(reviewId);
        }
        
        if (e.target.classList.contains('report-btn')) {
            const reviewId = e.target.dataset.id;
            reportReview(reviewId);
        }
    });
}

// Добавление нового отзыва
function addReview() {
    const form = document.getElementById('reviewForm');
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const rating = parseInt(formData.get('rating'));
    const service = formData.get('service');
    const text = formData.get('text');
    
    // Валидация
    if (!name || !rating || !text) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Создаем новый отзыв
    const newReview = {
        id: 'REV-' + Date.now(),
        name: name,
        rating: rating,
        service: service,
        text: text,
        date: new Date().toISOString(),
        likes: 0,
        reported: false
    };
    
    // Сохраняем в localStorage
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Очищаем форму
    form.reset();
    
    // Показываем сообщение об успехе
    showSuccessMessage('Спасибо! Ваш отзыв успешно опубликован.');
    
    // Обновляем список отзывов и статистику
    loadReviews();
    updateStats();
}

// Лайк отзыва
function likeReview(reviewId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex !== -1) {
        if (!reviews[reviewIndex].likes) {
            reviews[reviewIndex].likes = 0;
        }
        reviews[reviewIndex].likes++;
        localStorage.setItem('reviews', JSON.stringify(reviews));
        loadReviews();
    }
}

// Жалоба на отзыв
function reportReview(reviewId) {
    if (!confirm('Вы уверены, что хотите пожаловаться на этот отзыв?')) {
        return;
    }
    
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].reported = true;
        localStorage.setItem('reviews', JSON.stringify(reviews));
        alert('Спасибо! Мы проверим этот отзыв.');
    }
}

// Обновление статистики
function updateStats() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Общее количество отзывов
    document.getElementById('totalReviews').textContent = reviews.length;
    
    // Средний рейтинг
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);
        document.getElementById('averageRating').textContent = averageRating;
    } else {
        document.getElementById('averageRating').textContent = '0.0';
    }
}

// Показать сообщение об успехе
function showSuccessMessage(message) {
    // Создаем элемент сообщения
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #E8F5E8;
        color: #2E7D32;
        padding: 16px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        max-width: 400px;
        border: 1px solid #C8E6C9;
        animation: slideInRight 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Добавляем стили для анимации
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