fetch('http://localhost:8000/ortaggi', {
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    var selectOrtaggi = document.getElementById("sceltaOrtaggi");

    data.forEach(function(oggetto) {
        var option = document.createElement("option");
        option.value = oggetto.nome;
        option.text = oggetto.nome;
        selectOrtaggi.appendChild(option);
    });
})

const luogoSistemazione = ["All'aperto", "Al chiuso"]
var selectSistemazione = document.getElementById("sistemazione");

luogoSistemazione.forEach(function(oggetto) {
    var option = document.createElement("option");
    option.value = oggetto;
    option.text = oggetto;
    selectSistemazione.appendChild(option);
});

function setError(el, message) {
    el.style.border = '1px solid red';
    const span = document.createElement('span');
    span.classList.add('input-error');
    span.textContent = message;
    span.style.color = 'red';
    el.parentNode.insertBefore(span, el.nextSibling);
}

const ortoForm = document.querySelector('#ortoForm');

ortoForm.addEventListener('submit', async (e) => {
    const userString = localStorage.getItem('user');
    const userStorage = JSON.parse(userString);
    e.preventDefault();

    const nome = e.target[0].value;
    const citta = e.target[1].value;
    const tipoPiantagione = e.target[2].value;
    const numeroPiante = +e.target[3].value;
    const dataSemina = e.target[4].value;
    const sistemazione = e.target[5].value;
    userId = userStorage['id']
    

    const url = 'http://localhost:8000/orto';

    const ortoResponse = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            nome,
            citta,
            tipoPiantagione,
            numeroPiante,
            dataSemina,
            sistemazione,
            userId,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const ortoData = await ortoResponse.json();
    console.log(ortoData);

});
