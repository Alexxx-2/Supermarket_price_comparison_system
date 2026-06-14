// ========== LOGIN PAGE FUNCTIONALITY ==========
// This file ONLY runs on the login page

if (document.getElementById('loginForm')) {
    
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('toggleLoginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const registerLink = document.getElementById('registerLink');
    const adminLoginLink = document.getElementById('adminLoginLink');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Toggle password visibility
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.classList.toggle('fa-eye-slash');
        });
    }

    // Admin Login
    if (adminLoginLink) {
        adminLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
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

    // Customer Login
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email) { alert('Email is required'); return; }
        if (!validateEmail(email)) { alert('Invalid email'); return; }
        if (!password) { alert('Password is required'); return; }
        if (password.length < 6) { alert('Password must be at least 6 characters'); return; }

        if (loadingOverlay) loadingOverlay.classList.add('active');
        
        setTimeout(function() {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            let user = null;
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === email && users[i].password === password) {
                    user = users[i];
                    break;
                }
            }
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password');
            }
            if (loadingOverlay) loadingOverlay.classList.remove('active');
        }, 1000);
    });

    // Register link
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }

    // Remember me
    const rememberedUser = localStorage.getItem('currentUser');
    if (rememberedUser && emailInput) {
        try {
            const user = JSON.parse(rememberedUser);
            emailInput.value = user.email;
            if (rememberMe) rememberMe.checked = true;
        } catch(e) {}
    }
}