fetch('http://localhost:8000/ortaggi', {
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(res => res.json())
    .then(data => {
        var selectOrtaggi = document.getElementById("sceltaOrtaggi");

        data.forEach(function (oggetto) {
            var option = document.createElement("option");
            option.value = oggetto.nome;
            option.text = oggetto.nome;
            selectOrtaggi.appendChild(option);
        });
    })

const luogoSistemazione = ["All'aperto", "Al chiuso"]
var selectSistemazione = document.getElementById("sistemazione");

luogoSistemazione.forEach(function (oggetto) {
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

    try {
        await getCity(citta);
    } catch (error) {
        setError(e.target[1], 'Citta non trovata');
        return;
    }


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

    if (ortoResponse.ok) {
        const ortoData = await ortoResponse.json();
        console.log(ortoData);
        showTable();
        closeModal();
    } else {
        const errorData = await ortoResponse.json();
        setError(e.target, `Errore: ${errorData.message}`);
    }
});


async function getCity() {
    const city = document.getElementById('citta').value;
    const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Città non trovata');
    }
    const data = await response.json();
}

function closeModal() {
    const myModal = document.getElementById('myModal');
    myModal.close(); 
}