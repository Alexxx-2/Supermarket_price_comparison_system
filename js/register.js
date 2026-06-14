// ========== REGISTRATION PAGE FUNCTIONALITY ==========
// This file ONLY runs on the registration page

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

    // Toggle password visibility
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle confirm password visibility
    if (toggleConfirmBtn) {
        toggleConfirmBtn.addEventListener('click', function() {
            const type = confirmInput.type === 'password' ? 'text' : 'password';
            confirmInput.type = type;
            const icon = toggleConfirmBtn.querySelector('i');
            if (icon) icon.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
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
            location: document.getElementById('location') ? document.getElementById('location').value : '',
            registeredAt: new Date().toISOString()
        };

        if (loadingOverlay) loadingOverlay.classList.add('active');
        
        setTimeout(function() {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            let emailExists = false;
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === userData.email) {
                    emailExists = true;
                    break;
                }
            }
            
            if (emailExists) {
                alert('Email already exists');
            } else {
                users.push(userData);
                localStorage.setItem('users', JSON.stringify(users));
                if (successModal) successModal.classList.add('active');
                form.reset();
            }
            if (loadingOverlay) loadingOverlay.classList.remove('active');
        }, 1000);
    });

    // Modal close button
    const modalBtn = document.getElementById('modalLoginBtn');
    if (modalBtn) {
        modalBtn.addEventListener('click', function() {
            if (successModal) successModal.classList.remove('active');
            window.location.href = 'index.html';
        });
    }
}