todayDate.setDate(todayDate.getDate() + 1);
const tomorrow = todayDate.toISOString().slice(0, 10);

fetch('http://localhost:8000/mypianificazioni', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ userId: userId, data: tomorrow })
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore nella risposta');
        }
        return response.json();
    })
    .then(data => {
        const pianificazioniDomani = data.pianificazioni

        if (pianificazioniDomani.length == 0) {
            console.log("Non c'è nessuna pianificazione per domani");
        } else {
            pianificazioniDomani.forEach(pianificazione => {
                if (!pianificazione.completata) {
                    const pianificazioneId = pianificazione.id
                    const attivita = pianificazione.attivita
                    const myOrtoId = +pianificazione.myOrtoId

                    fetch(`http://localhost:8000/orto/${myOrtoId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                        .then(res => {
                            return res.json()
                        })
                        .then(data => {
                            const nomeOrto = data.nome
                            const daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
                            const dayOfWeekTomorrow = daysOfWeek[todayDate.getDay()];
                            const dayOfMonthTomorrow = todayDate.getDate();
                            const messaggio = `Ricordati che domani ${dayOfWeekTomorrow} ${dayOfMonthTomorrow} hai programmato l'attività ${attivita} per l'orto ${nomeOrto} `;

                            fetch(`http://localhost:8000/notifica/`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + localStorage.getItem('token')
                                },
                                body: JSON.stringify({
                                    pianificazioneId: +pianificazioneId,
                                    messaggio: messaggio,
                                    myOrtoId: myOrtoId,
                                    userId: +userId
                                })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    console.log(data);
                                })

                            const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";
                            const weatherForecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${data.citta}&appid=${apiKey}&units=metric&lang=it`;

                            fetch(weatherForecastUrl)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Failed to fetch weather data');
                                    }
                                    return response.json();
                                })
                                .then(weatherData => {
                                    const tomorrowWeatherList = weatherData.list.filter(item => item.dt_txt.startsWith(tomorrow));
                                    let previstaPioggia = false
                                    tomorrowWeatherList.forEach(forecast => {
                                        if (forecast.weather[0].id >= 200 && forecast.weather[0].id < 600) {
                                            previstaPioggia = true
                                        }
                                    })
                                    if (previstaPioggia) {
                                        const messaggioForecast = `Hey occhio che domani ${dayOfWeekTomorrow} ${dayOfMonthTomorrow} è prevista pioggia a ${data.citta} `;
                                        fetch(`http://localhost:8000/notifica/`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: 'Bearer ' + localStorage.getItem('token')
                                            },
                                            body: JSON.stringify({
                                                pianificazioneId: +pianificazioneId,
                                                messaggio: messaggioForecast,
                                                myOrtoId: myOrtoId,
                                                userId: +userId
                                            })
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                console.log(data);
                                            })
                                    }
                                })

                        })
                }
            });
        }
    })