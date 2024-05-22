console.log(userId,'ciao');

fetch('http://localhost:8000/users/' + userId)
    .then(res => res.json())
    .then(user => {
        console.log(user);
        const span = document.querySelector('#user');
        span.textContent = user.firstName;
    })