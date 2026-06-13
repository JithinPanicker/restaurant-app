let cart = [];
const TAX = 30;

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    if(screenId === 'cart-screen') renderCart();
}

// Add to Cart Logic
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    alert(name + " added to cart!");
}

// Render Cart
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p class="price">₹${item.price} x ${item.quantity}</p>
                    </div>
                    <p class="price">₹${item.price * item.quantity}</p>
                </div>
            `;
        });
    }

    document.getElementById('subtotal').innerText = '₹' + subtotal;
    let total = subtotal > 0 ? subtotal + TAX : 0;
    document.getElementById('total-amount').innerText = '₹' + total;
}

function placeOrder() {
    if(cart.length === 0) return alert("Add items to cart first!");
    alert("Order Placed Successfully! (This is a frontend prototype)");
    cart = [];
    document.getElementById('cart-count').innerText = 0;
    showScreen('welcome-screen');
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Error', err));
    });
}