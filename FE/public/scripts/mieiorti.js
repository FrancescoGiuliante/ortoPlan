const ortoTableBody = document.querySelector('#ortoTable tbody')
const userString = localStorage.getItem('user');
const userStorage = JSON.parse(userString);
userId = userStorage['id']

function addRow(orto) {
    const tr = document.createElement('tr');
    tr.setAttribute('nome-orto', orto.nome);

    ['nome', 'tipoPiantagione'].forEach(field => {
        const td = document.createElement('td');
        td.textContent = orto?.[field]
        tr.appendChild(td);
    })
    ortoTableBody.appendChild(tr)
}

function showTable() {
    
    while (ortoTableBody.firstChild) {
        ortoTableBody.removeChild(ortoTableBody.firstChild);
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
            users = data;
            data.forEach(addRow);
        })
}

showTable()