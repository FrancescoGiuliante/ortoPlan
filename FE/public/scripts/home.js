const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
const userId = userStorage['id']

const span = document.querySelector('#user');
span.textContent = userStorage['firstName'];
const oggi = new Date(today)


fetch(`http://localhost:8000/mypianificazioniAll/`, {
    method: 'POST',
    body: JSON.stringify({
        userId
    }),
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
})
    .then(res => res.json())
    .then(data => {
        let pianificazioniCompletate = 0
        let pianificazioniNonCompletate = 0
        let pianificazioniProgrammate = 0
        const prossimaPianificazioneList = document.getElementById('prossimaPianificazione');
        prossimaPianificazioneList.innerHTML = '';

        let prossimePianificazioni = [];

        data.pianificazioni.forEach(element => {
            const dataPianificazione = new Date(element['data'])
            if (element['completata'] == true) {
                pianificazioniCompletate++
            } else {
                if (dataPianificazione < oggi) {
                    pianificazioniNonCompletate++
                } else {
                    pianificazioniProgrammate++
                    console.log(element['data']);
                    while (prossimePianificazioni.length === 0) {
                        prossimePianificazioni = data.pianificazioni.filter(element => {
                            const dataPianificazione = new Date(element['data']);
                            return dataPianificazione.toDateString() === oggi.toDateString();
                        });

                        if (prossimePianificazioni.length === 0) {
                            oggi.setDate(oggi.getDate() + 1);
                        }
                    }

                }
            }
        });
        const prossimePianificazioniTable = document.querySelector('#prossimaPianificazione')
        const dataPianificazione = document.querySelector('#dataPianificazione')
        let dataH2
        prossimePianificazioni.forEach(element => {
            if (element['completata'] == false) {
                dataH2 = element['data']
                const li = document.createElement('li');
                li.textContent = `${element['attivita']} - ${element.myOrto['nome']}`
                prossimePianificazioniTable.appendChild(li)
            }
        });
        dataPianificazione.textContent = ` ${dataH2}`;
        const pianificazioniCompletateElement = document.querySelector('#pianificazioniCompletate')
        pianificazioniCompletateElement.textContent = `Pianificazioni completate:  ${pianificazioniCompletate}`;

        const pianificazioniNonCompletateElement = document.querySelector('#pianificazioniNonCompletate')
        pianificazioniNonCompletateElement.textContent = `Pianificazioni non completate:  ${pianificazioniNonCompletate}`;

        const pianificazioniProgrammateElement = document.querySelector('#pianificazioniProgrammate')
        pianificazioniProgrammateElement.textContent = `Pianificazioni programmate:  ${pianificazioniProgrammate}`;
    })

fetch(`http://localhost:8000/myorto/`, {
    method: 'POST',
    body: JSON.stringify({
        userId
    }),
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
})
    .then(res => res.json())
    .then(data => {
        let ortiNonCompletati = 0;
        let ortiCompletati = 0;
        let piantine = 0
        data.forEach(element => {
            const dataSemina = new Date(element.dataSemina)

            piantine += element.numeroPiante
            fetch('http://localhost:8000/ortaggi', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(dataOrtaggi => {
                    const ortaggioGiusto = dataOrtaggi.find(ortaggio => ortaggio.nome === element.tipoPiantagione);
                    let tempi
                    if (ortaggioGiusto) {
                        tempi = ortaggioGiusto.tempiMaturazione
                        const diffTime = Math.abs(oggi - dataSemina);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays < tempi) {
                            ortiNonCompletati++;

                        } else {
                            ortiCompletati++;
                        }
                    }
                    const ortiNonCompletatiElement = document.querySelector('#ortiNonCompletati')
                    ortiNonCompletatiElement.textContent = `Numero di orti attivi: ${ortiNonCompletati}`;

                    const ortiCompletatiElement = document.querySelector('#ortiCompletati')
                    ortiCompletatiElement.textContent = `Numero di orti completati: ${ortiCompletati}`;

                    const numeroPiantineElement = document.querySelector('#numeroPiantine')
                    numeroPiantineElement.textContent = `Piantine totali coltivate: ${piantine}`;
                })
        });

    })