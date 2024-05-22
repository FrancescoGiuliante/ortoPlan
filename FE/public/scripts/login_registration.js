const loginForm = document.querySelector('#userForm')

userForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = e.target.children[2].value;
    const password = e.target.children[3].value;

    // console.log({email, password});

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

    console.log('data: ',data);

    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)

    window.location.href = '/home';
})