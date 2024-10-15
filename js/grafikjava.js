document.getElementById('dataForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Verhindert das Standardformular-Submit-Verhalten

  // Erfassen der Formulardaten
  const startDate = document.getElementById('start_date').value;
  const endDate = document.getElementById('end_date').value;
  

  // Automatisch die Zeiten setzen
  const startTime = `${startDate}T00:00:00`;
  const endTime = `${endDate}T23:59:59`;

  // Senden der Daten an das PHP-Skript
  fetch(`unloadgraphic.php?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`, {
      method: 'GET'
  })
  .then(response => response.json())
  .then(top5Results => {
      console.log(top5Results); // Hier kannst du die Antwort des PHP-Skripts verarbeiten
      insertDataToChart(top5Results);
  })
  .catch(error => {
      console.error('Error:', error);
  });

});


/* Grafik Top 5 Adressen  ------------------------------------------------------------------------------------------------------*/

const cty = document.getElementById('top5Chart');

const topChart = new Chart(cty, {
    type: 'bar',
    data: {
      labels: [], // Verwende die Werte aus dem wochentage Array
      datasets: [{
        label:'',
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




const AnotherapiURL = 'https://projekt.rotweissbunt.com/unload.php';

function insertDataToChart(top5Results) {
    const address = [];
    const auslastungInProzent = [];
    let label = "Die 5 beliebtesten Adressen";

    const werteArray = Object.values(top5Results);
    
    werteArray.forEach(item => {
        auslastungInProzent.push(item.auslastungsrate);
        address.push(item.address);
    });

    topChart.data.datasets[0].label = label;
    topChart.data.datasets[0].data = auslastungInProzent;
    topChart.data.labels = address;

    topChart.update();
}

fetch(AnotherapiURL)
    .then(response => response.json())
    .then(insertDataToChart)
    .catch(error => {
        console.error('Error:', error);
    });