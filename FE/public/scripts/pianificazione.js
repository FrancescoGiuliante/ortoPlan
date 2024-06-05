
const urlParams = new URLSearchParams(window.location.search);
const id = +urlParams.get('id');

const tableBody = document.querySelector('#pianificazioneTable tbody');

function displayPianificazione() {
    fetch(`http://localhost:8000/pianificazione/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(res => res.json())
        .then(data => {
            const tableBody = document.querySelector('#pianificazioneTable tbody');
            tableBody.innerHTML =''
            const row = document.createElement('tr');
            const h1Element = document.querySelector('[name="date"]');

            const dataSpan = document.getElementById('dataSpan');
            dataSpan.textContent = data.data;
            myOrtoId = data.myOrto.id
            
            row.innerHTML = `
        <td>${data.myOrto.nome}</td>
        <td>${data.attivita}</td>
        <td><input type="checkbox" class="toggle hover:bg-[#90ee90] bg-[#6ac230]" ${data.completata ? 'checked' : ''}></td>
        <button onclick="openModal(${id})" class="bg-[#90ee90] btn mt-2 hover:bg-white hover:border-2 hover:border-[#90ee90]" >Modifica</button>
    `;
            const toggleCheckbox = row.querySelector('.toggle');
            toggleCheckbox.addEventListener('change', async () => {
                const isChecked = toggleCheckbox.checked;

                const response = await fetch(`http://localhost:8000/pianificazione/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        completata: isChecked
                    })
                });

                if (!response.ok) {
                    throw new Error('Errore durante l\'aggiornamento dello stato di completata');
                } 
                const data = await response.json();
                
                if (data.nuovaAttivita && data.nuovaDataFormattata) {
                    fetch('http://localhost:8000/pianificazione', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            myOrtoId: myOrtoId,
                            data: data.nuovaDataFormattata,
                            attivita: data.nuovaAttivita,
                            completata: false
                        })
                    })
                    .then(res => res.json())
                    .then(nuovaPianificazione => {
                        console.log('Nuova pianificazione creata:', nuovaPianificazione);
                    })
                }
            });

            tableBody.appendChild(row);
        })

}

displayPianificazione()

function openModal(id) {
    fetch(`http://localhost:8000/pianificazione/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(res => res.json())
        .then(data => {
            const selectOrto = document.getElementById('nomeOrto');
            selectOrto.value = data.myOrto.id;

            document.getElementById('attivitaInput').value = data.attivita;
            document.getElementById('selectedDateInput').value = data.data;
            const modal = document.getElementById('myModal');
            modal.showModal();
        })
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.close();
}