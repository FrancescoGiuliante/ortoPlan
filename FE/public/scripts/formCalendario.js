const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
userId = userStorage['id']

// funzione per converitire la data nel giusto formato
function convertDateFormat(dateString) {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    // Nota: i mesi in JavaScript sono indicizzati da 0 a 11, quindi aggiungi 1 al mese
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    // Formatta la data nel formato "YYYY-MM-DD"
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
}

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
        

const pianificazioneForm = document.querySelector('#pianificazioneForm');

pianificazioneForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const myOrtoId = +e.target[0].value;
    const attivita = e.target[1].value;
    const dataNotFormatted = e.target[2].value;
    data = convertDateFormat(dataNotFormatted)
    const completata = false

    console.log(myOrtoId, attivita, data, completata);
    const url = 'http://localhost:8000/pianificazione';
    
    const pianificazioneResponse = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            myOrtoId,
            attivita,
            data,
            completata,
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') 
        }
    });
})
        