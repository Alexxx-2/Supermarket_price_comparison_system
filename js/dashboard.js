if (document.querySelector('.dashboard-container') && !document.getElementById('adminWelcomeMessage')) {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    let currentUser = null;
    let shoppingBasket = [];

    function loadUser() {
        const stored = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (!stored) { window.location.href = 'index.html'; return; }
        currentUser = JSON.parse(stored);
        document.getElementById('welcomeMessage').innerText = `Welcome back, ${currentUser.fullname.split(' ')[0]}!`;
        document.getElementById('userName').innerText = currentUser.fullname;
        document.getElementById('userEmail').innerText = currentUser.email;
        document.getElementById('profileFullname').value = currentUser.fullname;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profileLocation').value = currentUser.location || '';
        document.getElementById('profileDate').value = new Date(currentUser.registeredAt).toLocaleDateString();
    }

    function loadBasket() {
        const saved = localStorage.getItem(`basket_${currentUser.email}`);
        if (saved) shoppingBasket = JSON.parse(saved);
        updateBasketUI();
    }
    function saveBasket() {
        localStorage.setItem(`basket_${currentUser.email}`, JSON.stringify(shoppingBasket));
        updateBasketUI();
        updateStats();
    }
    function updateBasketUI() {
        const container = document.getElementById('basketContent');
        const totalItems = shoppingBasket.reduce((s,i) => s + i.quantity, 0);
        document.getElementById('basketCount').innerText = totalItems;
        document.getElementById('basketItemCount').innerText = totalItems;
        if (!container) return;
        if (shoppingBasket.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px">Your basket is empty.</div>';
            return;
        }
        container.innerHTML = '';
        shoppingBasket.forEach((item, idx) => {
            const prod = products.find(p => p.id === item.id);
            if (!prod) return;
            const div = document.createElement('div');
            div.className = 'basket-item';
            div.innerHTML = `
                <div><strong>${prod.name}</strong><br>Qty: ${item.quantity}</div>
                <div><button class="qty-dec" data-idx="${idx}">-</button> <span>${item.quantity}</span> <button class="qty-inc" data-idx="${idx}">+</button></div>
                <div>KSh ${(item.quantity * item.lowestPrice).toLocaleString()}</div>
                <button class="remove-item" data-idx="${idx}"><i class="fas fa-trash"></i></button>
            `;
            container.appendChild(div);
        });
        document.querySelectorAll('.qty-dec').forEach(btn => btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.idx), -1)));
        document.querySelectorAll('.qty-inc').forEach(btn => btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.idx), 1)));
        document.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.idx))));
    }
    function changeQuantity(idx, delta) {
        let newQty = shoppingBasket[idx].quantity + delta;
        if (newQty <= 0) shoppingBasket.splice(idx, 1);
        else shoppingBasket[idx].quantity = newQty;
        saveBasket();
    }
    function removeItem(idx) { shoppingBasket.splice(idx, 1); saveBasket(); }
    window.addToBasket = function(productId) {
        const prod = products.find(p => p.id === productId);
        if (!prod) return;
        const lowest = Math.min(prod.naivas, prod.carrefour, prod.quickmart);
        const existing = shoppingBasket.find(i => i.id === productId);
        if (existing) existing.quantity++;
        else shoppingBasket.push({ id: productId, quantity: 1, lowestPrice: lowest });
        saveBasket();
        alert(`${prod.name} added to basket!`);
    };
    function clearBasket() { if (confirm('Clear basket?')) { shoppingBasket = []; saveBasket(); } }
    function compareBasket() {
        if (shoppingBasket.length === 0) { alert('Basket empty'); return; }
        let totals = { naivas:0, carrefour:0, quickmart:0 };
        shoppingBasket.forEach(item => {
            const p = products.find(prod => prod.id === item.id);
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
        const savings = results[1].total - results[0].total;
        document.getElementById('savingsAmount').innerText = `KSh ${savings.toLocaleString()}`;
        let html = '';
        results.forEach((r, idx) => {
            const isWinner = idx === 0;
            const saveAmt = idx > 0 ? r.total - results[0].total : 0;
            html += `<div class="compare-card" style="background:${isWinner?'#10b981':'white'};color:${isWinner?'white':'#1e293b'}">
                <strong>${r.name}${isWinner?' 🏆 BEST DEAL':''}</strong>
                <span>KSh ${r.total.toLocaleString()}</span>
                ${!isWinner?`<span>Save KSh ${saveAmt.toLocaleString()}</span>`:''}
            </div>`;
        });
        document.getElementById('compareResults').innerHTML = html;
        document.getElementById('compareModalResults').innerHTML = html;
        document.getElementById('compareModal').classList.add('active');
    }
    function saveCurrentBasket() {
        if (shoppingBasket.length === 0) { alert('Empty basket'); return; }
        const name = prompt('Basket name:', `Basket ${new Date().toLocaleDateString()}`);
        if (!name) return;
        let saved = JSON.parse(localStorage.getItem(`savedBaskets_${currentUser.email}`) || '[]');
        saved.push({ name, date: new Date().toISOString(), items: JSON.parse(JSON.stringify(shoppingBasket)) });
        localStorage.setItem(`savedBaskets_${currentUser.email}`, JSON.stringify(saved));
        alert('Saved!');
        displaySavedBaskets();
    }
    function displaySavedBaskets() {
        const container = document.getElementById('savedBasketsList');
        const saved = JSON.parse(localStorage.getItem(`savedBaskets_${currentUser.email}`) || '[]');
        if (saved.length === 0) { container.innerHTML = '<p>No saved baskets</p>'; return; }
        container.innerHTML = '';
        saved.forEach((b, idx) => {
            const div = document.createElement('div');
            div.className = 'basket-item';
            div.innerHTML = `<div><strong>${b.name}</strong><br><small>${new Date(b.date).toLocaleString()}</small><br>${b.items.length} items</div>
                <div><button class="load-basket" data-idx="${idx}">Load</button> <button class="del-basket" data-idx="${idx}">Delete</button></div>`;
            container.appendChild(div);
        });
        document.querySelectorAll('.load-basket').forEach(btn => btn.addEventListener('click', () => loadSavedBasket(parseInt(btn.dataset.idx))));
        document.querySelectorAll('.del-basket').forEach(btn => btn.addEventListener('click', () => deleteSavedBasket(parseInt(btn.dataset.idx))));
    }
    function loadSavedBasket(idx) {
        let saved = JSON.parse(localStorage.getItem(`savedBaskets_${currentUser.email}`) || '[]');
        if (saved[idx]) { shoppingBasket = saved[idx].items; saveBasket(); alert('Loaded'); switchView('basketView'); }
    }
    function deleteSavedBasket(idx) {
        let saved = JSON.parse(localStorage.getItem(`savedBaskets_${currentUser.email}`) || '[]');
        saved.splice(idx,1);
        localStorage.setItem(`savedBaskets_${currentUser.email}`, JSON.stringify(saved));
        displaySavedBaskets();
    }
    function updateStats() {
        document.getElementById('productCount').innerText = products.length;
        const total = shoppingBasket.reduce((s,i)=>s+i.quantity,0);
        document.getElementById('basketItemCount').innerText = total;
        if (shoppingBasket.length) {
            let t = { naivas:0, carrefour:0, quickmart:0 };
            shoppingBasket.forEach(i => {
                const p = products.find(pr => pr.id === i.id);
                if(p) {
                    t.naivas += p.naivas * i.quantity;
                    t.carrefour += p.carrefour * i.quantity;
                    t.quickmart += p.quickmart * i.quantity;
                }
            });
            const arr = [t.naivas, t.carrefour, t.quickmart].sort((a,b)=>a-b);
            document.getElementById('savingsAmount').innerText = `KSh ${(arr[1]-arr[0]).toLocaleString()}`;
        } else document.getElementById('savingsAmount').innerText = 'KSh 0';
    }
    function displayPopular() {
        const container = document.getElementById('popularProducts');
        const toShow = products.slice(0,6);
        container.innerHTML = '';
        toShow.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<h4>${p.name}</h4><div class="price-row"><span>Naivas:</span><span>KSh ${p.naivas}</span></div>
                <div class="price-row"><span>Carrefour:</span><span>KSh ${p.carrefour}</span></div>
                <div class="price-row"><span>Quickmart:</span><span>KSh ${p.quickmart}</span></div>
                <button class="add-to-basket" data-id="${p.id}">Add to Basket</button>`;
            container.appendChild(card);
        });
        document.querySelectorAll('#popularProducts .add-to-basket').forEach(btn => btn.addEventListener('click', () => window.addToBasket(parseInt(btn.dataset.id))));
    }
    window.searchProducts = function() {
        const term = document.getElementById('searchInput').value.toLowerCase();
        const container = document.getElementById('searchResults');
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        if (!filtered.length) { container.innerHTML = '<p>No products</p>'; return; }
        container.innerHTML = '<div class="products-grid"></div>';
        const grid = container.querySelector('.products-grid');
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<h4>${p.name}</h4><div class="price-row"><span>Naivas:</span><span>KSh ${p.naivas}</span></div>
                <div class="price-row"><span>Carrefour:</span><span>KSh ${p.carrefour}</span></div>
                <div class="price-row"><span>Quickmart:</span><span>KSh ${p.quickmart}</span></div>
                <button class="add-to-basket-search" data-id="${p.id}">Add to Basket</button>`;
            grid.appendChild(card);
        });
        document.querySelectorAll('#searchResults .add-to-basket-search').forEach(btn => btn.addEventListener('click', () => window.addToBasket(parseInt(btn.dataset.id))));
    };
    function switchView(viewId) {
        ['dashboardView','searchView','basketView','compareView','historyView','profileView'].forEach(id => {
            document.getElementById(id).classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
        if (viewId === 'basketView') updateBasketUI();
        if (viewId === 'historyView') displaySavedBaskets();
    }
    function setupNav() {
        document.getElementById('navDashboard').addEventListener('click', (e) => { e.preventDefault(); switchView('dashboardView'); setActive('navDashboard'); });
        document.getElementById('navSearch').addEventListener('click', (e) => { e.preventDefault(); switchView('searchView'); setActive('navSearch'); });
        document.getElementById('navBasket').addEventListener('click', (e) => { e.preventDefault(); switchView('basketView'); setActive('navBasket'); });
        document.getElementById('navCompare').addEventListener('click', (e) => { e.preventDefault(); switchView('compareView'); setActive('navCompare'); compareBasket(); });
        document.getElementById('navHistory').addEventListener('click', (e) => { e.preventDefault(); switchView('historyView'); setActive('navHistory'); });
        document.getElementById('navProfile').addEventListener('click', (e) => { e.preventDefault(); switchView('profileView'); setActive('navProfile'); });
        document.getElementById('logoutBtn').addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('currentUser'); sessionStorage.removeItem('currentUser'); window.location.href='index.html'; });
        document.getElementById('clearBasketBtn').addEventListener('click', clearBasket);
        document.getElementById('compareBasketBtn').addEventListener('click', compareBasket);
        document.getElementById('saveBasketBtn').addEventListener('click', saveCurrentBasket);
        document.getElementById('searchBtn').addEventListener('click', () => window.searchProducts());
        document.getElementById('closeCompareModal').addEventListener('click', () => document.getElementById('compareModal').classList.remove('active'));
        document.getElementById('saveProfileBtn').addEventListener('click', () => {
            const newLoc = document.getElementById('profileLocation').value;
            currentUser.location = newLoc;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const idx = users.findIndex(u => u.email === currentUser.email);
            if (idx !== -1) users[idx].location = newLoc;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Profile updated');
        });
    }
    function setActive(id) {
        ['navDashboard','navSearch','navBasket','navCompare','navHistory','navProfile'].forEach(i => {
            document.getElementById(i).classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
    }
    loadUser();
    loadBasket();
    displayPopular();
    updateStats();
    setupNav();
    window.onclick = function(e) { if (e.target === document.getElementById('compareModal')) document.getElementById('compareModal').classList.remove('active'); };
}