const cardContainer = document.querySelector('.card-container');
const cardTemplate = document.getElementById('cardTemplate').content;

const immaginiOrtaggi = [
    '/assets/carota_png.png',
    '/assets/cavolo.png',
    '/assets/cipolla.png',
    '/assets/fagiolo.png',
    '/assets/lattuga.png',
    '/assets/paperone.png',
    '/assets/piselli.png',
    '/assets/pomodoro_png.png',
    '/assets/spinaci.png',
    '/assets/zucchina.png',
];

function addCard(ortaggio, index) {
    const card = cardTemplate.cloneNode(true);

    card.querySelector('.card-title').textContent = ortaggio.nome;
    const values = card.querySelectorAll('.value');
    values[0].textContent = ortaggio.periodoColtivazione;
    values[1].textContent = ortaggio.esposizione;
    values[2].textContent = ortaggio.tempiMaturazione;
    values[3].textContent = ortaggio.tipoTerreno;
    values[4].textContent = ortaggio.distanzaPiantagione;
    values[5].textContent = ortaggio.profonditaSemina;
    values[6].textContent = ortaggio.temperaturaMin;
    values[7].textContent = ortaggio.temperaturaMax;
    values[8].textContent = ortaggio.frequenzaInnaffiatura;
    values[9].textContent = ortaggio.note;

    // Imposta l'immagine
    const img = card.querySelector('figure img');
    img.src = immaginiOrtaggi[index % immaginiOrtaggi.length];
    img.alt = ortaggio.nome;

    cardContainer.appendChild(card);
}

function showTable() {
    // Svuota il contenitore delle card
    // while (cardContainer.firstChild) {
    //     cardContainer.removeChild(cardContainer.firstChild);
    // }

    fetch('http://localhost:8000/ortaggi', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        data.forEach((ortaggio, index) => addCard(ortaggio, index));
    });
}
showTable();

document.addEventListener("DOMContentLoaded", function() {
    
    var user = localStorage.getItem("user");
    var token = localStorage.getItem("token");

    if (user && token) {
        document.getElementById("navbarLoggato").style.display = "block";
        document.getElementById("navbarNonLoggato").style.display = "none";
    } else {
        document.getElementById("navbarLoggato").style.display = "none";
        document.getElementById("navbarNonLoggato").style.display = "block";
    }
});