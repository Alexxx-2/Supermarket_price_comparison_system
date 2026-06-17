// ========== LOGIN JS ==========

document.addEventListener('DOMContentLoaded', function() {

    console.log("✅ LOGIN JS LOADED");

    const form = document.getElementById('loginForm');
    if (!form) {
        console.error("❌ Login form not found");
        return;
    }
    console.log("✅ Login form found");

    // ========== REGISTER LINK ==========
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("✅ Register link clicked - redirecting");
            window.location.href = 'register.html';
        });
    } else {
        console.error("❌ registerLink not found! Check id='registerLink'");
    }

    // ========== LOGIN FORM SUBMIT ==========
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log("✅ Login submit triggered");

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!validateEmail(email)) {
            alert('Please enter a valid email');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.add('active');

        try {
            const response = await fetch('http://localhost/Supermarket_price_comparison_system/php/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("Server response:", data);

            if (loadingOverlay) loadingOverlay.classList.remove('active');

            if (data.success) {
                if (document.getElementById('rememberMe')?.checked) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                }
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (loadingOverlay) loadingOverlay.classList.remove('active');
            alert('Could not connect to the server. Make sure XAMPP is running.');
        }
    });

    // ========== OTHER LINKS ==========
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Forgot password feature coming soon!');
        });
    }

    const adminLink = document.getElementById('adminLoginLink');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            const adminEmail = prompt('Enter Admin Email:', 'admin@shopcompare.com');
            const adminPassword = prompt('Enter Admin Password:');
            if (adminEmail === 'admin@shopcompare.com' && adminPassword === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                alert('Admin login successful!');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid admin credentials.');
            }
        });
    }

});