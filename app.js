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
// --- NEW LOGIC FOR FOOD DETAILS PAGE ---

let currentDetailQty = 1;

// Handle + and - buttons on details page
function changeQty(change) {
    const qtyElement = document.getElementById('detail-qty');
    if (!qtyElement) return;

    currentDetailQty += change;
    if (currentDetailQty < 1) currentDetailQty = 1; // Prevent going below 1
    qtyElement.innerText = currentDetailQty;
}

// Handle character count on text area
function updateCharCount(textarea) {
    const countElement = document.getElementById('char-count');
    if (countElement) {
        countElement.innerText = `${textarea.value.length}/100`;
    }
}

// Add specifically from the details page
function addDetailsToCart(name, price) {
    // Get special instructions if any
    const instructions = document.getElementById('special-inst') ? document.getElementById('special-inst').value : '';
    
    // Check if item is already in cart
    let existingItem = cart.find(item => item.name === name && item.instructions === instructions);
    
    if (existingItem) {
        existingItem.quantity += currentDetailQty;
    } else {
        cart.push({ name, price, quantity: currentDetailQty, instructions });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Alert and send user back to menu
    alert(`${currentDetailQty}x ${name} added to cart!`);
    window.location.href = 'menu.html';
}
