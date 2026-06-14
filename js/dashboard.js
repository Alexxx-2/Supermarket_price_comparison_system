// ========== CUSTOMER DASHBOARD PAGE FUNCTIONALITY ==========
// This file ONLY runs on the customer dashboard page

if (document.querySelector('.dashboard-container') && !document.getElementById('adminWelcomeMessage')) {
    
    let currentUser = null;
    let shoppingBasket = [];
    let products = JSON.parse(localStorage.getItem('products') || JSON.stringify(defaultProducts));

    // Load user data
    function loadUserData() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            const welcomeMsg = document.getElementById('welcomeMessage');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const profileFullname = document.getElementById('profileFullname');
            const profileEmail = document.getElementById('profileEmail');
            const profileLocation = document.getElementById('profileLocation');
            const profileDate = document.getElementById('profileDate');
            
            if (welcomeMsg) welcomeMsg.innerHTML = 'Welcome back, ' + currentUser.fullname.split(' ')[0] + '!';
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

    // Basket functions
    function loadBasket() {
        const saved = localStorage.getItem('basket_' + (currentUser ? currentUser.email : ''));
        if (saved) shoppingBasket = JSON.parse(saved);
        updateBasketUI();
    }

    function saveBasket() {
        if (currentUser) {
            localStorage.setItem('basket_' + currentUser.email, JSON.stringify(shoppingBasket));
        }
        updateBasketUI();
        updateStats();
    }

    function updateBasketUI() {
        const container = document.getElementById('basketContent');
        let totalItems = 0;
        for (let i = 0; i < shoppingBasket.length; i++) {
            totalItems += shoppingBasket[i].quantity;
        }
        const basketCount = document.getElementById('basketCount');
        const basketItemCount = document.getElementById('basketItemCount');
        
        if (basketCount) basketCount.innerHTML = totalItems;
        if (basketItemCount) basketItemCount.innerHTML = totalItems;
        
        if (!container) return;
        if (shoppingBasket.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px">Your basket is empty. Add some products!</div>';
            return;
        }
        
        container.innerHTML = '';
        for (let i = 0; i < shoppingBasket.length; i++) {
            const item = shoppingBasket[i];
            let product = null;
            for (let j = 0; j < products.length; j++) {
                if (products[j].id === item.id) {
                    product = products[j];
                    break;
                }
            }
            if (product) {
                const div = document.createElement('div');
                div.className = 'basket-item';
                div.innerHTML = '<div><h4>' + product.name + '</h4><p>Quantity: ' + item.quantity + '</p></div>' +
                    '<div><button onclick="window.updateQuantity(' + i + ', -1)">-</button><span style="margin:0 12px">' + item.quantity + '</span><button onclick="window.updateQuantity(' + i + ', 1)">+</button></div>' +
                    '<div>KSh ' + (item.quantity * item.lowestPrice).toLocaleString() + '</div>' +
                    '<button onclick="window.removeItem(' + i + ')" style="background:none;border:none;color:red;cursor:pointer"><i class="fas fa-trash"></i></button>';
                container.appendChild(div);
            }
        }
    }

    window.updateQuantity = function(idx, change) {
        let newQty = shoppingBasket[idx].quantity + change;
        if (newQty <= 0) {
            shoppingBasket.splice(idx, 1);
        } else {
            shoppingBasket[idx].quantity = newQty;
        }
        saveBasket();
    };
    
    window.removeItem = function(idx) {
        shoppingBasket.splice(idx, 1);
        saveBasket();
    };
    
    window.addToBasket = function(productId) {
        let product = null;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
                product = products[i];
                break;
            }
        }
        if (!product) return;
        const lowestPrice = Math.min(product.naivas, product.carrefour, product.quickmart);
        let existing = null;
        for (let j = 0; j < shoppingBasket.length; j++) {
            if (shoppingBasket[j].id === productId) {
                existing = shoppingBasket[j];
                break;
            }
        }
        if (existing) {
            existing.quantity++;
        } else {
            shoppingBasket.push({ id: productId, quantity: 1, lowestPrice: lowestPrice });
        }
        saveBasket();
        alert(product.name + ' added to basket!');
    };
    
    window.clearBasket = function() {
        shoppingBasket = [];
        saveBasket();
    };
    
    window.compareBasketPrices = function() {
        if (shoppingBasket.length === 0) {
            alert('Your basket is empty!');
            return;
        }
        let totals = { naivas: 0, carrefour: 0, quickmart: 0 };
        for (let i = 0; i < shoppingBasket.length; i++) {
            const item = shoppingBasket[i];
            let product = null;
            for (let j = 0; j < products.length; j++) {
                if (products[j].id === item.id) {
                    product = products[j];
                    break;
                }
            }
            if (product) {
                totals.naivas += product.naivas * item.quantity;
                totals.carrefour += product.carrefour * item.quantity;
                totals.quickmart += product.quickmart * item.quantity;
            }
        }
        let results = [
            { name: 'Naivas', total: totals.naivas },
            { name: 'Carrefour', total: totals.carrefour },
            { name: 'Quickmart', total: totals.quickmart }
        ];
        results.sort(function(a, b) { return a.total - b.total; });
        let html = '';
        for (let k = 0; k < results.length; k++) {
            const r = results[k];
            const isWinner = (k === 0);
            const savings = (k > 0) ? (r.total - results[0].total) : 0;
            html += '<div class="compare-card" style="background:' + (isWinner ? '#10b981' : 'white') + ';color:' + (isWinner ? 'white' : '#1e293b') + ';padding:20px;border-radius:16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<strong>' + r.name + (isWinner ? ' 🏆 BEST DEAL' : '') + '</strong>' +
                '<span style="font-size:24px;font-weight:700">KSh ' + r.total.toLocaleString() + '</span>' +
                (!isWinner ? '<span style="color:#10b981">Save KSh ' + savings.toLocaleString() + '</span>' : '') +
                '</div>';
        }
        const compareResults = document.getElementById('compareResults');
        const compareModalResults = document.getElementById('compareModalResults');
        if (compareResults) compareResults.innerHTML = html;
        if (compareModalResults) compareModalResults.innerHTML = html;
        const compareModal = document.getElementById('compareModal');
        if (compareModal) compareModal.classList.add('active');
    };
    
    window.saveCurrentBasket = function() {
        if (shoppingBasket.length === 0) {
            alert('Your basket is empty!');
            return;
        }
        const basketName = prompt('Enter a name for this basket:', 'Basket ' + new Date().toLocaleDateString());
        if (basketName) {
            const saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
            saved.push({ name: basketName, date: new Date().toISOString(), items: JSON.parse(JSON.stringify(shoppingBasket)) });
            localStorage.setItem('savedBaskets_' + currentUser.email, JSON.stringify(saved));
            alert('Basket saved!');
            displaySavedBaskets();
        }
    };
    
    window.loadSavedBasket = function(idx) {
        const saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
        if (saved[idx]) {
            shoppingBasket = saved[idx].items;
            saveBasket();
            alert('Loaded "' + saved[idx].name + '"');
            const views = document.querySelectorAll('.view');
            for (let i = 0; i < views.length; i++) views[i].classList.remove('active');
            const basketView = document.getElementById('basketView');
            if (basketView) basketView.classList.add('active');
            const navItems = document.querySelectorAll('.nav-item');
            for (let j = 0; j < navItems.length; j++) navItems[j].classList.remove('active');
            const navBasket = document.getElementById('navBasket');
            if (navBasket) navBasket.classList.add('active');
        }
    };
    
    window.deleteSavedBasket = function(idx) {
        if (confirm('Delete this saved basket?')) {
            const saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
            saved.splice(idx, 1);
            localStorage.setItem('savedBaskets_' + currentUser.email, JSON.stringify(saved));
            displaySavedBaskets();
        }
    };
    
    function displaySavedBaskets() {
        const container = document.getElementById('savedBasketsList');
        if (!container) return;
        const saved = JSON.parse(localStorage.getItem('savedBaskets_' + currentUser.email) || '[]');
        if (saved.length === 0) {
            container.innerHTML = '<p>No saved baskets yet.</p>';
            return;
        }
        container.innerHTML = '';
        for (let i = 0; i < saved.length; i++) {
            const b = saved[i];
            const div = document.createElement('div');
            div.className = 'basket-item';
            div.innerHTML = '<div><strong>' + b.name + '</strong><br><small>' + new Date(b.date).toLocaleString() + '</small><br><small>' + b.items.length + ' items</small></div>' +
                '<div><button onclick="window.loadSavedBasket(' + i + ')">Load</button> <button onclick="window.deleteSavedBasket(' + i + ')">Delete</button></div>';
            container.appendChild(div);
        }
    }

    function updateStats() {
        const productCount = document.getElementById('productCount');
        if (productCount) productCount.innerHTML = products.length;
        let totalItems = 0;
        for (let i = 0; i < shoppingBasket.length; i++) totalItems += shoppingBasket[i].quantity;
        const basketItemCount = document.getElementById('basketItemCount');
        if (basketItemCount) basketItemCount.innerHTML = totalItems;
        const savingsAmount = document.getElementById('savingsAmount');
        if (savingsAmount) savingsAmount.innerHTML = 'KSh 0';
    }

    function displayProducts() {
        const container = document.getElementById('popularProducts');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < Math.min(6, products.length); i++) {
            const p = products[i];
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = '<h4>' + p.name + '</h4>' +
                '<div class="price-row"><span>Naivas:</span><span>KSh ' + p.naivas + '</span></div>' +
                '<div class="price-row"><span>Carrefour:</span><span>KSh ' + p.carrefour + '</span></div>' +
                '<div class="price-row"><span>Quickmart:</span><span>KSh ' + p.quickmart + '</span></div>' +
                '<button class="add-to-basket-btn" onclick="window.addToBasket(' + p.id + ')">Add to Basket</button>';
            container.appendChild(div);
        }
    }

    window.searchProducts = function() {
        const term = document.getElementById('searchInput').value.toLowerCase();
        const container = document.getElementById('searchResults');
        if (!container) return;
        const filtered = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].name.toLowerCase().indexOf(term) !== -1) {
                filtered.push(products[i]);
            }
        }
        if (filtered.length === 0) {
            container.innerHTML = '<p>No products found</p>';
            return;
        }
        container.innerHTML = '<div class="products-grid"></div>';
        const grid = container.querySelector('.products-grid');
        for (let j = 0; j < filtered.length; j++) {
            const p = filtered[j];
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = '<h4>' + p.name + '</h4>' +
                '<div class="price-row"><span>Naivas:</span><span>KSh ' + p.naivas + '</span></div>' +
                '<div class="price-row"><span>Carrefour:</span><span>KSh ' + p.carrefour + '</span></div>' +
                '<div class="price-row"><span>Quickmart:</span><span>KSh ' + p.quickmart + '</span></div>' +
                '<button class="add-to-basket-btn" onclick="window.addToBasket(' + p.id + ')">Add to Basket</button>';
            grid.appendChild(div);
        }
    };

    function setupNav() {
        const navDashboard = document.getElementById('navDashboard');
        const navSearch = document.getElementById('navSearch');
        const navBasket = document.getElementById('navBasket');
        const navCompare = document.getElementById('navCompare');
        const navHistory = document.getElementById('navHistory');
        const navProfile = document.getElementById('navProfile');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeModal = document.getElementById('closeCompareModal');
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        
        const dashboardView = document.getElementById('dashboardView');
        const searchView = document.getElementById('searchView');
        const basketView = document.getElementById('basketView');
        const compareView = document.getElementById('compareView');
        const historyView = document.getElementById('historyView');
        const profileView = document.getElementById('profileView');
        
        if (navDashboard) {
            navDashboard.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (dashboardView) dashboardView.classList.add('active');
            });
        }
        if (navSearch) {
            navSearch.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (searchView) searchView.classList.add('active');
            });
        }
        if (navBasket) {
            navBasket.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (basketView) basketView.classList.add('active');
                updateBasketUI();
            });
        }
        if (navCompare) {
            navCompare.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (compareView) compareView.classList.add('active');
                window.compareBasketPrices();
            });
        }
        if (navHistory) {
            navHistory.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (historyView) historyView.classList.add('active');
                displaySavedBaskets();
            });
        }
        if (navProfile) {
            navProfile.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (profileView) profileView.classList.add('active');
            });
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                const modal = document.getElementById('compareModal');
                if (modal) modal.classList.remove('active');
            });
        }
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', function() {
                const newLoc = document.getElementById('profileLocation').value;
                if (currentUser) {
                    currentUser.location = newLoc;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].email === currentUser.email) {
                            users[i].location = newLoc;
                            break;
                        }
                    }
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('Profile updated!');
                }
            });
        }
    }

    loadUserData();
    loadBasket();
    displayProducts();
    updateStats();
    setupNav();
}