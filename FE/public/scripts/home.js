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
            console.log('Data: ', data);
        })


