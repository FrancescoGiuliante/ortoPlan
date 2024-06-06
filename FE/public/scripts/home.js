const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
const userId =userStorage['id']

const span = document.querySelector('#user');
span.textContent = userStorage['firstName'];


// const divNotifica = document.querySelector('#divNotifica');
// console.log(displayDiv);
// if (displayDiv) {
//     divNotifica.style.display = 'flex'

// }