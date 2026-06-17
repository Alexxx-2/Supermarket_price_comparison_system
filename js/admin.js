if (document.getElementById('adminWelcomeMessage')) {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let currentProductId = null;

    function updateStats() {
        document.getElementById('adminProductCount').innerText = products.length;
        document.getElementById('adminUserCount').innerText = users.length;
        document.getElementById('adminComparisonCount').innerText = Math.floor(Math.random() * 100);
    }
    function displayProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;
        if (!products.length) { container.innerHTML = '<p>No products</p>'; return; }
        container.innerHTML = '';
        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product-row';
            div.innerHTML = `<div><strong>${p.name}</strong><br><small>${p.category}</small><br><small>Naivas: KSh ${p.naivas} | Carrefour: KSh ${p.carrefour} | Quickmart: KSh ${p.quickmart}</small></div>
                <div><button class="edit-prod" data-id="${p.id}">Edit</button><button class="del-prod" data-id="${p.id}">Delete</button></div>`;
            container.appendChild(div);
        });
        document.querySelectorAll('.edit-prod').forEach(btn => btn.addEventListener('click', () => editProduct(parseInt(btn.dataset.id))));
        document.querySelectorAll('.del-prod').forEach(btn => btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id))));
    }
    function editProduct(id) {
        const p = products.find(pr => pr.id === id);
        if (!p) return;
        currentProductId = id;
        document.getElementById('productModalTitle').innerText = 'Edit Product';
        document.getElementById('productName').value = p.name;
        document.getElementById('productCategory').value = p.category;
        document.getElementById('productNaivas').value = p.naivas;
        document.getElementById('productCarrefour').value = p.carrefour;
        document.getElementById('productQuickmart').value = p.quickmart;
        document.getElementById('productModal').classList.add('active');
    }
    function deleteProduct(id) {
        if (confirm('Delete product?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
            displayPrices();
            updateStats();
        }
    }
    function displayPrices() {
        const container = document.getElementById('pricesList');
        if (!container) return;
        if (!products.length) { container.innerHTML = '<p>No products</p>'; return; }
        container.innerHTML = '';
        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'price-row';
            div.innerHTML = `<div><strong>${p.name}</strong></div>
                <div><input type="number" id="naivas_${p.id}" value="${p.naivas}" style="width:80px"> Naivas
                <input type="number" id="carrefour_${p.id}" value="${p.carrefour}" style="width:80px"> Carrefour
                <input type="number" id="quickmart_${p.id}" value="${p.quickmart}" style="width:80px"> Quickmart
                <button class="update-price" data-id="${p.id}">Update</button></div>`;
            container.appendChild(div);
        });
        document.querySelectorAll('.update-price').forEach(btn => btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const naivas = parseFloat(document.getElementById(`naivas_${id}`).value);
            const carrefour = parseFloat(document.getElementById(`carrefour_${id}`).value);
            const quickmart = parseFloat(document.getElementById(`quickmart_${id}`).value);
            const prod = products.find(p => p.id === id);
            if (prod && !isNaN(naivas) && !isNaN(carrefour) && !isNaN(quickmart)) {
                prod.naivas = naivas; prod.carrefour = carrefour; prod.quickmart = quickmart;
                localStorage.setItem('products', JSON.stringify(products));
                displayProducts();
                alert('Prices updated');
            } else alert('Invalid price');
        }));
    }
    function displayUsers() {
        const container = document.getElementById('usersList');
        if (!container) return;
        users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.length) { container.innerHTML = '<p>No users</p>'; return; }
        container.innerHTML = '';
        users.forEach((u, idx) => {
            const div = document.createElement('div');
            div.className = 'user-row';
            div.innerHTML = `<div><strong>${u.name}</strong><br>${u.email}<br>Joined: ${new Date(u.registeredAt).toLocaleDateString()}<br>Location: ${u.location||'Not set'}</div>
                <div><button class="disable-user" data-idx="${idx}">Disable</button><button class="del-user" data-idx="${idx}">Delete</button></div>`;
            container.appendChild(div);
        });
        document.querySelectorAll('.disable-user').forEach(btn => btn.addEventListener('click', () => alert('User disabled (demo)')));
        document.querySelectorAll('.del-user').forEach(btn => btn.addEventListener('click', () => {
            if (confirm('Delete user?')) {
                users.splice(parseInt(btn.dataset.idx),1);
                localStorage.setItem('users', JSON.stringify(users));
                displayUsers();
                updateStats();
            }
        }));
    }
    function displayReports() {
        document.getElementById('topProducts').innerHTML = '<ul><li>Rice - 45 comparisons</li><li>Oil - 32</li><li>Flour - 28</li></ul>';
        document.getElementById('supermarketStats').innerHTML = '<div>Naivas: 40%</div><div>Carrefour: 35%</div><div>Quickmart: 25%</div>';
    }
    function saveProduct() {
        const name = document.getElementById('productName').value.trim();
        const cat = document.getElementById('productCategory').value.trim();
        const naivas = parseFloat(document.getElementById('productNaivas').value);
        const carrefour = parseFloat(document.getElementById('productCarrefour').value);
        const quickmart = parseFloat(document.getElementById('productQuickmart').value);
        if (!name || !cat || isNaN(naivas) || isNaN(carrefour) || isNaN(quickmart)) { alert('Fill all fields'); return; }
        if (currentProductId) {
            const idx = products.findIndex(p => p.id === currentProductId);
            if (idx !== -1) { products[idx] = { ...products[idx], name, category: cat, naivas, carrefour, quickmart }; }
        } else {
            const newId = products.length ? Math.max(...products.map(p=>p.id)) + 1 : 11;
            products.push({ id: newId, name, category: cat, naivas, carrefour, quickmart });
        }
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        displayPrices();
        updateStats();
        closeProductModal();
    }
    function closeProductModal() {
        document.getElementById('productModal').classList.remove('active');
        currentProductId = null;
        document.getElementById('productModalTitle').innerText = 'Add Product';
        document.getElementById('productName').value = '';
        document.getElementById('productCategory').value = '';
        document.getElementById('productNaivas').value = '';
        document.getElementById('productCarrefour').value = '';
        document.getElementById('productQuickmart').value = '';
    }
    function openBulkModal() { document.getElementById('bulkModal').classList.add('active'); }
    function closeBulkModal() { document.getElementById('bulkModal').classList.remove('active'); document.getElementById('bulkFile').value = ''; }
    function downloadTemplate() {
        let csv = "Product Name,Category,Naivas Price,Carrefour Price,Quickmart Price\n";
        products.forEach(p => { csv += `"${p.name}",${p.category},${p.naivas},${p.carrefour},${p.quickmart}\n`; });
        const blob = new Blob([csv], {type:'text/csv'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'prices_template.csv';
        a.click();
        URL.revokeObjectURL(a.href);
    }
    function uploadBulk() {
        const file = document.getElementById('bulkFile').files[0];
        if (!file) { alert('Select file'); return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            const lines = e.target.result.split('\n');
            let updated = 0;
            for (let i=1; i<lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length >= 5 && cols[0]) {
                    const name = cols[0].replace(/^"|"$/g, '').trim();
                    const naivas = parseFloat(cols[2]);
                    const carrefour = parseFloat(cols[3]);
                    const quickmart = parseFloat(cols[4]);
                    if (!isNaN(naivas) && !isNaN(carrefour) && !isNaN(quickmart)) {
                        const prod = products.find(p => p.name.toLowerCase() === name.toLowerCase());
                        if (prod) { prod.naivas = naivas; prod.carrefour = carrefour; prod.quickmart = quickmart; updated++; }
                    }
                }
            }
            if (updated) {
                localStorage.setItem('products', JSON.stringify(products));
                displayProducts(); displayPrices(); updateStats();
                alert(`Updated ${updated} products`);
            } else alert('No products updated');
            closeBulkModal();
        };
        reader.readAsText(file);
    }
    function setupNav() {
        const views = { overviewView: document.getElementById('overviewView'), productsView: document.getElementById('productsView'), pricesView: document.getElementById('pricesView'), usersView: document.getElementById('usersView'), reportsView: document.getElementById('reportsView') };
        function activate(viewId) {
            Object.values(views).forEach(v => v?.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');
            if (viewId === 'productsView') displayProducts();
            if (viewId === 'pricesView') displayPrices();
            if (viewId === 'usersView') displayUsers();
            if (viewId === 'reportsView') displayReports();
        }
        document.getElementById('navOverview').addEventListener('click', (e) => { e.preventDefault(); activate('overviewView'); });
        document.getElementById('navProducts').addEventListener('click', (e) => { e.preventDefault(); activate('productsView'); });
        document.getElementById('navPrices').addEventListener('click', (e) => { e.preventDefault(); activate('pricesView'); });
        document.getElementById('navUsers').addEventListener('click', (e) => { e.preventDefault(); activate('usersView'); });
        document.getElementById('navReports').addEventListener('click', (e) => { e.preventDefault(); activate('reportsView'); });
        document.getElementById('adminLogoutBtn').addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('adminLoggedIn'); window.location.href='index.html'; });
    }
    document.getElementById('addProductBtn')?.addEventListener('click', () => { currentProductId = null; document.getElementById('productModal').classList.add('active'); });
    document.getElementById('cancelProductBtn')?.addEventListener('click', closeProductModal);
    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
    document.getElementById('bulkUpdateBtn')?.addEventListener('click', openBulkModal);
    document.getElementById('cancelBulkBtn')?.addEventListener('click', closeBulkModal);
    document.getElementById('downloadTemplateBtn')?.addEventListener('click', downloadTemplate);
    document.getElementById('uploadBulkBtn')?.addEventListener('click', uploadBulk);
    window.onclick = (e) => { if (e.target === document.getElementById('productModal')) closeProductModal(); if (e.target === document.getElementById('bulkModal')) closeBulkModal(); };
    updateStats();
    displayProducts();
    displayPrices();
    displayUsers();
    displayReports();
    setupNav();
}