
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
            const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";


            data.forEach(orto => {
                const newCard = template.cloneNode(true);
                newCard.style.display = 'block';
                newCard.querySelector('[name="nome"]').innerText = orto.nome;
                newCard.querySelector('[name="tipo"]').innerText = orto.tipoPiantagione;
                newCard.querySelector('[name="numero"]').innerText = orto.numeroPiante;
                
                const buttonOrto = newCard.querySelector('[name="buttonOrto"]');
                buttonOrto.onclick = function () {
                    window.location.href = `/orto?id=${orto.id}`;
                };
                
                const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${orto.citta}&appid=${apiKey}&units=metric&lang=it`;
                const imgElement = newCard.querySelector('[name="img"]');
                const imgUrl = ortaggiConFoto[orto.tipoPiantagione];
                if (imgElement && imgUrl) {
                    imgElement.src = imgUrl;
                }

                fetch(weatherUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch weather data');
                        }
                        return response.json();
                    })
                    .then(weatherData => {
                        const meteoElement = newCard.querySelector('[name="meteo"]');
                        const temp = weatherData.main.temp;
                        const weather = weatherData.weather[0].description;
                        meteoElement.textContent = `Meteo attuale: ${weather} - ${temp}°C - ${orto.citta}`;
                    });

                fetch('http://localhost:8000/mypianificazioniNext', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ id: orto.id })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Errore durante il recupero dei dati');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const eventoElement = newCard.querySelector('[name="evento"]');
                        eventoElement.textContent = (data.attivita && data.data) ? `Prossima attività: ${data.attivita} - ${data.data}` : data.message;


                    })
                container.appendChild(newCard);
            });
            if (data.length % 2 !== 0) {
                const lastCard = container.lastChild;
                lastCard.classList.add('md:col-span-2', 'md:justify-center');
            }

        })
}

document.addEventListener('DOMContentLoaded', fetchAndRenderOrti);