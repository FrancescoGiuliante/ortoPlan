
const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";
const ortoTableBody = document.querySelector('#ortoTable tbody')
const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
userId = userStorage['id']
immaginiMeteo = ["/assets/sole.png", "/assets/nuovole.png", "/assets/pioggia.png", "/assets/notte.png"]

const urlParams = new URLSearchParams(window.location.search);
const id = +urlParams.get('id');

function addRow(orto) {
    ortoTableBody.innerHTML = '';
    const tr = document.createElement('tr');
    tr.setAttribute('nome-orto', orto.nome);

    ['nome', 'tipoPiantagione', 'citta', 'numeroPiante', 'dataSemina', 'sistemazione'].forEach(field => {
        const td = document.createElement('td');
        td.textContent = orto?.[field]
        tr.appendChild(td);
    })
    ortoTableBody.appendChild(tr)
}

function showTable() {

    fetch(`http://localhost:8000/orto/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(res => {
            return res.json()
        }).then(data => {
            console.log(data);
            addRow(data)
            const tipo = data.tipoPiantagione
            const dataSemina = data.dataSemina


            const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${data.citta}&appid=${apiKey}&units=metric&lang=it`;
            fetch(weatherUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data');
                    }
                    return response.json();
                })
                .then(weatherData => {
                    const titoloElement = document.querySelector('#titolo')
                    titoloElement.textContent = `Orto: ${data.nome}`;
                    const luogoElement = document.querySelector('#luogo')
                    luogoElement.textContent = `${data.citta}`;
                    const meteoElement = document.querySelector('#meteoAttuale')
                    const temp = weatherData.main.temp;
                    const weather = weatherData.weather[0].description;
                    meteoElement.textContent = `Meteo attuale: ${weather} - ${temp}°C`;
                    aggiornaImmagineMeteo(weatherData)

                });

            const weatherForecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${data.citta}&appid=${apiKey}&units=metric&lang=it`;
            fetch(weatherForecastUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data');
                    }
                    return response.json();
                })
                .then(weatherData => {
                    const meteoElementForecast = document.querySelector('#meteoFuturo')
                    meteoElementForecast.innerHTML = '';
                    getForecastNextDay(weatherData).forEach(forecast => {
                        const li = document.createElement('li')
                        const temp = forecast.main.temp;
                        const weather = forecast.weather[0].description;
                        const dateObj = new Date(forecast.dt_txt);
                        const soloOra = dateObj.toTimeString().split(' ')[0].slice(0, 5);
                        li.textContent = `${soloOra} - ${weather} - ${temp}°C`;
                        meteoElementForecast.appendChild(li);

                    })
                });

            fetch('http://localhost:8000/ortaggi', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    const ortaggio = data.find(item => item.nome === tipo);

                    if (ortaggio) {
                        const dataFormattata = new Date(dataSemina);

                        const tempiMaturazione = ortaggio.tempiMaturazione;
                        const dataAttuale = new Date();
                        const giorniMancantiMaturazione = Math.max(0, tempiMaturazione - Math.floor((dataAttuale - dataFormattata) / (1000 * 60 * 60 * 24)));

                        const frequenzaInnaffiatura = ortaggio.frequenzaInnaffiatura;
                        const giorniMancantiInnaffiatura = Math.ceil(giorniMancantiMaturazione / frequenzaInnaffiatura);
                        const giorniTrascorsi = Math.floor((dataAttuale - dataFormattata) / (1000 * 60 * 60 * 24));
                        const tipologiaElement = document.querySelector('#tipologia')
                        tipologiaElement.textContent = `${tipo}`;

                        const immagineFase = document.getElementById('imgOrto');
                        let faseCrescita = "";
                        if (giorniTrascorsi <= tempiMaturazione / 3) {
                            faseCrescita = "Inizio";
                            immagineFase.src = "/assets/inizio.png";
                        } else if (giorniTrascorsi <= (tempiMaturazione / 3) * 2) {
                            faseCrescita = "Metà";
                            immagineFase.src = "/assets/meta.png";
                        } else {
                            faseCrescita = "Fine";
                            immagineFase.src = "/assets/fine.png";
                        }

                        const situazioneAttuale = document.querySelector('#situazioneAttuale')
                        situazioneAttuale.textContent = `Fase crescita: ${faseCrescita}`

                        const ulStima = document.getElementById('stima');
                        ulStima.innerHTML = '';
                        const liGiorniTrascorsi = document.createElement('li');
                        const liGiorniMancanti = document.createElement('li');
                        const liGiorniMancantiInnaffiatura = document.createElement('li');

                        liGiorniTrascorsi.textContent = `Giorni trascorsi: ${giorniTrascorsi}`;
                        liGiorniMancanti.textContent = `Stima giorni mancanti: ${giorniMancantiMaturazione}`;
                        liGiorniMancantiInnaffiatura.textContent = `Stima giorni innaffiatura: ${giorniMancantiInnaffiatura}`;

                        ulStima.appendChild(liGiorniTrascorsi);
                        ulStima.appendChild(liGiorniMancanti);
                        ulStima.appendChild(liGiorniMancantiInnaffiatura);

                    } else {
                        console.log(`Ortaggio ${tipo} non trovato.`);
                    }
                });
        })

}

showTable()

function aggiornaImmagineMeteo(data) {
    const idImmagine = document.getElementById('imgMeteo');
    const weatherId = data.weather[0].id;
    const currentHour = new Date().getHours();

    let imgSrc = '/assets/sguardo.png';

    // Logica per l'immagine basata sul meteo
    if (currentHour >= 21 || currentHour < 6) {
        imgSrc = "/assets/notte.png";
    } else {
        if (weatherId >= 200 && weatherId < 600) {
            imgSrc = "/assets/pioggia.png";
        } else if (weatherId === 800) {
            imgSrc = "/assets/sole.png";
        } else if (weatherId > 800) {
            imgSrc = "/assets/nuvole.png";
        }
    }
    idImmagine.src = imgSrc;
}

function getForecastNextDay(weatherData) {
    const listForecast = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDay = currentDate.toISOString().split('T')[0];

    const forecasts = weatherData.list.filter(item => {
        const forecastDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return forecastDate === nextDay;
    });

    const hours = [6, 15, 21];
    hours.forEach(hour => {
        const forecast = forecasts.find(item => {
            const forecastHour = new Date(item.dt * 1000).getUTCHours();
            return forecastHour === hour;
        });
        if (forecast) {
            listForecast.push(forecast);
        }
    });

    return listForecast;
}
