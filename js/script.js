// @ts-nocheck
// ========== COMPLETE JAVASCRIPT FOR SUPERMARKET PRICE COMPARISON SYSTEM ==========
// Includes: Login Page, Registration Page, Dashboard Page

// ========== COMMON FUNCTIONS ==========

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== LOGIN PAGE FUNCTIONALITY ==========

if (document.getElementById('loginForm')) {
    
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const registerLink = document.getElementById('registerLink');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) errorElement.textContent = message;
        const inputElement = document.getElementById(fieldId);
        if (inputElement) inputElement.style.borderColor = '#ef4444';
    }
    
    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) errorElement.textContent = '';
        const inputElement = document.getElementById(fieldId);
        if (inputElement) inputElement.style.borderColor = '#e2e8f0';
    }
    
    function validateLoginForm() {
        let isValid = true;
        
        if (!emailInput.value.trim()) {
            showError('email', 'Email address is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('email');
        }
        
        if (!passwordInput.value) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearError('password');
        }
        
        return isValid;
    }
    
    async function performLogin(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    resolve({ success: true, message: 'Login successful!', user: user });
                } else {
                    resolve({ success: false, message: 'Invalid email or password. Please try again or register.' });
                }
            }, 1500);
        });
    }
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateLoginForm()) return;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        loadingOverlay.classList.add('active');
        
        try {
            const result = await performLogin(email, password);
            
            if (result.success) {
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    localStorage.setItem('isLoggedIn', 'true');
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(result.user));
                    sessionStorage.setItem('isLoggedIn', 'true');
                }
                
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            loadingOverlay.classList.remove('active');
        }
    });
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const eyeIcon = togglePasswordBtn.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (emailInput.value.trim()) {
                if (!validateEmail(emailInput.value.trim())) {
                    showError('email', 'Please enter a valid email address');
                } else {
                    clearError('email');
                }
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (passwordInput.value && passwordInput.value.length < 6) {
                showError('password', 'Password must be at least 6 characters');
            } else if (passwordInput.value) {
                clearError('password');
            }
        });
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset link will be sent to your email address.\n\nThis feature will be implemented in the next phase.');
        });
    }
    
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
    
    const rememberedUser = localStorage.getItem('currentUser');
    if (rememberedUser && emailInput) {
        try {
            const user = JSON.parse(rememberedUser);
            emailInput.value = user.email;
            if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        } catch(e) {}
    }
}

// ========== REGISTRATION PAGE FUNCTIONALITY ==========

if (document.getElementById('registerForm')) {
    
    const registerForm = document.getElementById('registerForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const locationInput = document.getElementById('location');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const loginLink = document.getElementById('loginLink');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');
    const modalLoginBtn = document.getElementById('modalLoginBtn');
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) errorElement.textContent = message;
        const inputElement = document.getElementById(fieldId);
        if (inputElement) inputElement.style.borderColor = '#ef4444';
    }
    
    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) errorElement.textContent = '';
        const inputElement = document.getElementById(fieldId);
        if (inputElement) inputElement.style.borderColor = '#e2e8f0';
    }
    
    function showSuccess(fieldId) {
        const inputElement = document.getElementById(fieldId);
        if (inputElement) inputElement.style.borderColor = '#10b981';
    }
    
    function validateRegisterForm() {
        let isValid = true;
        
        if (!fullnameInput.value.trim()) {
            showError('fullname', 'Full name is required');
            isValid = false;
        } else if (fullnameInput.value.trim().length < 3) {
            showError('fullname', 'Name must be at least 3 characters');
            isValid = false;
        } else {
            clearError('fullname');
            showSuccess('fullname');
        }
        
        if (!emailInput.value.trim()) {
            showError('email', 'Email address is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('email');
            showSuccess('email');
        }
        
        if (!passwordInput.value) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearError('password');
            showSuccess('password');
        }
        
        if (!confirmPasswordInput.value) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        } else {
            clearError('confirmPassword');
            showSuccess('confirmPassword');
        }
        
        if (!termsCheckbox.checked) {
            showError('terms', 'You must agree to the Terms of Service');
            isValid = false;
        } else {
            clearError('terms');
        }
        
        return isValid;
    }
    
    function saveUser(userData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    async function performRegistration(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const existingUser = users.find(u => u.email === userData.email);
                
                if (existingUser) {
                    resolve({ success: false, message: 'An account with this email already exists.' });
                } else {
                    saveUser(userData);
                    resolve({ success: true, message: 'Registration successful!' });
                }
            }, 1500);
        });
    }
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateRegisterForm()) return;
        
        const userData = {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            location: locationInput.value.trim() || '',
            registeredAt: new Date().toISOString()
        };
        
        loadingOverlay.classList.add('active');
        
        const result = await performRegistration(userData);
        
        loadingOverlay.classList.remove('active');
        
        if (result.success) {
            successModal.classList.add('active');
            registerForm.reset();
        } else {
            alert(result.message);
        }
    });
    
    if (modalLoginBtn) {
        modalLoginBtn.addEventListener('click', function() {
            successModal.classList.remove('active');
            window.location.href = 'index.html';
        });
    }
    
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                window.location.href = 'index.html';
            }
        });
    }
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const eyeIcon = togglePasswordBtn.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            const eyeIcon = toggleConfirmPasswordBtn.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    if (fullnameInput) {
        fullnameInput.addEventListener('input', function() {
            if (fullnameInput.value.trim()) {
                if (fullnameInput.value.trim().length < 3) {
                    showError('fullname', 'Name must be at least 3 characters');
                } else {
                    clearError('fullname');
                    showSuccess('fullname');
                }
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (emailInput.value.trim()) {
                if (!validateEmail(emailInput.value.trim())) {
                    showError('email', 'Please enter a valid email address');
                } else {
                    clearError('email');
                    showSuccess('email');
                }
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (passwordInput.value) {
                if (passwordInput.value.length < 6) {
                    showError('password', 'Password must be at least 6 characters');
                } else {
                    clearError('password');
                    showSuccess('password');
                }
            }
            if (confirmPasswordInput && confirmPasswordInput.value) {
                if (confirmPasswordInput.value !== passwordInput.value) {
                    showError('confirmPassword', 'Passwords do not match');
                } else {
                    clearError('confirmPassword');
                    showSuccess('confirmPassword');
                }
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value !== passwordInput.value) {
                showError('confirmPassword', 'Passwords do not match');
            } else {
                clearError('confirmPassword');
                showSuccess('confirmPassword');
            }
        });
    }
    
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            if (termsCheckbox.checked) {
                clearError('terms');
            }
        });
    }
    
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
    
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    
    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Terms of Service will be displayed here.');
        });
    }
    
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Privacy Policy will be displayed here.');
        });
    }
}

// ========== DASHBOARD PAGE FUNCTIONALITY ==========

if (document.querySelector('.dashboard-container')) {
    
    // Sample Product Data
    const products = [
        { id: 1, name: "White Rice (1kg)", naivas: 180, carrefour: 165, quickmart: 175 },
        { id: 2, name: "Cooking Oil (1L)", naivas: 320, carrefour: 299, quickmart: 310 },
        { id: 3, name: "Wheat Flour (1kg)", naivas: 130, carrefour: 120, quickmart: 125 },
        { id: 4, name: "Sugar (1kg)", naivas: 195, carrefour: 185, quickmart: 190 },
        { id: 5, name: "Milk (500ml)", naivas: 55, carrefour: 52, quickmart: 54 },
        { id: 6, name: "Tomato Paste (70g)", naivas: 45, carrefour: 40, quickmart: 42 },
        { id: 7, name: "Bread (400g)", naivas: 60, carrefour: 55, quickmart: 58 },
        { id: 8, name: "Eggs (1 tray)", naivas: 420, carrefour: 395, quickmart: 410 },
        { id: 9, name: "Tea Leaves (250g)", naivas: 250, carrefour: 235, quickmart: 245 },
        { id: 10, name: "Salt (500g)", naivas: 25, carrefour: 20, quickmart: 22 }
    ];
    
    let currentUser = null;
    let shoppingBasket = [];
    
    // Load User Data
    function loadUserData() {
        const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            const welcomeMessage = document.getElementById('welcomeMessage');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const profileFullname = document.getElementById('profileFullname');
            const profileEmail = document.getElementById('profileEmail');
            const profileLocation = document.getElementById('profileLocation');
            const profileDate = document.getElementById('profileDate');
            
            if (welcomeMessage) welcomeMessage.innerHTML = 'Welcome back, ' + currentUser.fullname.split(' ')[0] + '!';
            if (userName) userName.innerHTML = currentUser.fullname;
            if (userEmail) userEmail.innerHTML = currentUser.email;
            if (profileFullname) profileFullname.value = currentUser.fullname;
            if (profileEmail) profileEmail.value = currentUser.email;
            if (profileLocation) profileLocation.value = currentUser.location || '';
            if (profileDate) profileDate.value = new Date(currentUser.registeredAt).toLocaleDateString();
        } else {
            window.location.href = 'index.html';
        }
    }
    
    // Basket Functions
    function loadBasket() {
        if (currentUser) {
            const savedBasket = localStorage.getItem('basket_' + currentUser.email);
            if (savedBasket) {
                shoppingBasket = JSON.parse(savedBasket);
            }
        }
        updateBasketUI();
    }
    
    function saveBasket() {
        if (currentUser) {
            localStorage.setItem('basket_' + currentUser.email, JSON.stringify(shoppingBasket));
        }
        updateBasketUI();
        updateDashboardStats();
    }
    
    function updateBasketUI() {
        const basketContent = document.getElementById('basketContent');
        const basketCount = document.getElementById('basketCount');
        const basketItemCount = document.getElementById('basketItemCount');
        
        const totalItems = shoppingBasket.reduce(function(sum, item) {
            return sum + item.quantity;
        }, 0);
        
        if (basketCount) basketCount.innerHTML = totalItems;
        if (basketItemCount) basketItemCount.innerHTML = totalItems;
        
        if (!basketContent) return;
        
        if (shoppingBasket.length === 0) {
            basketContent.innerHTML = '<div class="empty-basket" style="text-align: center; padding: 40px;"><p>Your basket is empty. Add some products from the Search Products page!</p></div>';
            return;
        }
        
        basketContent.innerHTML = '';
        
        for (let i = 0; i < shoppingBasket.length; i++) {
            const item = shoppingBasket[i];
            const product = products.find(p => p.id === item.id);
            
            if (product) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'basket-item';
                itemDiv.style.display = 'flex';
                itemDiv.style.justifyContent = 'space-between';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.padding = '16px 20px';
                itemDiv.style.background = 'white';
                itemDiv.style.borderRadius = '16px';
                itemDiv.style.marginBottom = '12px';
                itemDiv.innerHTML = `
                    <div class="basket-item-info">
                        <h4 style="margin-bottom: 4px;">${product.name}</h4>
                        <p style="font-size: 13px; color: #64748b;">Quantity: ${item.quantity}</p>
                    </div>
                    <div class="basket-item-quantity" style="display: flex; align-items: center; gap: 12px;">
                        <button onclick="window.updateQuantity(${i}, -1)" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e2e8f0; background: white; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="window.updateQuantity(${i}, 1)" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e2e8f0; background: white; cursor: pointer;">+</button>
                    </div>
                    <div class="basket-item-price" style="font-weight: 600; color: #1e293b; min-width: 80px; text-align: right;">
                        KSh ${(item.quantity * item.lowestPrice).toLocaleString()}
                    </div>
                    <button class="remove-item-btn" onclick="window.removeItem(${i})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 18px;">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                basketContent.appendChild(itemDiv);
            }
        }
    }
    
    window.updateQuantity = function(index, change) {
        if (shoppingBasket[index]) {
            const newQuantity = shoppingBasket[index].quantity + change;
            if (newQuantity <= 0) {
                shoppingBasket.splice(index, 1);
            } else {
                shoppingBasket[index].quantity = newQuantity;
            }
            saveBasket();
        }
    };
    
    window.removeItem = function(index) {
        shoppingBasket.splice(index, 1);
        saveBasket();
    };
    
    window.addToBasket = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const lowestPrice = Math.min(product.naivas, product.carrefour, product.quickmart);
        
        const existingItem = shoppingBasket.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            shoppingBasket.push({
                id: productId,
                name: product.name,
                quantity: 1,
                lowestPrice: lowestPrice,
                prices: { naivas: product.naivas, carrefour: product.carrefour, quickmart: product.quickmart }
            });
        }
        
        saveBasket();
        alert(product.name + ' added to your basket!');
    };
    
    // Update Dashboard Stats
    function updateDashboardStats() {
        const productCountEl = document.getElementById('productCount');
        if (productCountEl) productCountEl.innerHTML = products.length;
        
        const totalItems = shoppingBasket.reduce(function(sum, item) {
            return sum + item.quantity;
        }, 0);
        const basketItemCountEl = document.getElementById('basketItemCount');
        if (basketItemCountEl) basketItemCountEl.innerHTML = totalItems;
        
        let naivasTotal = 0;
        let carrefourTotal = 0;
        let quickmartTotal = 0;
        
        for (let j = 0; j < shoppingBasket.length; j++) {
            const item = shoppingBasket[j];
            const product = products.find(p => p.id === item.id);
            if (product) {
                naivasTotal += product.naivas * item.quantity;
                carrefourTotal += product.carrefour * item.quantity;
                quickmartTotal += product.quickmart * item.quantity;
            }
        }
        
        const totalsArray = [naivasTotal, carrefourTotal, quickmartTotal];
        totalsArray.sort(function(a, b) { return a - b; });
        const lowestTotal = totalsArray[0];
        const secondLowest = totalsArray[1];
        const savings = secondLowest - lowestTotal;
        
        const savingsAmountEl = document.getElementById('savingsAmount');
        if (savingsAmountEl) savingsAmountEl.innerHTML = 'KSh ' + savings.toLocaleString();
    }
    
    // Display Popular Products
    function displayPopularProducts() {
        const container = document.getElementById('popularProducts');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < Math.min(6, products.length); i++) {
            const product = products[i];
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.background = '#f8fafc';
            productCard.style.padding = '16px';
            productCard.style.borderRadius = '16px';
            productCard.style.cursor = 'pointer';
            productCard.innerHTML = `
                <h4 style="margin-bottom: 8px;">${product.name}</h4>
                <div style="margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: #64748b;">Naivas:</span>
                        <span style="font-weight: 600;">KSh ${product.naivas}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: #64748b;">Carrefour:</span>
                        <span style="font-weight: 600;">KSh ${product.carrefour}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: #64748b;">Quickmart:</span>
                        <span style="font-weight: 600;">KSh ${product.quickmart}</span>
                    </div>
                </div>
                <button class="add-to-basket-btn" onclick="window.addToBasket(${product.id})" style="width: 100%; padding: 8px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    Add to Basket
                </button>
            `;
            container.appendChild(productCard);
        }
    }
    
    // Search Products
    window.searchProducts = function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const resultsContainer = document.getElementById('searchResults');
        
        if (!resultsContainer) return;
        
        const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
        
        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">No products found. Try searching for "rice", "milk", or "bread".</p>';
            return;
        }
        
        resultsContainer.innerHTML = '<div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;"></div>';
        const grid = resultsContainer.querySelector('.products-grid');
        
        for (let j = 0; j < filtered.length; j++) {
            const product = filtered[j];
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.background = 'white';
            productCard.style.padding = '16px';
            productCard.style.borderRadius = '16px';
            productCard.innerHTML = `
                <h4 style="margin-bottom: 8px;">${product.name}</h4>
                <div style="margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: #64748b;">Naivas:</span>
                        <span style="font-weight: 600;">KSh ${product.naivas}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: #64748b;">Carrefour:</span>
                        <span style="font-weight: 600;">KSh ${product.carrefour}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
                        <span style="color: #64748b;">Quickmart:</span>
                        <span style="font-weight: 600;">KSh ${product.quickmart}</span>
                    </div>
                </div>
                <button class="add-to-basket-btn" onclick="window.addToBasket(${product.id})" style="width: 100%; padding: 8px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    Add to Basket
                </button>
            `;
            grid.appendChild(productCard);
        }
    };
    
    // Compare Basket Prices
    window.compareBasketPrices = function() {
        const compareResults = document.getElementById('compareResults');
        const compareModalResults = document.getElementById('compareModalResults');
        
        if (shoppingBasket.length === 0) {
            alert('Your basket is empty! Add some products first.');
            return;
        }
        
        let naivasTotal = 0;
        let carrefourTotal = 0;
        let quickmartTotal = 0;
        
        for (let i = 0; i < shoppingBasket.length; i++) {
            const item = shoppingBasket[i];
            const product = products.find(p => p.id === item.id);
            if (product) {
                naivasTotal += product.naivas * item.quantity;
                carrefourTotal += product.carrefour * item.quantity;
                quickmartTotal += product.quickmart * item.quantity;
            }
        }
        
        const results = [
            { name: 'Naivas', total: naivasTotal },
            { name: 'Carrefour', total: carrefourTotal },
            { name: 'Quickmart', total: quickmartTotal }
        ];
        
        results.sort(function(a, b) { return a.total - b.total; });
        const lowestTotal = results[0].total;
        
        let resultsHtml = '';
        for (let k = 0; k < results.length; k++) {
            const result = results[k];
            const isWinner = (k === 0);
            const savingsAmount = (k > 0) ? (result.total - lowestTotal) : 0;
            resultsHtml += `
                <div class="compare-card" style="background: ${isWinner ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white'}; padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; color: ${isWinner ? 'white' : '#1e293b'};">
                    <div class="compare-supermarket" style="font-weight: 600; font-size: 18px;">
                        ${result.name}
                        ${isWinner ? '<span style="margin-left: 10px; font-size: 14px;">🏆 BEST DEAL</span>' : ''}
                    </div>
                    <div class="compare-price" style="font-size: 24px; font-weight: 700;">KSh ${result.total.toLocaleString()}</div>
                    ${!isWinner ? `<div class="compare-savings" style="font-size: 14px; color: #10b981;">Save KSh ${savingsAmount.toLocaleString()}</div>` : ''}
                </div>
            `;
        }
        
        if (compareResults) compareResults.innerHTML = resultsHtml;
        if (compareModalResults) compareModalResults.innerHTML = resultsHtml;
        
        const compareModal = document.getElementById('compareModal');
        if (compareModal) compareModal.classList.add('active');
    };
    
    // Close Modal Function
    window.closeCompareModal = function() {
        const compareModal = document.getElementById('compareModal');
        if (compareModal) compareModal.classList.remove('active');
    };
    
    // Saved Baskets Functions
    window.saveCurrentBasket = function() {
        if (shoppingBasket.length === 0) {
            alert('Your basket is empty! Add some products first.');
            return;
        }
        
        const basketName = prompt('Enter a name for this basket:', 'Basket ' + new Date().toLocaleDateString());
        if (basketName) {
            const savedBaskets = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
            savedBaskets.push({
                name: basketName,
                date: new Date().toISOString(),
                items: JSON.parse(JSON.stringify(shoppingBasket))
            });
            localStorage.setItem('savedBaskets_' + currentUser.email, JSON.stringify(savedBaskets));
            alert('Basket saved successfully!');
            displaySavedBaskets();
        }
    };
    
    function displaySavedBaskets() {
        const container = document.getElementById('savedBasketsList');
        if (!container) return;
        
        const savedBaskets = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
        
        if (savedBaskets.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px;">No saved baskets yet. Save your current basket to see it here!</p>';
            return;
        }
        
        container.innerHTML = '';
        for (let i = 0; i < savedBaskets.length; i++) {
            const basket = savedBaskets[i];
            const basketDiv = document.createElement('div');
            basketDiv.className = 'basket-item';
            basketDiv.style.background = 'white';
            basketDiv.style.padding = '16px 20px';
            basketDiv.style.borderRadius = '16px';
            basketDiv.style.marginBottom = '12px';
            basketDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin-bottom: 4px;">${basket.name}</h4>
                        <p style="font-size: 13px; color: #64748b;">${new Date(basket.date).toLocaleString()}</p>
                        <p style="font-size: 12px; color: #667eea;">${basket.items.length} items</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="window.loadSavedBasket(${i})" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">Load</button>
                        <button onclick="window.deleteSavedBasket(${i})" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">Delete</button>
                    </div>
                </div>
            `;
            container.appendChild(basketDiv);
        }
    }
    
    window.loadSavedBasket = function(index) {
        const savedBaskets = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
        if (savedBaskets[index]) {
            shoppingBasket = savedBaskets[index].items;
            saveBasket();
            alert('Loaded "' + savedBaskets[index].name + '" into your current basket!');
            
            const views = document.querySelectorAll('.view');
            for (let i = 0; i < views.length; i++) {
                views[i].classList.remove('active');
            }
            const basketView = document.getElementById('basketView');
            if (basketView) basketView.classList.add('active');
            
            const navItems = document.querySelectorAll('.nav-item');
            for (let j = 0; j < navItems.length; j++) {
                navItems[j].classList.remove('active');
            }
            const navBasket = document.getElementById('navBasket');
            if (navBasket) navBasket.classList.add('active');
        }
    };
    
    window.deleteSavedBasket = function(index) {
    if (confirm('Are you sure you want to delete this saved basket?')) {
        const savedBaskets = JSON.parse(
            localStorage.getItem('savedBaskets_' + currentUser.email) || '[]'
        );

        savedBaskets.splice(index, 1);

        localStorage.setItem(
            'savedBaskets_' + currentUser.email,
            JSON.stringify(savedBaskets)
        );

        displaySavedBaskets();
        alert('Basket deleted successfully!');
    }
};

// CLOSE dashboard-container block
}
// @ts-nocheck
// ========== SUPERMARKET PRICE COMPARISON SYSTEM ==========

// Email validation
function validateEmail(email) {
    return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
}

// ========== SAMPLE PRODUCT DATA ==========
const defaultProducts = [
    { id: 1, name: "White Rice (1kg)", category: "Grains", naivas: 180, carrefour: 165, quickmart: 175 },
    { id: 2, name: "Cooking Oil (1L)", category: "Cooking", naivas: 320, carrefour: 299, quickmart: 310 },
    { id: 3, name: "Wheat Flour (1kg)", category: "Grains", naivas: 130, carrefour: 120, quickmart: 125 },
    { id: 4, name: "Sugar (1kg)", category: "Pantry", naivas: 195, carrefour: 185, quickmart: 190 },
    { id: 5, name: "Milk (500ml)", category: "Dairy", naivas: 55, carrefour: 52, quickmart: 54 },
    { id: 6, name: "Tomato Paste (70g)", category: "Canned", naivas: 45, carrefour: 40, quickmart: 42 },
    { id: 7, name: "Bread (400g)", category: "Bakery", naivas: 60, carrefour: 55, quickmart: 58 },
    { id: 8, name: "Eggs (1 tray)", category: "Dairy", naivas: 420, carrefour: 395, quickmart: 410 },
    { id: 9, name: "Tea Leaves (250g)", category: "Beverages", naivas: 250, carrefour: 235, quickmart: 245 },
    { id: 10, name: "Salt (500g)", category: "Pantry", naivas: 25, carrefour: 20, quickmart: 22 }
];

// Initialize products in localStorage
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
}

// ========== LOGIN PAGE ==========
if (document.getElementById('loginForm')) {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('toggleLoginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const registerLink = document.getElementById('registerLink');
    const adminLoginLink = document.getElementById('adminLoginLink');
    const loadingOverlay = document.getElementById('loadingOverlay');

    toggleBtn?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleBtn.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Admin Login Link Handler
    if (adminLoginLink) {
        adminLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Show admin login prompt
            const adminEmail = prompt('Enter Admin Email:', 'admin@shopcompare.com');
            const adminPassword = prompt('Enter Admin Password:');
            
            if (adminEmail === 'admin@shopcompare.com' && adminPassword === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                alert('Admin login successful!');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid admin credentials. Use admin@shopcompare.com / admin123');
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email) { alert('Email is required'); return; }
        if (!validateEmail(email)) { alert('Invalid email'); return; }
        if (!password) { alert('Password is required'); return; }
        if (password.length < 6) { alert('Password must be at least 6 characters'); return; }

        loadingOverlay.classList.add('active');
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password');
            }
            loadingOverlay.classList.remove('active');
        }, 1000);
    });

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }

    // Check for remembered user
    const rememberedUser = localStorage.getItem('currentUser');
    if (rememberedUser && emailInput) {
        try {
            const user = JSON.parse(rememberedUser);
            emailInput.value = user.email;
            if (rememberMe) rememberMe.checked = true;
        } catch(e) {}
    }
}

// ========== REGISTRATION PAGE ==========
if (document.getElementById('registerForm')) {
    const form = document.getElementById('registerForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const confirmInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const toggleBtn = document.getElementById('toggleRegPassword');
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');

    toggleBtn?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleBtn.querySelector('i').classList.toggle('fa-eye-slash');
    });

    toggleConfirmBtn?.addEventListener('click', () => {
        const type = confirmInput.type === 'password' ? 'text' : 'password';
        confirmInput.type = type;
        toggleConfirmBtn.querySelector('i').classList.toggle('fa-eye-slash');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!fullnameInput.value.trim()) { alert('Full name is required'); return; }
        if (!emailInput.value.trim()) { alert('Email is required'); return; }
        if (!validateEmail(emailInput.value.trim())) { alert('Invalid email'); return; }
        if (!passwordInput.value) { alert('Password is required'); return; }
        if (passwordInput.value.length < 6) { alert('Password must be at least 6 characters'); return; }
        if (passwordInput.value !== confirmInput.value) { alert('Passwords do not match'); return; }
        if (!termsCheckbox.checked) { alert('You must agree to the Terms of Service'); return; }

        const userData = {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            location: document.getElementById('location')?.value || '',
            registeredAt: new Date().toISOString()
        };

        loadingOverlay.classList.add('active');
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === userData.email)) {
                alert('Email already exists');
            } else {
                users.push(userData);
                localStorage.setItem('users', JSON.stringify(users));
                successModal.classList.add('active');
                form.reset();
            }
            loadingOverlay.classList.remove('active');
        }, 1000);
    });

    const modalBtn = document.getElementById('modalLoginBtn');
    if (modalBtn) {
        modalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            window.location.href = 'index.html';
        });
    }
}

// ========== CUSTOMER DASHBOARD PAGE ==========
if (document.querySelector('.dashboard-container') && !document.getElementById('adminWelcomeMessage')) {
    let currentUser = null;
    let shoppingBasket = [];
    let products = JSON.parse(localStorage.getItem('products') || JSON.stringify(defaultProducts));

    function loadUserData() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            document.getElementById('welcomeMessage').innerHTML = 'Welcome back, ' + currentUser.fullname.split(' ')[0] + '!';
            document.getElementById('userName').innerHTML = currentUser.fullname;
            document.getElementById('userEmail').innerHTML = currentUser.email;
            document.getElementById('profileFullname').value = currentUser.fullname;
            document.getElementById('profileEmail').value = currentUser.email;
            document.getElementById('profileLocation').value = currentUser.location || '';
            document.getElementById('profileDate').value = new Date(currentUser.registeredAt).toLocaleDateString();
        } else {
            window.location.href = 'index.html';
        }
    }

    function loadBasket() {
        const saved = localStorage.getItem('basket_' + currentUser?.email);
        if (saved) shoppingBasket = JSON.parse(saved);
        updateBasketUI();
    }

    function saveBasket() {
        localStorage.setItem('basket_' + currentUser.email, JSON.stringify(shoppingBasket));
        updateBasketUI();
        updateStats();
    }

    function updateBasketUI() {
        const container = document.getElementById('basketContent');
        const totalItems = shoppingBasket.reduce((s, i) => s + i.quantity, 0);
        document.getElementById('basketCount').innerHTML = totalItems;
        document.getElementById('basketItemCount').innerHTML = totalItems;
        
        if (!container) return;
        if (shoppingBasket.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px">Your basket is empty</div>';
            return;
        }
        
        container.innerHTML = '';
        shoppingBasket.forEach((item, idx) => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const div = document.createElement('div');
                div.className = 'basket-item';
                div.innerHTML = `
                    <div><h4>${product.name}</h4><p>Qty: ${item.quantity}</p></div>
                    <div><button onclick="updateQuantity(${idx}, -1)">-</button><span style="margin:0 12px">${item.quantity}</span><button onclick="updateQuantity(${idx}, 1)">+</button></div>
                    <div>KSh ${(item.quantity * item.lowestPrice).toLocaleString()}</div>
                    <button onclick="removeItem(${idx})" style="background:none;border:none;color:red;cursor:pointer"><i class="fas fa-trash"></i></button>
                `;
                container.appendChild(div);
            }
        });
    }

    window.updateQuantity = function(idx, change) {
        let newQty = shoppingBasket[idx].quantity + change;
        if (newQty <= 0) shoppingBasket.splice(idx, 1);
        else shoppingBasket[idx].quantity = newQty;
        saveBasket();
    };
    window.removeItem = function(idx) { shoppingBasket.splice(idx, 1); saveBasket(); };
    window.addToBasket = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const lowestPrice = Math.min(product.naivas, product.carrefour, product.quickmart);
        const existing = shoppingBasket.find(i => i.id === productId);
        if (existing) existing.quantity++;
        else shoppingBasket.push({ id: productId, quantity: 1, lowestPrice });
        saveBasket();
        alert(product.name + ' added to basket!');
    };
    window.clearBasket = function() { shoppingBasket = []; saveBasket(); };
    window.compareBasketPrices = function() {
        if (shoppingBasket.length === 0) { alert('Basket is empty'); return; }
        let totals = { naivas: 0, carrefour: 0, quickmart: 0 };
        shoppingBasket.forEach(item => {
            const p = products.find(pr => pr.id === item.id);
            if (p) {
                totals.naivas += p.naivas * item.quantity;
                totals.carrefour += p.carrefour * item.quantity;
                totals.quickmart += p.quickmart * item.quantity;
            }
        });
        const results = [
            { name: 'Naivas', total: totals.naivas },
            { name: 'Carrefour', total: totals.carrefour },
            { name: 'Quickmart', total: totals.quickmart }
        ].sort((a,b) => a.total - b.total);
        let html = '';
        results.forEach((r, i) => {
            html += `<div class="compare-card" style="background:${i===0?'#10b981':'white'};color:${i===0?'white':'#1e293b'}"><strong>${r.name}</strong><span>KSh ${r.total.toLocaleString()}</span>${i!==0?`<span>Save KSh ${(r.total-results[0].total).toLocaleString()}</span>`:''}</div>`;
        });
        document.getElementById('compareResults').innerHTML = html;
        document.getElementById('compareModal').classList.add('active');
    };
    window.saveCurrentBasket = function() {
        if (shoppingBasket.length === 0) { alert('Basket empty'); return; }
        let name = prompt('Basket name:', 'Basket ' + new Date().toLocaleDateString());
        if (name) {
            let saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
            saved.push({ name, date: new Date().toISOString(), items: JSON.parse(JSON.stringify(shoppingBasket)) });
            localStorage.setItem('savedBaskets_' + currentUser.email, JSON.stringify(saved));
            alert('Basket saved!');
            displaySavedBaskets();
        }
    };
    window.loadSavedBasket = function(idx) {
        let saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
        if (saved[idx]) { shoppingBasket = saved[idx].items; saveBasket(); alert('Loaded'); }
    };
    window.deleteSavedBasket = function(idx) {
        let saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
        saved.splice(idx, 1);
        localStorage.setItem('savedBaskets_' + currentUser.email, JSON.stringify(saved));
        displaySavedBaskets();
    };
    function displaySavedBaskets() {
        let container = document.getElementById('savedBasketsList');
        let saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
        if (saved.length === 0) { container.innerHTML = '<p>No saved baskets</p>'; return; }
        container.innerHTML = '';
        saved.forEach((b, i) => {
            let div = document.createElement('div');
            div.className = 'basket-item';
            div.innerHTML = `<div><strong>${b.name}</strong><br><small>${new Date(b.date).toLocaleString()}</small><br><small>${b.items.length} items</small></div><div><button onclick="window.loadSavedBasket(${i})">Load</button><button onclick="window.deleteSavedBasket(${i})">Delete</button></div>`;
            container.appendChild(div);
        });
    }

    function updateStats() {
        document.getElementById('productCount').innerHTML = products.length;
        let totalItems = shoppingBasket.reduce((s, i) => s + i.quantity, 0);
        document.getElementById('basketItemCount').innerHTML = totalItems;
    }

    function displayProducts() {
        let container = document.getElementById('popularProducts');
        if (!container) return;
        container.innerHTML = '';
        products.slice(0, 6).forEach(p => {
            let div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `<h4>${p.name}</h4><div class="price-row"><span>Naivas:</span><span>KSh ${p.naivas}</span></div><div class="price-row"><span>Carrefour:</span><span>KSh ${p.carrefour}</span></div><div class="price-row"><span>Quickmart:</span><span>KSh ${p.quickmart}</span></div><button class="add-to-basket-btn" onclick="window.addToBasket(${p.id})">Add to Basket</button>`;
            container.appendChild(div);
        });
    }

    window.searchProducts = function() {
        let term = document.getElementById('searchInput').value.toLowerCase();
        let container = document.getElementById('searchResults');
        let filtered = products.filter(p => p.name.toLowerCase().includes(term));
        if (filtered.length === 0) { container.innerHTML = '<p>No products found</p>'; return; }
        container.innerHTML = '<div class="products-grid"></div>';
        let grid = container.querySelector('.products-grid');
        filtered.forEach(p => {
            let div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `<h4>${p.name}</h4><div class="price-row"><span>Naivas:</span><span>KSh ${p.naivas}</span></div><div class="price-row"><span>Carrefour:</span><span>KSh ${p.carrefour}</span></div><div class="price-row"><span>Quickmart:</span><span>KSh ${p.quickmart}</span></div><button class="add-to-basket-btn" onclick="window.addToBasket(${p.id})">Add to Basket</button>`;
            grid.appendChild(div);
        });
    };

    function setupNav() {
        const views = { dashboardView: document.getElementById('dashboardView'), searchView: document.getElementById('searchView'), basketView: document.getElementById('basketView'), compareView: document.getElementById('compareView'), historyView: document.getElementById('historyView'), profileView: document.getElementById('profileView') };
        const navs = { navDashboard: document.getElementById('navDashboard'), navSearch: document.getElementById('navSearch'), navBasket: document.getElementById('navBasket'), navCompare: document.getElementById('navCompare'), navHistory: document.getElementById('navHistory'), navProfile: document.getElementById('navProfile') };
        Object.keys(navs).forEach(key => {
            navs[key]?.addEventListener('click', (e) => {
                e.preventDefault();
                Object.values(navs).forEach(n => n?.classList.remove('active'));
                navs[key]?.classList.add('active');
                Object.values(views).forEach(v => v?.classList.remove('active'));
                let viewKey = key.replace('nav', '').charAt(0).toLowerCase() + key.replace('nav', '').slice(1) + 'View';
                if (views[viewKey]) views[viewKey].classList.add('active');
                if (key === 'navHistory') displaySavedBaskets();
                if (key === 'navBasket') updateBasketUI();
            });
        });
        document.getElementById('logoutBtn')?.addEventListener('click', () => { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; });
        document.getElementById('closeCompareModal')?.addEventListener('click', () => document.getElementById('compareModal').classList.remove('active'));
        document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
            let newLoc = document.getElementById('profileLocation').value;
            currentUser.location = newLoc;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            let idx = users.findIndex(u => u.email === currentUser.email);
            if (idx !== -1) users[idx].location = newLoc;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Profile updated');
        });
    }

    loadUserData();
    loadBasket();
    displayProducts();
    updateStats();
    setupNav();
}

// ========== ADMIN DASHBOARD PAGE ==========
if (document.getElementById('adminWelcomeMessage')) {
    let products = JSON.parse(localStorage.getItem('products') || JSON.stringify(defaultProducts));
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let currentProductId = null;

    function updateStats() {
        document.getElementById('adminProductCount').innerHTML = products.length;
        document.getElementById('adminUserCount').innerHTML = users.length;
        document.getElementById('adminComparisonCount').innerHTML = Math.floor(Math.random() * 100);
    }

    function displayProducts() {
        let container = document.getElementById('productsList');
        if (!container) return;
        container.innerHTML = '';
        products.forEach(p => {
            let div = document.createElement('div');
            div.className = 'product-row';
            div.innerHTML = `<div><strong>${p.name}</strong><br><small>${p.category}</small><br><small>Naivas: KSh ${p.naivas} | Carrefour: KSh ${p.carrefour} | Quickmart: KSh ${p.quickmart}</small></div><div class="product-actions"><button class="edit-btn" onclick="editProduct(${p.id})">Edit</button><button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button></div>`;
            container.appendChild(div);
        });
    }

    window.editProduct = function(id) {
        let p = products.find(pr => pr.id === id);
        if (p) {
            currentProductId = id;
            document.getElementById('productModalTitle').innerHTML = 'Edit Product';
            document.getElementById('productName').value = p.name;
            document.getElementById('productCategory').value = p.category;
            document.getElementById('productNaivas').value = p.naivas;
            document.getElementById('productCarrefour').value = p.carrefour;
            document.getElementById('productQuickmart').value = p.quickmart;
            document.getElementById('productModal').classList.add('active');
        }
    };

    window.deleteProduct = function(id) {
        if (confirm('Delete this product?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
            updateStats();
        }
    };

    function displayUsers() {
    }
}