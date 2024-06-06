const todayDate = new Date()
const today = todayDate.toISOString().slice(0, 10);
const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";

fetch('http://localhost:8000/mypianificazioni', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ userId: idUtente, data: today })
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore nella risposta');
        }
        return response.json();
    })
    .then(data => {
        const pianificazioniToday = data.pianificazioni

        if (pianificazioniToday.length == 0) {
            console.log("Non c'è nessuna pianificazione per oggi");
        } else {

            pianificazioniToday.forEach(pianificazione => {
                if (!pianificazione.completata) {
                    const pianificazioneId = pianificazione.id
                    const attivita = pianificazione.attivita
                    const myOrtoId = +pianificazione.myOrtoId
                    console.log('non completate');
                    fetch(`http://localhost:8000/orto/${myOrtoId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                        .then(res => {
                            return res.json()
                        }).then(data => {
                            const tipo = data.tipoPiantagione
                            const nomeOrto = data.nome
                            const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${data.citta}&appid=${apiKey}&units=metric&lang=it`;
                            fetch(weatherUrl)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Failed to fetch weather data');
                                    }
                                    return response.json();
                                })
                                .then(weatherData => {
                                    const weatherId = weatherData.weather[0].id;
                                    console.log(weatherId);
                                    if (weatherId >= 200 && weatherId < 600) {

                                        fetch('http://localhost:8000/ortaggi', {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                const ortaggio = data.find(item => item.nome === tipo);

                                                if (ortaggio) {
                                                    const frequenzaInnaffiatura = ortaggio.frequenzaInnaffiatura;
                                                    todayDate.setDate(todayDate.getDate() + frequenzaInnaffiatura);
                                                    const newDate = todayDate.toISOString().slice(0, 10);
                                                    const messaggio = `La pianificazione di oggi per l'orto ${nomeOrto} è stata spostata il ${newDate} per causa pioggia`

                                                    fetch(`http://localhost:8000/updatePianificazione/${pianificazioneId}`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            Authorization: 'Bearer ' + localStorage.getItem('token')
                                                        },
                                                        body: JSON.stringify({ data: newDate, attivita, myOrtoId })
                                                    })
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            fetch(`http://localhost:8000/notifica/`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    Authorization: 'Bearer ' + localStorage.getItem('token')
                                                                },
                                                                body: JSON.stringify({
                                                                    pianificazioneId: +data.id,
                                                                    messaggio: messaggio,
                                                                    myOrtoId: +data.myOrtoId,
                                                                    userId: +idUtente
                                                                })
                                                            })
                                                                .then(res => res.json())
                                                                .then(data => {
                                                                    console.log(data);
                                                                    caricaNotifiche()
                                                                })
                                                        })
                                                }
                                            });
                                    }
                                });
                        })
                }
            });
        }
    })
