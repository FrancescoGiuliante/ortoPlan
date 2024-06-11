function fetchProfilo(params) {
    fetch(`http://localhost:8000/users/${userId}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
        .then(res => {
            if (!res.ok) {
                window.location.href = '/login';
            }
            return res.json()
        }).then(data => {
            const spanFirstName = document.querySelector('#firstname');
            const spanFirstNameHead = document.querySelector('#firstname_head');
            const spanLastName = document.querySelector('#lastname');
            const spanEmail = document.querySelector('#email');

            spanFirstNameHead.textContent = data.firstName
            spanFirstName.textContent = data.firstName
            spanLastName.textContent = data.lastName
            spanEmail.textContent = data.email
        })
}

function openModal() {
    document.getElementById('firstName').value = userStorage['firstName'];
    document.getElementById('lastName').value = userStorage['lastName'];
    document.getElementById('emailForm').value = userStorage['email'];
    const modal = document.getElementById('my_modal_4');
    modal.showModal();
}

function closeModal() {
    const modal = document.getElementById('my_modal_4');
    modal.close();
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
const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
const userId = userStorage['id']
fetchProfilo()

document.getElementById('modifica').addEventListener('click', function () {
    openModal();
});

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const conferma = confirm("Sei sicuro di voler salvare le modifiche?");
    if (!conferma) {
        console.log("Modifica annullata.");
        return;
    }
    document.querySelectorAll('.input-error').forEach((element) => {
        element.remove();
    });

    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;

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

    const url = 'http://localhost:8000/users/' + userParse.id;

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
            } else {
                const user = JSON.parse(localStorage.getItem('user'));
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = email;
                localStorage.setItem('user', JSON.stringify(user));
                fetchProfilo()
                closeModal()
            }
        })
});
