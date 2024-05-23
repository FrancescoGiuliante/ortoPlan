fetch('http://localhost:8000/profilo', {
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
            console.log(data.user['lastName'], data.user['email'] );
            const spanFirstName = document.querySelector('#firstname');
            const spanFirstNameHead = document.querySelector('#firstname_head');
            const spanLastName = document.querySelector('#lastname');
            const spanEmail = document.querySelector('#email');

            spanFirstNameHead.textContent = data.user['firstName'];
            spanFirstName.textContent = data.user['firstName'];
            spanLastName.textContent = data.user['lastName'];
            spanEmail.textContent = data.user['email'];
            
        })

