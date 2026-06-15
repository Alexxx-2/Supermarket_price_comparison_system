if (document.getElementById('registerForm')) {
    const form = document.getElementById('registerForm');
    const fullname = document.getElementById('fullname');
    const email = document.getElementById('regEmail');
    const password = document.getElementById('regPassword');
    const confirm = document.getElementById('confirmPassword');
    const terms = document.getElementById('termsCheckbox');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');
    const modalBtn = document.getElementById('modalLoginBtn');

    function showError(id, msg) {
        const err = document.getElementById(id + 'Error');
        if (err) err.innerText = msg;
        const inp = document.getElementById(id === 'regEmail' ? 'regEmail' : id);
        if (inp) inp.style.borderColor = '#ef4444';
    }
    function clearError(id) {
        const err = document.getElementById(id + 'Error');
        if (err) err.innerText = '';
        const inp = document.getElementById(id === 'regEmail' ? 'regEmail' : id);
        if (inp) inp.style.borderColor = '#e2e8f0';
    }

    document.getElementById('toggleRegPassword')?.addEventListener('click', () => {
        const type = password.type === 'password' ? 'text' : 'password';
        password.type = type;
        document.getElementById('toggleRegPassword').querySelector('i').classList.toggle('fa-eye-slash');
    });
    document.getElementById('toggleConfirmPassword')?.addEventListener('click', () => {
        const type = confirm.type === 'password' ? 'text' : 'password';
        confirm.type = type;
        document.getElementById('toggleConfirmPassword').querySelector('i').classList.toggle('fa-eye-slash');
    });

    fullname.addEventListener('input', () => {
        if (fullname.value.trim().length < 3 && fullname.value.trim() !== '') showError('fullname', 'Min 3 chars');
        else clearError('fullname');
    });
    email.addEventListener('input', () => {
        if (email.value.trim() && !validateEmail(email.value.trim())) showError('regEmail', 'Invalid email');
        else clearError('regEmail');
    });
    password.addEventListener('input', () => {
        if (password.value && password.value.length < 6) showError('regPassword', 'Min 6 chars');
        else clearError('regPassword');
        if (confirm.value && confirm.value !== password.value) showError('confirmPassword', 'Not match');
        else clearError('confirmPassword');
    });
    confirm.addEventListener('input', () => {
        if (confirm.value !== password.value) showError('confirmPassword', 'Not match');
        else clearError('confirmPassword');
    });
    terms.addEventListener('change', () => clearError('terms'));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        ['fullname', 'regEmail', 'regPassword', 'confirmPassword', 'terms'].forEach(clearError);
        let ok = true;
        if (fullname.value.trim().length < 3) { showError('fullname', 'Min 3 chars'); ok = false; }
        if (!email.value.trim()) { showError('regEmail', 'Email required'); ok = false; }
        else if (!validateEmail(email.value.trim())) { showError('regEmail', 'Invalid email'); ok = false; }
        if (!password.value) { showError('regPassword', 'Password required'); ok = false; }
        else if (password.value.length < 6) { showError('regPassword', 'Min 6 chars'); ok = false; }
        if (!confirm.value) { showError('confirmPassword', 'Confirm required'); ok = false; }
        else if (confirm.value !== password.value) { showError('confirmPassword', 'Not match'); ok = false; }
        if (!terms.checked) { showError('terms', 'Agree to terms'); ok = false; }
        if (!ok) return;

        loadingOverlay.classList.add('active');
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(u => u.email === email.value.trim())) {
                alert('Email already exists');
                loadingOverlay.classList.remove('active');
                return;
            }
            const newUser = {
                fullname: fullname.value.trim(),
                email: email.value.trim(),
                password: password.value,
                location: document.getElementById('location')?.value.trim() || '',
                registeredAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            loadingOverlay.classList.remove('active');
            successModal.classList.add('active');
            form.reset();
        }, 800);
    });

    modalBtn?.addEventListener('click', () => {
        successModal.classList.remove('active');
        window.location.href = 'index.html';
    });
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            window.location.href = 'index.html';
        }
    });

    // Social signup demo
    async function socialSignup(provider) {
        loadingOverlay.classList.add('active');
        await new Promise(r => setTimeout(r, 1000));
        let fakeEmail, fullname;
        if (provider === 'google') { fakeEmail = `user_${Math.floor(Math.random()*10000)}@gmail.com`; fullname = 'Google User'; }
        else if (provider === 'facebook') { fakeEmail = `fb_${Math.floor(Math.random()*10000)}@facebook.com`; fullname = 'Facebook User'; }
        else { fakeEmail = `appleid_${Math.floor(Math.random()*10000)}@privaterelay.appleid.com`; fullname = 'Apple User'; }
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.find(u => u.email === fakeEmail)) {
            users.push({ fullname, email: fakeEmail, password: '', location: '', registeredAt: new Date().toISOString() });
            localStorage.setItem('users', JSON.stringify(users));
        }
        loadingOverlay.classList.remove('active');
        alert(`Demo: ${provider} account created. Please login.`);
        window.location.href = 'index.html';
    }
    document.querySelector('.google-btn')?.addEventListener('click', () => socialSignup('google'));
    document.querySelector('.facebook-btn')?.addEventListener('click', () => socialSignup('facebook'));
    document.querySelector('.apple-btn')?.addEventListener('click', () => socialSignup('apple'));

    document.getElementById('termsLink')?.addEventListener('click', (e) => { e.preventDefault(); alert('Terms of Service (demo)'); });
    document.getElementById('privacyLink')?.addEventListener('click', (e) => { e.preventDefault(); alert('Privacy Policy (demo)'); });
}