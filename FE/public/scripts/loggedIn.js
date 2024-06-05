fetch('http://localhost:8000/loggedIn', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
        .then(res => {
            console.log(res);
            if (!res.ok) {
                window.location.href = '/login';
            }
            return res.json()
        })