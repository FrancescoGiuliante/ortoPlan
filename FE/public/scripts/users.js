const userTableBody = document.querySelector('#userTable tbody')
let userMod;
let users = [];

function openCreateUserModal() {
    userMod = undefined;
    userModal.showModal();
    userForm.reset();
}

function setError(el, messages) {
    el.style.border = '1px solid red';
    messages.forEach(message => {
        const span = document.createElement('span');
        span.classList.add('input-error');
        span.textContent = message;
        span.style.color = 'red';
        el.parentNode.insertBefore(span, el.nextSibling);
    })

    // errore = true
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function addUserRow(user) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-user-id', user.id);

    ['id', 'firstName', 'lastName', 'email', 'age'].forEach(field => {
        const td = document.createElement('td');
        td.textContent = user?.[field]
        tr.appendChild(td);
    })
    userTableBody.appendChild(tr)

    const td = document.createElement('td');
    const buttonModifica = document.createElement('button');
    buttonModifica.classList.add('btn', 'btn-info');
    buttonModifica.textContent = 'Modifica';
    td.appendChild(buttonModifica);
    tr.appendChild(td);

    buttonModifica.onclick = () => {
        userMod = users.find(u => u.id === user.id);
        console.log(userMod);
        userModal.showModal();
        document.querySelector('input[name=firstName]').value = userMod.firstName;
        document.querySelector('input[name=lastName]').value = userMod.lastName;
        document.querySelector('input[name=email]').value = userMod.email;
        // document.querySelector('input[name=datanascita]').value = userMod.datanascita;
    }

    const button = document.createElement('button');
    button.textContent = 'Elimina';
    button.classList.add('btn', 'btn-error', 'btn-circle');
    button.dataset.userId = user.id;
    const tdButton = document.createElement('td');
    tdButton.appendChild(button);
    tr.appendChild(tdButton);
    button.addEventListener('click', function () {
        var conferma = window.confirm("Sei sicuro di voler eliminare questo utente?");
        if (conferma) {
            const userId = this.dataset.userId;
            deleteUser(userId, tr);
        }
    });
    function deleteUser(userId, rowToRemove) {
        fetch(`http://localhost:8000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(user => {
                if (user.message) {
                    alert(user.message);

                } else {
                    userTableBody.removeChild(rowToRemove);
                    alert('Utente eliminato correttamente')
                }
            })
    }
}

// fetch per riempire la tabella utenti
function showTable() {

    let child = userTableBody.lastElementChild
    while (child) {
        console.log(child)
        userTableBody.removeChild(child)
        child = userTableBody.lastElementChild
    }

    fetch('http://localhost:8000/users', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
        .then(res => {
            return res.json()
        }).then(data => {
            users = data;
            data.forEach(addUserRow);
        })
}

showTable()




const userForm = document.querySelector('#userForm');
const DBReset = document.querySelector('#DBReset');
const userModal = document.querySelector('#userModal');

var Password = document.getElementsByName("password")[0];
var ConvalidaPassword = document.getElementsByName("ConvalidaPassword")[0];
var Email = document.getElementsByName("email")[0];
var errore = false

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelectorAll('.input-error').forEach((element) => {
        element.remove();
    })
    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;
    const convalidaPassword = e.target[4].value;
    const dataNascita = e.target[5].value;


    // if (!password) {
    //     setError({ el: Password, message: 'Campo richiesto' });
    // }

    // if (password !== convalidaPassword) {
    //     errore = true
    //     alert("Le Password non corrispondono");
    // }

    // if (firstName.length < 5 || lastName.length < 5) {
    //     errore = true
    //     alert("il campo nome e cognome devono avere almeno 5 caratteri");
    // }

    // if (!email) {
    //     setError({ el: Email, message: 'Campo richiesto' });
    // } else {
    //     if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
    //         setError({ el: Email, message: 'Email non valida' });

    //     } else {
    //         Email.style.border = '';
    //     }
    // }

    const age = getAge(dataNascita);
    // if (age < 18) {
    //     errore = true
    //     alert("Età minima 18 anni");
    // }


    const validation = validate({
        firstName,
        lastName,
        age,
        email,
        password,
        convalidaPassword
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
        convalidaPassword: {
            length: { minimum: 5 },
            equality: {
                attribute: "password",
                message: "Password non corrisponde!"
            }
        },
        age: {
            presence: { allowEmpty: false },
            numericality: {
                onlyInteger: true,
                greaterThan: 18,
            }
        },
    })

    if (validation) {
        Object.keys(validation).forEach(key => {
            if (key == "age") {
                const el = document.querySelector(`input[name=dataNascita]`)
                console.log(el)
                console.log(validation[key])
                setError(el, validation[key])
            } else {
                const el = document.querySelector(`input[name=${key}]`)
                console.log(el)
                console.log(validation[key])
                setError(el, validation[key])
            }
            // const el = document.querySelector(`input[name=${key}]`)

        })
        return
    } else {
        const url = userMod ? 'http://localhost:8000/users/' + userMod.id : 'http://localhost:8000/users';
        fetch(url, {
            method: userMod ? 'PUT' : 'POST',
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                age
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
                }
                if (userMod) {
                    let userIndex = users.findIndex(user => user.id === data.id);
                    if (userIndex !== -1) {
                        users.splice(userIndex, 1, data)
                    }
                    const userRow = document.querySelector(
                        `#userTable tr[data-user-id="${userMod.id}"]`
                    );
                    userRow.children[1].textContent = data.firstName;
                    userRow.children[2].textContent = data.lastName;
                    userRow.children[3].textContent = data.email;
                    // userRow.children[4].textContent = data.datanascita;
                } else {
                    addUserRow(data);
                    users.push(data);
                }
                userModal.close();
            }
            )
    }
}
)


DBReset.addEventListener('click', function () {
    // console.log('button cliccato!');
    var conferma = window.confirm("Sei sicuro di voler proseguire?");

    if (conferma) {
        fetch('http://localhost:8000/usersDeleteAll/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                showTable()
                alert(data.message);
            })



    } else {
        alert('Hai deciso di non proseguire');
    }
});