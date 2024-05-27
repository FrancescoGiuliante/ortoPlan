function setError(el, message) {
    el.style.border = '1px solid red';
    const span = document.createElement('span');
    span.classList.add('input-error');
    span.textContent = message;
    span.style.color = 'red';
    el.parentNode.insertBefore(span, el.nextSibling);
}

const userForm = document.querySelector('#userForm');

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
            presence: { allowEmpty: false },
            length: { minimum: 5 }
        },
        lastName: {
            presence: { allowEmpty: false },
            length: { minimum: 5 }
        },
        email: {
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

    const url = 'http://localhost:8000/users';

    const userResponse = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const userData = await userResponse.json();

    if (userData.isError) {
        Object.keys(userData.error).forEach(key => setError(document.querySelector(`input[name=${key}]`), userData.error[key]))
        console.log(userData.error[key]);
        return;
    }

    const loginResponse = await fetch("http://localhost:8000/login", {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (loginResponse.status !== 200) {
        console.log('errore');
        return;
    }

    const loginData = await loginResponse.json();

    console.log('data: ', loginData.message);
    if (loginData.message == 'credenziali errate') {
        errorBanner.classList.remove('hidden');
    } else {
        localStorage.setItem('user', JSON.stringify(loginData.user));
        localStorage.setItem('token', loginData.token);
        window.location.href = '/home';
    }
});
