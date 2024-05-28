fetch('http://localhost:8000/ortaggi', {
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    var selectOrtaggi = document.getElementById("sceltaOrtaggi");

    data.forEach(function(oggetto) {
        var option = document.createElement("option");
        option.value = oggetto.nome;
        option.text = oggetto.nome;
        selectOrtaggi.appendChild(option);
    });
})

const luogoSistemazione = ["All'aperto", "Al chiuso"]
var selectSistemazione = document.getElementById("sistemazione");

luogoSistemazione.forEach(function(oggetto) {
    var option = document.createElement("option");
    option.value = oggetto;
    option.text = oggetto;
    selectSistemazione.appendChild(option);
});