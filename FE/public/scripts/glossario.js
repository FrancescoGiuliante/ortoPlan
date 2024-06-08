const parolaTableBody = document.querySelector('#wordTable tbody')

function addRow(vocabolo) {
    const tr = document.createElement('tr');
    tr.setAttribute('nome-parola', vocabolo.parola);

    ['parola', 'definizione'].forEach(field => {
        const td = document.createElement('td');
        td.textContent = vocabolo?.[field]
        tr.appendChild(td);
    })
    parolaTableBody.appendChild(tr)
}

function showTable() {

    let child = parolaTableBody.lastElementChild
    while (child) {
        console.log(child)
        parolaTableBody.removeChild(child)
    }

    fetch('http://localhost:8000/glossario', {
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


document.addEventListener("DOMContentLoaded", function() {
    
    var user = localStorage.getItem("user");
    var token = localStorage.getItem("token");

    if (user && token) {
        document.getElementById("navbarLoggato").style.display = "block";
        document.getElementById("navbarNonLoggato").style.display = "none";
    } else {
        document.getElementById("navbarLoggato").style.display = "none";
        document.getElementById("navbarNonLoggato").style.display = "block";
    }
});