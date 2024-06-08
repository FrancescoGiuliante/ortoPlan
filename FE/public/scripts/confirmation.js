document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const conferma = confirm("Sei sicuro di voler salvare le modifiche?");
    if (conferma) {
      this.submit();
    } else {
      console.log("Modifica annullata.");
    }
  });