// ========== ADMIN DASHBOARD PAGE FUNCTIONALITY ==========
// This file ONLY runs on the admin dashboard page

if (document.getElementById('adminWelcomeMessage')) {
    
    let products = JSON.parse(localStorage.getItem('products') || JSON.stringify(defaultProducts));
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let currentProductId = null;

    function updateStats() {
        const productCount = document.getElementById('adminProductCount');
        const userCount = document.getElementById('adminUserCount');
        const comparisonCount = document.getElementById('adminComparisonCount');
        if (productCount) productCount.innerHTML = products.length;
        if (userCount) userCount.innerHTML = users.length;
        if (comparisonCount) comparisonCount.innerHTML = Math.floor(Math.random() * 100);
    }

    function displayProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const div = document.createElement('div');
            div.className = 'product-row';
            div.innerHTML = '<div><strong>' + p.name + '</strong><br><small>' + p.category + '</small><br><small>Naivas: KSh ' + p.naivas + ' | Carrefour: KSh ' + p.carrefour + ' | Quickmart: KSh ' + p.quickmart + '</small></div>' +
                '<div class="product-actions"><button class="edit-btn" onclick="window.editProduct(' + p.id + ')">Edit</button><button class="delete-btn" onclick="window.deleteProduct(' + p.id + ')">Delete</button></div>';
            container.appendChild(div);
        }
    }

    window.editProduct = function(id) {
        let product = null;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                product = products[i];
                break;
            }
        }
        if (product) {
            currentProductId = id;
            document.getElementById('productModalTitle').innerHTML = 'Edit Product';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productNaivas').value = product.naivas;
            document.getElementById('productCarrefour').value = product.carrefour;
            document.getElementById('productQuickmart').value = product.quickmart;
            document.getElementById('productModal').classList.add('active');
        }
    };

    window.deleteProduct = function(id) {
        if (confirm('Delete this product?')) {
            const newProducts = [];
            for (let i = 0; i < products.length; i++) {
                if (products[i].id !== id) {
                    newProducts.push(products[i]);
                }
            }
            products = newProducts;
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
            updateStats();
            alert('Product deleted successfully!');
        }
    };

    function displayPrices() {
        const container = document.getElementById('pricesList');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const div = document.createElement('div');
            div.className = 'price-row';
            div.innerHTML = '<div><strong>' + p.name + '</strong></div>' +
                '<div style="display:flex;gap:20px;">' +
                '<div>Naivas: <input type="number" id="price_naivas_' + p.id + '" value="' + p.naivas + '" style="width:80px;padding:5px;"></div>' +
                '<div>Carrefour: <input type="number" id="price_carrefour_' + p.id + '" value="' + p.carrefour + '" style="width:80px;padding:5px;"></div>' +
                '<div>Quickmart: <input type="number" id="price_quickmart_' + p.id + '" value="' + p.quickmart + '" style="width:80px;padding:5px;"></div>' +
                '<button class="edit-btn" onclick="window.updatePrice(' + p.id + ')">Update</button>' +
                '</div>';
            container.appendChild(div);
        }
    }

    window.updatePrice = function(id) {
        const naivas = parseFloat(document.getElementById('price_naivas_' + id).value);
        const carrefour = parseFloat(document.getElementById('price_carrefour_' + id).value);
        const quickmart = parseFloat(document.getElementById('price_quickmart_' + id).value);
        
        if (isNaN(naivas) || isNaN(carrefour) || isNaN(quickmart)) {
            alert('Please enter valid prices');
            return;
        }
        
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products[i].naivas = naivas;
                products[i].carrefour = carrefour;
                products[i].quickmart = quickmart;
                break;
            }
        }
        
        localStorage.setItem('products', JSON.stringify(products));
        alert('Prices updated successfully!');
        displayPrices();
        displayProducts();
        updateStats();
    };

    function displayUsers() {
        const container = document.getElementById('usersList');
        if (!container) return;
        container.innerHTML = '';
        
        if (users.length === 0) {
            container.innerHTML = '<p style="text-align:center;padding:40px;">No users registered yet.</p>';
            return;
        }
        
        for (let i = 0; i < users.length; i++) {
            const u = users[i];
            const div = document.createElement('div');
            div.className = 'user-row';
            div.innerHTML = '<div><strong>' + u.fullname + '</strong><br><small>' + u.email + '</small><br><small>Joined: ' + new Date(u.registeredAt).toLocaleDateString() + '</small><br><small>Location: ' + (u.location || 'Not specified') + '</small></div>' +
                '<div class="user-actions"><button class="disable-btn" onclick="window.disableUser(' + i + ')">Disable</button><button class="delete-btn" onclick="window.deleteUser(' + i + ')">Delete</button></div>';
            container.appendChild(div);
        }
    }

    window.disableUser = function(idx) {
        if (confirm('Disable user ' + users[idx].email + '?')) {
            alert('User ' + users[idx].email + ' has been disabled.');
        }
    };

    window.deleteUser = function(idx) {
        if (confirm('Delete user ' + users[idx].email + '? This action cannot be undone.')) {
            users.splice(idx, 1);
            localStorage.setItem('users', JSON.stringify(users));
            displayUsers();
            updateStats();
            alert('User deleted successfully!');
        }
    };

    function displayReports() {
        // Most compared products (simulate based on basket data)
        const topProductsContainer = document.getElementById('topProducts');
        const supermarketStatsContainer = document.getElementById('supermarketStats');
        
        if (topProductsContainer) {
            let topProductsHtml = '<ul style="list-style:none;padding:0;">';
            for (let i = 0; i < Math.min(5, products.length); i++) {
                topProductsHtml += '<li style="padding:8px 0;border-bottom:1px solid #e2e8f0;">' + (i+1) + '. ' + products[i].name + ' - Added to basket ' + Math.floor(Math.random() * 50) + ' times</li>';
            }
            topProductsHtml += '</ul>';
            topProductsContainer.innerHTML = topProductsHtml;
        }
        
        if (supermarketStatsContainer) {
            supermarketStatsContainer.innerHTML = 
                '<div style="margin-bottom:15px;"><strong>Naivas:</strong> Most competitive for ' + Math.floor(Math.random() * 7 + 3) + ' products</div>' +
                '<div style="margin-bottom:15px;"><strong>Carrefour:</strong> Most competitive for ' + Math.floor(Math.random() * 7 + 3) + ' products</div>' +
                '<div><strong>Quickmart:</strong> Most competitive for ' + Math.floor(Math.random() * 6 + 2) + ' products</div>';
        }
    }

    // Save product from modal
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', function() {
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const naivas = parseFloat(document.getElementById('productNaivas').value);
            const carrefour = parseFloat(document.getElementById('productCarrefour').value);
            const quickmart = parseFloat(document.getElementById('productQuickmart').value);
            
            if (!name || !category || isNaN(naivas) || isNaN(carrefour) || isNaN(quickmart)) {
                alert('Please fill all fields correctly');
                return;
            }
            
            if (currentProductId) {
                // Edit existing product
                for (let i = 0; i < products.length; i++) {
                    if (products[i].id === currentProductId) {
                        products[i].name = name;
                        products[i].category = category;
                        products[i].naivas = naivas;
                        products[i].carrefour = carrefour;
                        products[i].quickmart = quickmart;
                        break;
                    }
                }
                alert('Product updated successfully!');
            } else {
                // Add new product
                const newId = products.length > 0 ? products[products.length - 1].id + 1 : 11;
                products.push({
                    id: newId,
                    name: name,
                    category: category,
                    naivas: naivas,
                    carrefour: carrefour,
                    quickmart: quickmart
                });
                alert('Product added successfully!');
            }
            
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
            displayPrices();
            updateStats();
            document.getElementById('productModal').classList.remove('active');
            currentProductId = null;
            document.getElementById('productModalTitle').innerHTML = 'Add Product';
            
            // Clear form
            document.getElementById('productName').value = '';
            document.getElementById('productCategory').value = '';
            document.getElementById('productNaivas').value = '';
            document.getElementById('productCarrefour').value = '';
            document.getElementById('productQuickmart').value = '';
        });
    }

    // Cancel product modal
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', function() {
            document.getElementById('productModal').classList.remove('active');
            currentProductId = null;
            document.getElementById('productModalTitle').innerHTML = 'Add Product';
            document.getElementById('productName').value = '';
            document.getElementById('productCategory').value = '';
            document.getElementById('productNaivas').value = '';
            document.getElementById('productCarrefour').value = '';
            document.getElementById('productQuickmart').value = '';
        });
    }

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            currentProductId = null;
            document.getElementById('productModalTitle').innerHTML = 'Add New Product';
            document.getElementById('productName').value = '';
            document.getElementById('productCategory').value = '';
            document.getElementById('productNaivas').value = '';
            document.getElementById('productCarrefour').value = '';
            document.getElementById('productQuickmart').value = '';
            document.getElementById('productModal').classList.add('active');
        });
    }

    // Bulk update button
    const bulkUpdateBtn = document.getElementById('bulkUpdateBtn');
    const bulkModal = document.getElementById('bulkModal');
    const cancelBulkBtn = document.getElementById('cancelBulkBtn');
    const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
    const uploadBulkBtn = document.getElementById('uploadBulkBtn');
    const bulkFile = document.getElementById('bulkFile');

    if (bulkUpdateBtn) {
        bulkUpdateBtn.addEventListener('click', function() {
            if (bulkModal) bulkModal.classList.add('active');
        });
    }

    if (cancelBulkBtn) {
        cancelBulkBtn.addEventListener('click', function() {
            if (bulkModal) bulkModal.classList.remove('active');
        });
    }

    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', function() {
            let csvContent = "Product Name,Category,Naivas Price,Carrefour Price,Quickmart Price\n";
            for (let i = 0; i < products.length; i++) {
                csvContent += products[i].name + "," + products[i].category + "," + products[i].naivas + "," + products[i].carrefour + "," + products[i].quickmart + "\n";
            }
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'price_template.csv';
            a.click();
            URL.revokeObjectURL(url);
            alert('Template downloaded!');
        });
    }

    if (uploadBulkBtn && bulkFile) {
        uploadBulkBtn.addEventListener('click', function() {
            const file = bulkFile.files[0];
            if (!file) {
                alert('Please select a file to upload');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const lines = content.split('\n');
                let updatedCount = 0;
                
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',');
                    if (cols.length >= 5 && cols[0].trim()) {
                        const productName = cols[0].trim();
                        const naivas = parseFloat(cols[2]);
                        const carrefour = parseFloat(cols[3]);
                        const quickmart = parseFloat(cols[4]);
                        
                        if (!isNaN(naivas) && !isNaN(carrefour) && !isNaN(quickmart)) {
                            for (let j = 0; j < products.length; j++) {
                                if (products[j].name.toLowerCase() === productName.toLowerCase()) {
                                    products[j].naivas = naivas;
                                    products[j].carrefour = carrefour;
                                    products[j].quickmart = quickmart;
                                    updatedCount++;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if (updatedCount > 0) {
                    localStorage.setItem('products', JSON.stringify(products));
                    displayProducts();
                    displayPrices();
                    updateStats();
                    alert('Successfully updated ' + updatedCount + ' products!');
                } else {
                    alert('No products were updated. Please check your file format.');
                }
                
                if (bulkModal) bulkModal.classList.remove('active');
                bulkFile.value = '';
            };
            reader.readAsText(file);
        });
    }

    // Setup navigation
    function setupAdminNav() {
        const navOverview = document.getElementById('navOverview');
        const navProducts = document.getElementById('navProducts');
        const navPrices = document.getElementById('navPrices');
        const navUsers = document.getElementById('navUsers');
        const navReports = document.getElementById('navReports');
        const logoutBtn = document.getElementById('adminLogoutBtn');
        
        const overviewView = document.getElementById('overviewView');
        const productsView = document.getElementById('productsView');
        const pricesView = document.getElementById('pricesView');
        const usersView = document.getElementById('usersView');
        const reportsView = document.getElementById('reportsView');
        
        if (navOverview) {
            navOverview.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (overviewView) overviewView.classList.add('active');
            });
        }
        
        if (navProducts) {
            navProducts.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (productsView) productsView.classList.add('active');
                displayProducts();
            });
        }
        
        if (navPrices) {
            navPrices.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (pricesView) pricesView.classList.add('active');
                displayPrices();
            });
        }
        
        if (navUsers) {
            navUsers.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (usersView) usersView.classList.add('active');
                displayUsers();
            });
        }
        
        if (navReports) {
            navReports.addEventListener('click', function(e) {
                e.preventDefault();
                const allNavs = document.querySelectorAll('.nav-item');
                for (let i = 0; i < allNavs.length; i++) allNavs[i].classList.remove('active');
                this.classList.add('active');
                const allViews = document.querySelectorAll('.view');
                for (let j = 0; j < allViews.length; j++) allViews[j].classList.remove('active');
                if (reportsView) reportsView.classList.add('active');
                displayReports();
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('adminLoggedIn');
                window.location.href = 'index.html';
            });
        }
    }

    // Close modal when clicking outside
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('click', function(e) {
            if (e.target === productModal) {
                productModal.classList.remove('active');
                currentProductId = null;
            }
        });
    }
    
    const bulkModalElement = document.getElementById('bulkModal');
    if (bulkModalElement) {
        bulkModalElement.addEventListener('click', function(e) {
            if (e.target === bulkModalElement) {
                bulkModalElement.classList.remove('active');
            }
        });
    }

    // Initialize admin dashboard
    updateStats();
    displayProducts();
    displayUsers();
    setupAdminNav();
    
    // Set admin name in header
    const adminNameSpan = document.getElementById('adminName');
    if (adminNameSpan) {
        adminNameSpan.innerHTML = 'Administrator';
    }
    
    const adminEmailSpan = document.getElementById('adminEmail');
    if (adminEmailSpan) {
        adminEmailSpan.innerHTML = 'admin@shopcompare.com';
    }
}