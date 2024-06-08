function openNotificaModal() {
    const modal = document.getElementById('notificaModal');
    modal.showModal();
}

const pallino = document.getElementById('pallino');
const notificaTable = document.getElementById('notificaTable')
const notificaTableBody = document.querySelector('#notificaTable tbody');
const divNotifica = document.querySelector('#divNotifica')

function displayNotifiche(data) {
    if (data.length > 0) {
        if (divNotifica) {
            divNotifica.classList.remove('hidden')
            divNotifica.classList.add('flex')
        }

        pallino.classList.remove('hidden');
        notificaTable.classList.remove('hidden');

        data.forEach((notifica, index) => {
            const row = document.createElement('tr');

            const numeroRiga = document.createElement('td');
            numeroRiga.textContent = index + 1;
            row.appendChild(numeroRiga);

            const messaggioRiga = document.createElement('td');
            messaggioRiga.textContent = notifica.messaggio;
            row.appendChild(messaggioRiga);

            const checkBoxRiga = document.createElement('td');
            const buttonLetto = document.createElement('button');

            buttonLetto.classList.add('btn', 'btn-circle', 'bg-cover', 'bg-center', 'hover:border-2', 'hover:border-[#fe3d52]')
            buttonLetto.style.backgroundImage = "url('assets/check2.png')"
            buttonLetto.addEventListener('click', () => {
                fetch(`http://localhost:8000/notifiche/${notifica.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ visualizzata: true })
                }).then(res => {
                    if (res.ok) {
                        row.remove();
                        if (notificaTableBody.childElementCount === 0) {
                            pallino.classList.add('hidden');
                            notificaTable.classList.add('hidden');
                            divNotifica.classList.remove('flex');
                            divNotifica.classList.add('hidden');

                        }
                    }
                });

            });
            checkBoxRiga.appendChild(buttonLetto);
            row.appendChild(checkBoxRiga);

            notificaTableBody.appendChild(row);
        });
    }

}

function caricaNotifiche() {
    fetch(`http://localhost:8000/notifiche/${idUtente}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        },
    })
        .then(res => res.json())
        .then(data => {
            displayNotifiche(data);
            console.log(data);
        });
}

const StringaUtente = localStorage.getItem('user');
const storageUtente = JSON.parse(StringaUtente);
const idUtente = storageUtente['id']
caricaNotifiche()