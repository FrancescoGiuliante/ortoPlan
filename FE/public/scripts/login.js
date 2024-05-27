const loginForm = document.querySelector('#loginForm')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const errorBanner = document.getElementById('errorBanner');
    errorBanner.classList.add('hidden');

    const inputEmail = document.querySelector('[name="email"]')
    const inputPassword = document.querySelector('[name="password"]')

    email = inputEmail.value
    password = inputPassword.value

    const res = await fetch("http://localhost:8000/login", {
        body: JSON.stringify({
            email,
            password
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.status !== 200) {
        console.log('errore');
        return
    }

    const data = await res.json()

    console.log('data: ', data.message);
    if (data.message == 'credenziali errate') {
        errorBanner.classList.remove('hidden');
    } else {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        window.location.href = '/home';
    }
})