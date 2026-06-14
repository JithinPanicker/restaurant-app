// 1. Database of all our food items
const foodDatabase = {
    'chicken-biryani': {
        name: 'Chicken Biryani',
        price: 180,
        desc: 'Aromatic basmati rice cooked with chicken, herbs and spices.',
        img: 'menu-images/Chicken-biriyani.png'
    },
    'paneer-butter-masala': {
        name: 'Paneer Butter Masala',
        price: 160,
        desc: 'Rich and creamy curry made with paneer, spices, onions, tomatoes, and butter.',
        img: 'menu-images/Paneer-Butter-Masala.png'
    },
    'veg-fried-rice': {
        name: 'Veg Fried Rice',
        price: 140,
        desc: 'Flavorful stir-fried rice tossed with fresh mixed vegetables and soy sauce.',
        img: 'menu-images/Veg-Fried-Rice.png'
    },
    'chicken-curry': {
        name: 'Chicken Curry',
        price: 170,
        desc: 'Traditional spicy and savory chicken curry slow-cooked to perfection.',
        img: 'menu-images/Chicken-Curry.png'
    }
};

// 2. Initialize Cart & Variables
let cart = JSON.parse(localStorage.getItem('restaurant_cart')) || [];
let currentDetailQty = 1;

// 3. Update the red cart badge across all pages
function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}

// 4. Run immediately when any page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    // -- IF ON FOOD DETAILS PAGE --
    if (window.location.pathname.includes('food-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const foodId = urlParams.get('id');
        const food = foodDatabase[foodId];

        if (food) {
            document.getElementById('detail-img').src = food.img;
            document.getElementById('detail-title').innerText = food.name;
            document.getElementById('detail-price').innerText = '₹' + food.price;
            document.getElementById('detail-desc').innerText = food.desc;
        } else {
            document.getElementById('detail-title').innerText = "Dish not found";
        }
    }

    // -- IF ON CART PAGE --
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
});

// ==========================================
// FOOD DETAILS PAGE FUNCTIONS
// ==========================================

function changeQty(change) {
    const qtyElement = document.getElementById('detail-qty');
    if (!qtyElement) return;
    currentDetailQty += change;
    if (currentDetailQty < 1) currentDetailQty = 1; 
    qtyElement.innerText = currentDetailQty;
}

function updateCharCount(textarea) {
    const countElement = document.getElementById('char-count');
    if (countElement) {
        countElement.innerText = `${textarea.value.length}/100`;
    }
}

function addCurrentItemToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const instructions = document.getElementById('special-inst') ? document.getElementById('special-inst').value : '';

    if (id && foodDatabase[id]) {
        // Check if exact item with exact instructions exists
        let existingItem = cart.find(item => item.id === id && item.instructions === instructions);
        
        if (existingItem) {
            existingItem.quantity += currentDetailQty;
        } else {
            cart.push({ ...foodDatabase[id], id: id, quantity: currentDetailQty, instructions: instructions });
        }
        
        localStorage.setItem('restaurant_cart', JSON.stringify(cart));
        window.location.href = 'menu.html'; // Go back to menu
    }
}

// ==========================================
// CART PAGE FUNCTIONS
// ==========================================

function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal-amt');
    const taxEl = document.getElementById('tax-amt');
    const totalEl = document.getElementById('total-amt');
    
    if (!container) return; 
    
    container.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty.</p>';
        subtotalEl.innerText = '₹0';
        taxEl.innerText = '₹0';
        totalEl.innerText = '₹0';
        return;
    }

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Show special instructions if they exist
        let instructionsHtml = item.instructions ? `<p style="font-size:11px; color:#888; margin:2px 0;">Note: ${item.instructions}</p>` : '';

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <h4>${item.name}</h4>
                        <span class="delete-btn" onclick="removeFromCart('${item.id}')">🗑️</span>
                    </div>
                    <p class="price" style="margin: 2px 0;">₹${item.price}</p>
                    ${instructionsHtml}
                    <div class="cart-item-actions">
                        <div class="qty-controls" style="display:flex; gap:10px; align-items:center;">
                            <button onclick="updateCartQty('${item.id}', -1)" style="border:1px solid #ccc; background:none; border-radius:4px; padding:2px 8px;">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartQty('${item.id}', 1)" style="border:1px solid #ccc; background:none; border-radius:4px; padding:2px 8px;">+</button>
                        </div>
                        <span class="item-total">₹${itemTotal}</span>
                    </div>
                </div>
            </div>
        `;
    });

    let tax = Math.round(subtotal * 0.05); 
    let finalTotal = subtotal + tax;

    subtotalEl.innerText = `₹${subtotal}`;
    taxEl.innerText = `₹${tax}`;
    totalEl.innerText = `₹${finalTotal}`;
}

function updateCartQty(id, change) {
    let item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('restaurant_cart', JSON.stringify(cart));
            renderCartPage();
            updateCartBadge();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('restaurant_cart', JSON.stringify(cart));
    renderCartPage();
    updateCartBadge();
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('Service Worker Error', err));
    });
}