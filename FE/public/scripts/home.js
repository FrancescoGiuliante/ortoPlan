const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
const userId =userStorage['id']

const span = document.querySelector('#user');
span.textContent = userStorage['firstName'];


