document.getElementById("userForm").addEventListener("submit", function(event) {
    // Previene il comportamento predefinito del modulo
    event.preventDefault();
    
    // Mostra un prompt di conferma e ottiene la risposta
    const conferma = confirm("Sei sicuro di voler salvare le modifiche?");
    
    // Se l'utente conferma, procedi con l'invio del modulo
    if (conferma) {
      this.submit(); // Invia il modulo
    } else {
      // Altrimenti, non fare nulla o gestisci l'annullamento
      console.log("Modifica annullata.");
    }
  });