const apiURL = 'https://projekt.rotweissbunt.com/unload.php';

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Standardformular-Submit-Verhalten

    // Erfassen der Formulardaten
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;
    const address = document.getElementById('address').value;

    // Automatisch die Zeiten setzen
    const startTime = `${startDate}T00:00:00`;
    const endTime = `${endDate}T23:59:59`;

    // Senden der Daten an das PHP-Skript
    fetch(`unload.php?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}&address=${encodeURIComponent(address)}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Hier kannst du die Antwort des PHP-Skripts verarbeiten
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // You can now use startTime and endTime for your form submission logic
});


