
const ortaggiConFoto = {
    'Carote': '/assets/carota_png.png',
    'Cavolfiore': '/assets/cavolo.png',
    'Cipolle': '/assets/cipolla.png',
    'Fagioli': '/assets/fagiolo.png',
    'Lattuga': '/assets/lattuga.png',
    'Peperoni': '/assets/paperone.png',
    'Piselli': '/assets/piselli.png',
    'Pomodori': '/assets/pomodoro_png.png',
    'Spinaci': '/assets/spinaci.png',
    'Zucchine': '/assets/zucchina.png',
};
function fetchAndRenderOrti() {
    const userString = localStorage.getItem('user');
    const userStorage = JSON.parse(userString);
    const userId = userStorage['id'];

    fetch('http://localhost:8000/myOrto', {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const container = document.getElementById('cards-container');
        const template = document.getElementById('card-template');
        container.innerHTML = '';

        data.forEach(orto => {
            const newCard = template.cloneNode(true);
            newCard.style.display = 'block'; // Rendi visibile la card clonata
            newCard.querySelector('[name="nome"]').innerText = orto.nome;
            newCard.querySelector('[name="tipo"]').innerText = orto.tipoPiantagione;
            newCard.querySelector('[name="numero"]').innerText = orto.numeroPiante;
            
            const imgElement = newCard.querySelector('[name="img"]');
            const imgUrl = ortaggiConFoto[orto.tipoPiantagione];
            if (imgElement && imgUrl) {
                imgElement.src = imgUrl;
            }

            container.appendChild(newCard);
        });
        if (data.length % 2 !== 0) {
            const lastCard = container.lastChild;
            lastCard.classList.add('md:col-span-2', 'md:justify-center');
        }
    })
}

document.addEventListener('DOMContentLoaded', fetchAndRenderOrti);