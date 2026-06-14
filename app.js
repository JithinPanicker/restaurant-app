// Load cart from phone's local storage or start empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentDetailQty = 1;
let currentLoadedFood = null; // Remembers which food is currently open on details page

// Database of all our food items
const foodDatabase = {
    'chicken-biryani': {
        name: 'Chicken Biryani',
        price: 180,
        desc: 'Aromatic basmati rice cooked with chicken, herbs and spices.',
        image: 'menu-images/Chicken-biriyani.png' // Reusing menu images
    },
    'paneer-butter-masala': {
        name: 'Paneer Butter Masala',
        price: 160,
        desc: 'Rich and creamy curry made with paneer, spices, onions, tomatoes, and butter.',
        image: 'menu-images/Paneer-Butter-Masala.png'
    },
    'veg-fried-rice': {
        name: 'Veg Fried Rice',
        price: 140,
        desc: 'Flavorful stir-fried rice tossed with fresh mixed vegetables and soy sauce.',
        image: 'menu-images/Veg-Fried-Rice.png'
    },
    'chicken-curry': {
        name: 'Chicken Curry',
        price: 170,
        desc: 'Traditional spicy and savory chicken curry slow-cooked to perfection.',
        image: 'menu-images/Chicken-Curry.png'
    }
};

// Run when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // DYNAMIC FOOD DETAILS INJECTION
    // Check if we are currently on the food-details.html page
    if (window.location.pathname.includes('food-details.html')) {
        // Get the ?id=... from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const foodId = urlParams.get('id');
        
        // Find the matching food in our database
        const food = foodDatabase[foodId];

        if (food) {
            // Inject data into the HTML
            document.getElementById('detail-img').src = food.image;
            document.getElementById('detail-title').innerText = food.name;
            document.getElementById('detail-price').innerText = '₹' + food.price;
            document.getElementById('detail-desc').innerText = food.desc;
            
            // Save this food in memory so the Add to Cart button knows what to add
            currentLoadedFood = food;
        } else {
            document.getElementById('detail-title').innerText = "Dish not found";
        }
    }
});

// Update badge icon
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if(countEl) {
        countEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Quick Add to Cart (Used on menu.html)
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, instructions: '' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Handle + and - buttons on details page
function changeQty(change) {
    const qtyElement = document.getElementById('detail-qty');
    if (!qtyElement) return;

    currentDetailQty += change;
    if (currentDetailQty < 1) currentDetailQty = 1; 
    qtyElement.innerText = currentDetailQty;
}

// Handle character count on text area
function updateCharCount(textarea) {
    const countElement = document.getElementById('char-count');
    if (countElement) {
        countElement.innerText = `${textarea.value.length}/100`;
    }
}

// Add specifically from the dynamic details page
function addDynamicDetailsToCart() {
    if (!currentLoadedFood) return; // Failsafe

    const name = currentLoadedFood.name;
    const price = currentLoadedFood.price;
    const instructions = document.getElementById('special-inst') ? document.getElementById('special-inst').value : '';
    
    let existingItem = cart.find(item => item.name === name && item.instructions === instructions);
    
    if (existingItem) {
        existingItem.quantity += currentDetailQty;
    } else {
        cart.push({ name, price, quantity: currentDetailQty, instructions });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`${currentDetailQty}x ${name} added to cart!`);
    window.location.href = 'menu.html';
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Error', err));
    });
}