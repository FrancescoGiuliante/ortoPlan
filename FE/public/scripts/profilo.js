function fetchProfilo(params) {
    const userString = localStorage.getItem('user');
    const userStorage = JSON.parse(userString);

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
        const spanFirstName = document.querySelector('#firstname');
        const spanFirstNameHead = document.querySelector('#firstname_head');
        const spanLastName = document.querySelector('#lastname');
        const spanEmail = document.querySelector('#email');
        console.log('data2', params);
        if (params) {
            data.user['firstName'] = params['firstName']
            data.user['lastName'] = params['lastName']
            data.user['email'] = params['email']
        }
        console.log('Data2: ', data);
        spanFirstNameHead.textContent = userStorage['firstName'];
        spanFirstName.textContent = userStorage['firstName'];
        spanLastName.textContent = userStorage['lastName'];
        spanEmail.textContent = userStorage['email'];
    })
}

function setError(el, message) {
    el.style.border = '1px solid red';
    const span = document.createElement('span');
    span.classList.add('input-error');
    span.textContent = message;
    span.style.color = 'red';
    el.parentNode.insertBefore(span, el.nextSibling);
}

const userForm = document.querySelector('#userForm');
const user = localStorage.getItem('user');
const userParse = JSON.parse(user)

fetchProfilo()

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelectorAll('.input-error').forEach((element) => {
        element.remove();
    });

    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;

    console.log(firstName, lastName, email, password, confirmPassword);

    const validation = validate({
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    }, {
        firstName: {
            presence: { allowEmpty: true },
            length: { minimum: 5 }
        },
        lastName: {
            presence: { allowEmpty: true },
            length: { minimum: 5 }
        },
        email: {
            presence: { allowEmpty: true },
            email: true
        },
        password: {
            length: { minimum: 5 }
        },
        confirmPassword: {
            equality: {
                attribute: "password",
                message: "Le password non corrispondono"
            }
        }
    });

    if (validation) {
        Object.keys(validation).forEach(key => {
            const el = document.querySelector(`input[name=${key}]`);
            setError(el, validation[key]);
        });
        return;
    }

    const url = 'http://localhost:8000/users/' + userParse.id ;

    fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.isError) {
                Object.keys(data.error).forEach(key => setError(document.querySelector(`input[name=${key}]`), data.error[key]))
                console.log(data.error[key])
            } else {
                const user = JSON.parse(localStorage.getItem('user'));
                console.log('1',user);
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = email;
                localStorage.setItem('user', JSON.stringify(user));
                console.log('2',user);
                fetchProfilo(user)
            }
        })
});
