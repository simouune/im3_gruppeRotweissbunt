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
    .then(result => {
        console.log(result); // Hier kannst du die Antwort des PHP-Skripts verarbeiten
        updateChartWithData(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });

});


const ctx = document.getElementById('myChart');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Verwende die Werte aus dem wochentage Array
      datasets: [{
        label: 'Auslastungsrate',
        data: [], // Hier kannst du die tatsächlichen Daten einsetzen
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


const apiURL = 'https://projekt.rotweissbunt.com/unload.php';



function updateChartWithData(result) {
    const wochentage = [];
    const auslastungInProzent = [];
    let label = "";

    const werteArray = Object.values(result);
    
    werteArray.forEach(item => {
        auslastungInProzent.push(item.auslastungsrate);
        wochentage.push(item.weekday);
        label = item.address;
    });

    chart.data.datasets[0].label = label;
    chart.data.datasets[0].data = auslastungInProzent;
    chart.data.labels = wochentage;

    chart.update();
}

fetch(apiURL)
    .then(response => response.json())
    .then(updateChartWithData)
    .catch(error => {
        console.error('Error:', error);
    });

