// Load cart from phone's local storage or start empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update badge as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if(countEl) {
        countEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Add to Cart Logic
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    // Save to phone's storage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Error', err));
    });
}