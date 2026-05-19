// ============================================
// SINCERE OUTLINE - COMPLETE JAVASCRIPT
// ============================================

// Product Database
const allProducts = [
    { id: 1, name: "Classic V‑Neck Tunic", desc: "Premium cotton blend, refined elegance", price: 350.00, tier: "Essential", category: "tops", icon: "👔" },
    { id: 2, name: "Tailored Straight Leg Trouser", desc: "Impeccable fit, timeless design", price: 380.00, tier: "Essential", category: "bottoms", icon: "👖" },
    { id: 3, name: "Modern Zip‑Front Jacket", desc: "Contemporary style, expert craftsmanship", price: 420.00, tier: "Premium", category: "jackets", icon: "🧥" },
    { id: 4, name: "Executive Stretch Pants", desc: "Sophisticated comfort, superior quality", price: 420.00, tier: "Premium", category: "bottoms", icon: "👖" },
    { id: 5, name: "Prestigious Complete Set", desc: "Jacket + trousers, 8 exquisite colors", price: 650.00, tier: "Luxury", category: "sets", icon: "👚" },
    { id: 6, name: "High‑Waist Premium Scrub", desc: "Flattering silhouette, refined elegance", price: 480.00, tier: "Premium", category: "bottoms", icon: "👖" },
    { id: 7, name: "Wrap Tunic with Distinction", desc: "Graceful design, adjustable precision", price: 450.00, tier: "Premium", category: "tops", icon: "👔" },
    { id: 8, name: "Cargo Professional Set", desc: "Utility sophistication + premium jersey", price: 720.00, tier: "Luxury", category: "sets", icon: "👚" },
    { id: 9, name: "Luxe Couture Ensemble", desc: "Premium stretch crepe, exemplary design", price: 850.00, tier: "Luxury", category: "sets", icon: "👚" },
    { id: 10, name: "Oversized Tunic with Finesse", desc: "Elegant draping, sophisticated flair", price: 480.00, tier: "Premium", category: "tops", icon: "👔" },
    { id: 11, name: "Signature Asymmetric Design", desc: "Exclusive cut, distinguished aesthetic", price: 520.00, tier: "Luxury", category: "tops", icon: "👔" },
    { id: 12, name: "Kimono-Style Professional Top", desc: "Asian-inspired elegance, refined appeal", price: 580.00, tier: "Luxury", category: "tops", icon: "👔" },
    { id: 13, name: "Distinguished Waistcoat", desc: "Layerable sophistication, impeccable style", price: 500.00, tier: "Premium", category: "jackets", icon: "🧥" },
    { id: 14, name: "Elegant Professional Dress", desc: "Timeless femininity meets functionality", price: 620.00, tier: "Luxury", category: "sets", icon: "👚" },
    { id: 15, name: "Bespoke Embroidered Collection", desc: "Personalized monogram, exquisite detail +R80", price: 800.00, tier: "Signature", category: "sets", icon: "✨" }
];

// ============================================
// CART SYSTEM (LocalStorage)
// ============================================

function getCart() {
    const cart = localStorage.getItem('sincereCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('sincereCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} added to cart! 🛒`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}

function updateQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity) || 1);
        saveCart(cart);
        renderCartPage();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('sincereCart');
        updateCartCount();
        renderCartPage();
        showToast('Cart cleared');
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartCount() {
    const count = getCartCount();
    const countElements = document.querySelectorAll('#cartCount');
    countElements.forEach(el => {
        el.textContent = count;
    });
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = count === 0;
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// PRODUCT CARD CREATION
// ============================================
function createProductCard(product, showAddToCart = true) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img">${product.icon || '✨'}</div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-desc">${product.desc} • ${product.tier}</div>
                <div class="price">R${product.price.toFixed(2)}</div>
                ${showAddToCart ? `
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

// ============================================
// PAGE INITIALIZATION
// ============================================

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function initHomePage() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) {
        const featured = allProducts.slice(0, 6);
        featuredGrid.innerHTML = featured.map(p => createProductCard(p)).join('');
    }
}

function initShopPage() {
    const shopGrid = document.getElementById('shopGrid');
    if (shopGrid) {
        displayFilteredProducts();
        setupFilters();
    }
}

function displayFilteredProducts() {
    const shopGrid = document.getElementById('shopGrid');
    const productCount = document.getElementById('productCount');
    if (!shopGrid) return;

    let filtered = [...allProducts];
    const activeFilters = getActiveFilters();
    
    if (activeFilters.categories.length > 0) {
        filtered = filtered.filter(p => activeFilters.categories.includes(p.category));
    }
    if (activeFilters.tiers.length > 0) {
        filtered = filtered.filter(p => activeFilters.tiers.includes(p.tier));
    }
    if (activeFilters.prices.length > 0) {
        filtered = filtered.filter(p => {
            return activeFilters.prices.some(range => {
                if (range === '0-400') return p.price < 400;
                if (range === '400-600') return p.price >= 400 && p.price < 600;
                if (range === '600-800') return p.price >= 600 && p.price < 800;
                if (range === '800+') return p.price >= 800;
                return false;
            });
        });
    }

    const sortValue = document.getElementById('sortSelect')?.value;
    if (sortValue === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sortValue === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sortValue === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sortValue === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));

    shopGrid.innerHTML = filtered.map(p => createProductCard(p)).join('');
    if (productCount) {
        productCount.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
    }
}

function getActiveFilters() {
    const categories = [];
    const tiers = [];
    const prices = [];
    document.querySelectorAll('.filter-checkbox:checked').forEach(cb => {
        if (cb.dataset.filter === 'category') categories.push(cb.value);
        if (cb.dataset.filter === 'tier') tiers.push(cb.value);
        if (cb.dataset.filter === 'price') prices.push(cb.value);
    });
    return { categories, tiers, prices };
}

function setupFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.addEventListener('change', displayFilteredProducts);
    });
}

function clearFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    displayFilteredProducts();
}

function sortProducts() {
    displayFilteredProducts();
}

function initCollectionsPage() {
    const tiers = {
        essential: allProducts.filter(p => p.tier === 'Essential'),
        premium: allProducts.filter(p => p.tier === 'Premium'),
        luxury: allProducts.filter(p => p.tier === 'Luxury'),
        signature: allProducts.filter(p => p.tier === 'Signature')
    };
    for (const [tier, products] of Object.entries(tiers)) {
        const grid = document.getElementById(`${tier}Grid`);
        if (grid && products.length > 0) {
            grid.innerHTML = products.map(p => createProductCard(p)).join('');
        }
    }
}

function initCartPage() {
    renderCartPage();
}

function renderCartPage() {
    const cart = getCart();
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartItemCount = document.getElementById('cartItemCount');
    
    if (!cartItemsList) return; // Not on cart page
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartItems) cartItems.style.display = 'grid';
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartItemCount) cartItemCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.icon || '✨'}</div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">R${item.price.toFixed(2)} each</p>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${item.id}, this.value)">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <p><strong>Total: R${(item.price * item.quantity).toFixed(2)}</strong></p>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal >= 600 ? 0 : 80;
    const total = subtotal + shipping;
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    const shippingNote = document.getElementById('shippingNote');
    
    if (subtotalEl) subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `R${total.toFixed(2)}`;
    if (shippingNote) {
        if (shipping === 0) {
            shippingNote.textContent = '🎉 Congratulations! You qualify for free shipping!';
            shippingNote.style.background = '#e8f5e9';
            shippingNote.style.color = '#2e7d32';
        } else {
            const remaining = 600 - subtotal;
            shippingNote.textContent = `Add R${remaining.toFixed(2)} more for free shipping!`;
            shippingNote.style.background = '#fff3e0';
            shippingNote.style.color = '#e65100';
        }
    }
}

function initCheckoutPage() {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    const orderItems = document.getElementById('orderItems');
    if (orderItems) {
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-details">
                    <h4>${item.name} × ${item.quantity}</h4>
                    <p>R${item.price.toFixed(2)} each</p>
                </div>
                <div class="order-item-total">R${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    const subtotal = getCartTotal();
    const shipping = subtotal >= 600 ? 0 : 80;
    const total = subtotal + shipping;
    
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (summarySubtotal) summarySubtotal.textContent = `R${subtotal.toFixed(2)}`;
    if (summaryShipping) summaryShipping.textContent = shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `R${total.toFixed(2)}`;
}

// ============================================
// CHECKOUT & WHATSAPP INTEGRATION
// ============================================

function goToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    window.location.href = 'checkout.html';
}

function submitOrder(event) {
    if (event) event.preventDefault();
    
    const firstName = document.getElementById('firstName')?.value;
    const lastName = document.getElementById('lastName')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    const city = document.getElementById('city')?.value;
    const province = document.getElementById('province')?.value;
    const notes = document.getElementById('notes')?.value;
    
    if (!firstName || !lastName || !email || !phone || !address || !city || !province) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Store order details for modal
    window.orderDetails = {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        province,
        notes
    };
    
    showConfirmModal();
}

function showConfirmModal() {
    const modal = document.getElementById('confirmModal');
    const modalOrderDetails = document.getElementById('modalOrderDetails');
    
    if (!modal || !modalOrderDetails) return;
    
    const cart = getCart();
    const subtotal = getCartTotal();
    const shipping = subtotal >= 600 ? 0 : 80;
    const total = subtotal + shipping;
    
    let orderSummary = `
        <p><strong>Customer:</strong> ${window.orderDetails.firstName} ${window.orderDetails.lastName}</p>
        <p><strong>Email:</strong> ${window.orderDetails.email}</p>
        <p><strong>Phone:</strong> ${window.orderDetails.phone}</p>
        <p><strong>Address:</strong> ${window.orderDetails.address}, ${window.orderDetails.city}, ${window.orderDetails.province}</p>
        <hr style="margin: 10px 0;">
        <p><strong>Order Items:</strong></p>
    `;
    
    cart.forEach(item => {
        orderSummary += `<p>• ${item.name} × ${item.quantity} = R${(item.price * item.quantity).toFixed(2)}</p>`;
    });
    
    orderSummary += `
        <hr style="margin: 10px 0;">
        <p><strong>Subtotal:</strong> R${subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ${shipping === 0 ? 'FREE' : 'R' + shipping.toFixed(2)}</p>
        <p><strong>Total:</strong> R${total.toFixed(2)}</p>
    `;
    
    if (window.orderDetails.notes) {
        orderSummary += `<p><strong>Notes:</strong> ${window.orderDetails.notes}</p>`;
    }
    
    modalOrderDetails.innerHTML = orderSummary;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.classList.remove('show');
}

function sendToWhatsApp() {
    const cart = getCart();
    const subtotal = getCartTotal();
    const shipping = subtotal >= 600 ? 0 : 80;
    const total = subtotal + shipping;
    const details = window.orderDetails;
    
    let message = `*NEW ORDER - SINCERE OUTLINE*%0A%0A`;
    message += `*Customer Details:*%0A`;
    message += `Name: ${details.firstName} ${details.lastName}%0A`;
    message += `Email: ${details.email}%0A`;
    message += `Phone: ${details.phone}%0A`;
    message += `Address: ${details.address}, ${details.city}, ${details.province}%0A%0A`;
    
    message += `*Order Items:*%0A`;
    cart.forEach(item => {
        message += `• ${item.name} × ${item.quantity} = R${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    message += `%0A*Summary:*%0A`;
    message += `Subtotal: R${subtotal.toFixed(2)}%0A`;
    message += `Shipping: ${shipping === 0 ? 'FREE' : 'R' + shipping.toFixed(2)}%0A`;
    message += `*TOTAL: R${total.toFixed(2)}*%0A`;
    
    if (details.notes) {
        message += `%0A*Notes:* ${details.notes}%0A`;
    }
    
    message += `%0APlease confirm my order and provide payment details. Thank you! 🙏`;
    
    // WhatsApp number: +27 68 133 3036 (remove + and spaces)
    const whatsappNumber = '27681333036';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    closeModal();
    window.open(whatsappURL, '_blank');
    
    // Clear cart after sending
    localStorage.removeItem('sincereCart');
    updateCartCount();
}

// ============================================
// NAVIGATION & UTILITIES
// ============================================
function navigateTo(url) {
    window.location.href = url;
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Update cart count everywhere
    updateCartCount();
    
    // Page-specific initialization
    if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    } else if (currentPage === 'shop.html') {
        initShopPage();
        // URL params for shop
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            const checkbox = document.querySelector(`.filter-checkbox[value="${category}"]`);
            if (checkbox) {
                checkbox.checked = true;
                displayFilteredProducts();
            }
        }
    } else if (currentPage === 'collections.html') {
        initCollectionsPage();
    } else if (currentPage === 'cart.html') {
        initCartPage();
    } else if (currentPage === 'checkout.html') {
        initCheckoutPage();
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            showToast(`Thanks for subscribing, ${email}!`);
            this.reset();
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            const subject = encodeURIComponent(data.subject || 'Contact Form Message');
            const body = encodeURIComponent(
                `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\n\nMessage:\n${data.message}`
            );
            window.location.href = `mailto:sincere_outline@hotmail.com?subject=${subject}&body=${body}`;
            showToast('Opening email client...');
            this.reset();
        });
    }
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('confirmModal');
    if (e.target === modal) {
        closeModal();
    }
});

function updateCartCount() {
    const count = getCartCount();
    const countElements = document.querySelectorAll('#cartCount');
    
    countElements.forEach(el => {
        const oldCount = parseInt(el.textContent) || 0;
        el.textContent = count;
        
        // Add animation class if count changed
        if (count > oldCount) {
            el.classList.add('has-items');
            setTimeout(() => el.classList.remove('has-items'), 500);
        }
        
        // Show/hide based on count
        if (count > 0) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    });
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = count === 0;
        if (count === 0) {
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
        } else {
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
        }
    }
}