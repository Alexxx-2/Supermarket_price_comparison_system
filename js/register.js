// ========== REGISTRATION PAGE WITH PHP BACKEND ==========

if (document.getElementById('registerForm')) {
    
    const form = document.getElementById('registerForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const confirmInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');
    const modalLoginBtn = document.getElementById('modalLoginBtn');

    // Toggle password visibility
    const togglePasswordBtn = document.getElementById('toggleRegPassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) icon.classList.toggle('fa-eye-slash');
        });
    }
    const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmBtn) {
        toggleConfirmBtn.addEventListener('click', () => {
            const type = confirmInput.type === 'password' ? 'text' : 'password';
            confirmInput.type = type;
            const icon = toggleConfirmBtn.querySelector('i');
            if (icon) icon.classList.toggle('fa-eye-slash');
        });
    }

    // Helper to show inline error
    function showError(fieldId, message) {
        const errSpan = document.getElementById(fieldId + 'Error');
        if (errSpan) errSpan.innerText = message;
        const input = document.getElementById(fieldId === 'regEmail' ? 'regEmail' : fieldId);
        if (input) input.style.borderColor = '#ef4444';
    }
    function clearError(fieldId) {
        const errSpan = document.getElementById(fieldId + 'Error');
        if (errSpan) errSpan.innerText = '';
        const input = document.getElementById(fieldId === 'regEmail' ? 'regEmail' : fieldId);
        if (input) input.style.borderColor = '#e2e8f0';
    }

    // Real-time validation
    fullnameInput.addEventListener('input', () => {
        if (fullnameInput.value.trim().length < 3 && fullnameInput.value.trim() !== '') {
            showError('fullname', 'Name must be at least 3 characters');
        } else {
            clearError('fullname');
        }
    });
    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
            showError('regEmail', 'Enter a valid email address');
        } else {
            clearError('regEmail');
        }
    });
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value && passwordInput.value.length < 6) {
            showError('regPassword', 'Password must be at least 6 characters');
        } else {
            clearError('regPassword');
        }
        if (confirmInput.value && confirmInput.value !== passwordInput.value) {
            showError('confirmPassword', 'Passwords do not match');
        } else {
            clearError('confirmPassword');
        }
    });
    confirmInput.addEventListener('input', () => {
        if (confirmInput.value !== passwordInput.value) {
            showError('confirmPassword', 'Passwords do not match');
        } else {
            clearError('confirmPassword');
        }
    });
    termsCheckbox.addEventListener('change', () => clearError('terms'));

    // ========== FORM SUBMISSION - SENDS TO PHP BACKEND ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear all previous errors
        ['fullname', 'regEmail', 'regPassword', 'confirmPassword', 'terms'].forEach(id => clearError(id));

        let isValid = true;
        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;
        const terms = termsCheckbox.checked;
        const location = document.getElementById('location')?.value.trim() || '';

        if (fullname.length < 3) {
            showError('fullname', 'Full name must be at least 3 characters');
            isValid = false;
        }
        if (!email) {
            showError('regEmail', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('regEmail', 'Enter a valid email address');
            isValid = false;
        }
        if (!password) {
            showError('regPassword', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('regPassword', 'Password must be at least 6 characters');
            isValid = false;
        }
        if (!confirm) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (confirm !== password) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        if (!terms) {
            showError('terms', 'You must agree to the Terms of Service');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading overlay
        if (loadingOverlay) loadingOverlay.classList.add('active');

        try {
            // Send registration data to PHP backend
            const response = await fetch('http://localhost/supermarket-api/api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullname: fullname,
                    email: email,
                    password: password,
                    location: location
                })
            });

            const data = await response.json();

            if (data.success) {
                // Registration successful
                if (loadingOverlay) loadingOverlay.classList.remove('active');
                successModal.classList.add('active');
                form.reset();
            } else {
                // Show error message from backend
                if (loadingOverlay) loadingOverlay.classList.remove('active');
                alert(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (loadingOverlay) loadingOverlay.classList.remove('active');
            alert('Could not connect to the server. Please make sure XAMPP is running.');
        }
    });

    // Modal button: go to login
    if (modalLoginBtn) {
        modalLoginBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            window.location.href = 'index.html';
        });
    }

    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            window.location.href = 'index.html';
        }
    });

    // ========== SOCIAL SIGNUP (Demo) ==========
    async function socialSignup(provider) {
        if (loadingOverlay) loadingOverlay.classList.add('active');
        
        let fakeEmail = '';
        let fullname = '';
        switch(provider) {
            case 'google':
                fakeEmail = `user_${Math.floor(Math.random()*10000)}@gmail.com`;
                fullname = 'Google User';
                break;
            case 'facebook':
                fakeEmail = `fb_${Math.floor(Math.random()*10000)}@facebook.com`;
                fullname = 'Facebook User';
                break;
            case 'apple':
                fakeEmail = `appleid_${Math.floor(Math.random()*10000)}@privaterelay.appleid.com`;
                fullname = 'Apple User';
                break;
        }

        try {
            const response = await fetch('http://localhost/supermarket-api/api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullname: fullname,
                    email: fakeEmail,
                    password: '',
                    location: ''
                })
            });

            const data = await response.json();

            if (loadingOverlay) loadingOverlay.classList.remove('active');
            
            if (data.success) {
                alert(`Your ${provider} account has been created! You can now login.`);
                window.location.href = 'index.html';
            } else {
                // If email already exists, just redirect to login
                if (data.error && data.error.includes('already')) {
                    alert(`You already have a ${provider} account. Please login.`);
                    window.location.href = 'index.html';
                } else {
                    alert(data.error || 'Social signup failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Social signup error:', error);
            if (loadingOverlay) loadingOverlay.classList.remove('active');
            alert('Could not connect to the server. Please make sure XAMPP is running.');
        }
    }

    document.querySelector('.google-btn')?.addEventListener('click', () => socialSignup('google'));
    document.querySelector('.facebook-btn')?.addEventListener('click', () => socialSignup('facebook'));
    document.querySelector('.apple-btn')?.addEventListener('click', () => socialSignup('apple'));

    // Terms & Privacy demo links
    document.getElementById('termsLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Terms of Service (demo)');
    });
    document.getElementById('privacyLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Privacy Policy (demo)');
    });
}