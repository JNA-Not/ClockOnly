// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // checkAuthentication();
    loadCartItems();
    setupEventHandlers();
});

// Проверка авторизации
function checkAuthentication() {
    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    if (!isUserLoggedIn) {
        alert('Пожалуйста, войдите в систему для доступа к корзине');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }
}

// Загрузка товаров из корзины
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');

    if (cartItems.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        updateCartSummary(0, 0);
        return;
    }

    cartContent.style.display = 'grid';
    emptyCart.style.display = 'none';

    cartItemsContainer.innerHTML = '';
    let itemsTotal = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        itemsTotal += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-image">
                ${item.type === 'product' ? '⌚' : '🔧'}
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-type">${item.type === 'product' ? 'Товар' : 'Услуга'}</p>
                <p class="item-description">${item.description || ''}</p>
                <div class="item-price">${formatPrice(item.price)}₽ × ${item.quantity}</div>
            </div>
            <div class="item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <div class="item-total">${formatPrice(itemTotal)}₽</div>
                <button class="remove-item" data-index="${index}">🗑️</button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    updateCartSummary(itemsTotal, 0);
}

// Обновление итоговой суммы
function updateCartSummary(itemsTotal, deliveryCost = 0) {
    const totalAmount = itemsTotal + deliveryCost;
    
    document.getElementById('itemsTotal').textContent = formatPrice(itemsTotal) + '₽';
    document.getElementById('deliveryCost').textContent = formatPrice(deliveryCost) + '₽';
    document.getElementById('totalAmount').textContent = formatPrice(totalAmount) + '₽';

    // Активируем/деактивируем кнопку оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = itemsTotal === 0;
}

// Настройка обработчиков событий
function setupEventHandlers() {
    // Кнопки количества
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const index = parseInt(e.target.dataset.index);
            const isPlus = e.target.classList.contains('plus');
            updateQuantity(index, isPlus ? 1 : -1);
        }

        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        }
    });

    // Кнопка оформления заказа
    document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);

    // Закрытие модального окна
    document.querySelector('.close-modal').addEventListener('click', closeCheckoutModal);
    document.getElementById('checkoutModal').addEventListener('click', function(e) {
        if (e.target === this) closeCheckoutModal();
    });

    // Переключение способа доставки
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function(e) {
            const deliveryAddress = document.getElementById('deliveryAddress');
            deliveryAddress.style.display = e.target.value === 'courier' ? 'block' : 'none';
            updateDeliveryCost(e.target.value);
        });
    });

    // Отправка формы заказа
    document.getElementById('checkoutForm').addEventListener('submit', submitOrder);
}

// Обновление количества товара
function updateQuantity(index, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems[index]) {
        cartItems[index].quantity += change;
        
        if (cartItems[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            loadCartItems();
        }
    }
}

// Удаление товара из корзины
function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCartItems();
}

// Открытие модального окна оформления заказа
function openCheckoutModal() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length === 0) return;

    // Заполняем сводку заказа
    const modalOrderSummary = document.getElementById('modalOrderSummary');
    let itemsTotal = 0;
    let orderHTML = '';

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemsTotal += itemTotal;
        orderHTML += `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>${formatPrice(itemTotal)}₽</span>
            </div>
        `;
    });

    const deliveryCost = document.querySelector('input[name="delivery"]:checked').value === 'courier' ? 500 : 0;
    const totalAmount = itemsTotal + deliveryCost;

    orderHTML += `
        <div class="order-total">
            <strong>Итого: ${formatPrice(totalAmount)}₽</strong>
        </div>
    `;

    modalOrderSummary.innerHTML = orderHTML;

    // Заполняем данные пользователя из localStorage
    document.getElementById('checkoutName').value = localStorage.getItem('userName') || '';
    document.getElementById('checkoutPhone').value = localStorage.getItem('userPhone') || '';
    document.getElementById('checkoutEmail').value = localStorage.getItem('userEmail') || '';

    // Показываем модальное окно
    document.getElementById('checkoutModal').classList.add('active');
}

// Закрытие модального окна
function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Обновление стоимости доставки
function updateDeliveryCost(deliveryType) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let itemsTotal = 0;
    
    cartItems.forEach(item => {
        itemsTotal += item.price * item.quantity;
    });

    const deliveryCost = deliveryType === 'courier' ? 500 : 0;
    updateCartSummary(itemsTotal, deliveryCost);
}

// Отправка заказа
function submitOrder(e) {
    e.preventDefault();
    
    const formData = new FormData(document.getElementById('checkoutForm'));
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    const order = {
        items: [...cartItems],
        delivery: formData.get('delivery'),
        address: formData.get('delivery') === 'courier' ? formData.get('address') : 'Самовывоз',
        deliveryDate: formData.get('deliveryDate'),
        deliveryTime: formData.get('deliveryTime'),
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email')
        },
        comments: formData.get('comments'),
        orderDate: new Date().toISOString(),
        orderId: 'ORD-' + Date.now()
    };
    
    // Сохраняем заказ в localStorage
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    orders.push(order);
    localStorage.setItem('userOrders', JSON.stringify(orders));
    
    // Очищаем корзину
    localStorage.removeItem('cartItems');
    
    // Закрываем модальное окно
    closeCheckoutModal();
    
    // Показываем сообщение об успехе
    alert(`Заказ успешно оформлен! Номер вашего заказа: ${order.orderId}\nС вами свяжутся в ближайшее время.`);
    
    // Перезагружаем страницу
    loadCartItems();
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}