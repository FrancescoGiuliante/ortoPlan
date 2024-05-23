const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);

fetch('http://localhost:8000/home', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
        .then(res => {
            console.log(res);
            if (!res.ok) {
                window.location.href = '/login';
            }
            return res.json()
        }).then(data => {
            const span = document.querySelector('#user');
            span.textContent = userStorage['firstName'];
        })


