// ========== REGISTER JS - WORKING FOR LIVE SERVER ==========

console.log("🚀 register.js loaded"); // This confirms the file loads

document.addEventListener('DOMContentLoaded', function() {

    console.log("✅ DOM ready");

    const form = document.getElementById('registerForm');
    if (!form) {
        console.error("❌ registerForm not found!");
        return;
    }
    console.log("✅ registerForm found");

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // BLOCKS PAGE RELOAD

        console.log("✅ Submit event captured");

        // Gather values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        const location = document.getElementById('location').value.trim();
        const terms = document.getElementById('termsCheckbox').checked;

        // Basic validation
        if (name.length < 3) { alert('Name must be at least 3 characters'); return; }
        if (!validateEmail(email)) { alert('Please enter a valid email'); return; }
        if (password.length < 6) { alert('Password must be at least 6 characters'); return; }
        if (password !== confirm) { alert('Passwords do not match'); return; }
        if (!terms) { alert('You must agree to the Terms of Service'); return; }

        // Show loading
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.add('active');

        // Build the correct URL
        // CHANGE THIS FOLDER NAME TO EXACTLY MATCH YOUR htdocs FOLDER
        const baseUrl = 'http://localhost/Supermarket_price_comparison_system/php/register.php';

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    location: location
                })
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (loadingOverlay) loadingOverlay.classList.remove('active');

            if (data.success) {
                const successModal = document.getElementById('successModal');
                if (successModal) successModal.classList.add('active');
                form.reset();
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if (loadingOverlay) loadingOverlay.classList.remove('active');
            alert('Could not connect to the server. Make sure XAMPP is running.');
        }
    });

    // Modal login button
    const modalBtn = document.getElementById('modalLoginBtn');
    if (modalBtn) {
        modalBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});