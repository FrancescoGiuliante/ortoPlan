const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
userId = userStorage['id']


fetch('http://localhost:8000/myOrto', {
    method: 'POST',
    body: JSON.stringify({
        userId,
    }),
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
})
    .then(res => {
        return res.json()
    }).then(data => {
        var selectOrto = document.getElementById("nomeOrto");
        data.forEach(function (oggetto) {
            var option = document.createElement("option");
            option.value = oggetto.id;
            option.text = `${oggetto.nome} - Data Semina: ${oggetto.dataSemina}`;
            selectOrto.appendChild(option);
        });
    })

const pianificazioneForm = document.getElementById('pianificazioneForm');



pianificazioneForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = document.getElementById('selectedDateInput').value;
    const attivita = document.getElementById('attivitaInput').value;
    const myOrtoId = document.getElementById('nomeOrto').value;

    const conferma = confirm("Sei sicuro di voler aggiornare questa pianificazione?");
    if (conferma) {
        const response = await fetch(`http://localhost:8000/updatePianificazione/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ data, attivita, myOrtoId })
        });

        // Gestisci la risposta della richiesta
        if (!response.ok) {
            throw new Error('Errore durante l\'aggiornamento della pianificazione');
        } else {
            // Aggiorna l'interfaccia utente
            displayPianificazione();
            closeModal();
        }
    }
});