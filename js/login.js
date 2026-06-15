if (document.getElementById('loginForm')) {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('toggleLoginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const forgotLink = document.getElementById('forgotPasswordLink');
    const registerLink = document.getElementById('registerLink');
    const adminLink = document.getElementById('adminLoginLink');
    const loadingOverlay = document.getElementById('loadingOverlay');

    function showError(field, msg) {
        const errSpan = document.getElementById(field + 'Error');
        if (errSpan) errSpan.innerText = msg;
        const inp = document.getElementById(field);
        if (inp) inp.style.borderColor = '#ef4444';
    }
    function clearError(field) {
        const errSpan = document.getElementById(field + 'Error');
        if (errSpan) errSpan.innerText = '';
        const inp = document.getElementById(field);
        if (inp) inp.style.borderColor = '#e2e8f0';
    }

    toggleBtn?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleBtn.querySelector('i').classList.toggle('fa-eye-slash');
    });

    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) showError('loginEmail', 'Invalid email');
        else clearError('loginEmail');
    });
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value && passwordInput.value.length < 6) showError('loginPassword', 'Min 6 chars');
        else clearError('loginPassword');
    });

    forgotLink?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'forgot-password.html';
    });
    registerLink?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'register.html';
    });
    adminLink?.addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Admin Email:', 'admin@shopcompare.com');
        const pass = prompt('Admin Password:');
        if (email === 'admin@shopcompare.com' && pass === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else alert('Invalid admin credentials');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        clearError('loginEmail');
        clearError('loginPassword');
        let ok = true;
        if (!email) { showError('loginEmail', 'Email required'); ok = false; }
        else if (!validateEmail(email)) { showError('loginEmail', 'Invalid email'); ok = false; }
        if (!password) { showError('loginPassword', 'Password required'); ok = false; }
        else if (password.length < 6) { showError('loginPassword', 'Min 6 chars'); ok = false; }
        if (!ok) return;

        loadingOverlay.classList.add('active');
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                if (rememberMe.checked) localStorage.setItem('currentUser', JSON.stringify(user));
                else sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password');
                loadingOverlay.classList.remove('active');
            }
        }, 800);
    });

    const remembered = localStorage.getItem('currentUser');
    if (remembered) {
        try {
            const u = JSON.parse(remembered);
            emailInput.value = u.email;
            rememberMe.checked = true;
        } catch(e) {}
    }

    // Social login demo
    async function socialLogin(provider) {
        loadingOverlay.classList.add('active');
        await new Promise(r => setTimeout(r, 1000));
        let fakeEmail, fullname;
        if (provider === 'google') { fakeEmail = `user_${Math.floor(Math.random()*10000)}@gmail.com`; fullname = 'Google User'; }
        else if (provider === 'facebook') { fakeEmail = `fb_${Math.floor(Math.random()*10000)}@facebook.com`; fullname = 'Facebook User'; }
        else { fakeEmail = `appleid_${Math.floor(Math.random()*10000)}@privaterelay.appleid.com`; fullname = 'Apple User'; }
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let user = users.find(u => u.email === fakeEmail);
        if (!user) {
            user = { fullname, email: fakeEmail, password: '', location: '', registeredAt: new Date().toISOString() };
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
        }
        if (rememberMe.checked) localStorage.setItem('currentUser', JSON.stringify(user));
        else sessionStorage.setItem('currentUser', JSON.stringify(user));
        loadingOverlay.classList.remove('active');
        window.location.href = 'dashboard.html';
    }
    document.querySelector('.google-btn')?.addEventListener('click', () => socialLogin('google'));
    document.querySelector('.facebook-btn')?.addEventListener('click', () => socialLogin('facebook'));
    document.querySelector('.apple-btn')?.addEventListener('click', () => socialLogin('apple'));
}