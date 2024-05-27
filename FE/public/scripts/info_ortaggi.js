const ortaggioTableBody = document.querySelector('#ortaggioTable tbody')

function addRow(ortaggio) {
    const tr = document.createElement('tr');
    tr.setAttribute('nome-ortaggio', ortaggio.nome);

    ['nome', 'periodoColtivazione', 'esposizione', 'tempiMaturazione', 'tipoTerreno', 'distanzaPiantagione', 'profonditaSemina', 'temperaturaMin', 'temperaturaMax', 'note'].forEach(field => {
        const td = document.createElement('td');
        td.textContent = ortaggio?.[field]
        tr.appendChild(td);
    })
    ortaggioTableBody.appendChild(tr)
}

function showTable() {

    let child = ortaggioTableBody.lastElementChild
    while (child) {
        console.log(child)
        ortaggioTableBody.removeChild(child)
        // child = userTableBody.lastElementChild
    }

    fetch('http://localhost:8000/ortaggi', {
        headers: {
            'Content-Type': 'application/json'
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