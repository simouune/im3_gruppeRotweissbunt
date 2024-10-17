document.getElementById('dataForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Verhindert das Standardformular-Submit-Verhalten

  // Erfassen der Formulardaten
  const startDate = document.getElementById('start_date').value || '2024-10-11';
    const endDate = document.getElementById('end_date').value || new Date().toISOString().split('T')[0];

  // Automatisch die Zeiten setzen
  const startTime = `${startDate}T00:00:00`;
  const endTime = `${endDate}T23:59:59`;

  // Senden der Daten an das PHP-Skript
  fetchDataAndInsertToChart(startTime, endTime);
});


function fetchDataAndInsertToChart(startTime, endTime) {
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
}

/* Grafik Top 5 Adressen  ------------------------------------------------------------------------------------------------------*/

const cty = document.getElementById('top5Chart');

const topChart = new Chart(cty, {
    type: 'bar',
    data: {
      labels: [], // Verwende die Werte aus dem wochentage Array
      datasets: [{
        label:'',
        data: [], // Hier kannst du die tatsächlichen Daten einsetzen
        backgroundColor: ['#001928', '#092F46', '#174764', '#225D81', '#286991'],
        borderWidth: 1,
        borderRadius: 3,
        borderColor: ['#001928', '#092F46', '#174764', '#225D81', '#286991'],
        hoverBackgroundColor: '#89A0AE', // Highlight color on hover

      }]
    },
    options: {
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: {
            color: 'rgb(247, 252, 255)',
          },
          ticks:{
            color: '#001F32',
            font: {
              size: 15,
          },
          }},
        y: {
          beginAtZero: true,
          ticks:{
            color: '#001F32',
            font: {
              size: 14,
          },
          grid: {
            color: '#D9E4EC',
          }
        }
      }
    }
  }});

const AnotherapiURL = 'https://projekt.rotweissbunt.com/unload.php';

function insertDataToChart(top5Results) {
    const address = [];
    const auslastungInProzent = [];
    let label = "Ladestationen mit der höchsten Auslastung im ausgewählten Zeitraum";

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

// Default start and end times
const defaultStartDate = '2024-10-11'; // Set your default start date here
const defaultEndDate = new Date().toISOString().split('T')[0]; // Set default end date to today

const defaultStartTime = `${defaultStartDate}T00:00:00`;
const defaultEndTime = `${defaultEndDate}T23:59:59`;

// Fetch and insert data with default times on page load
fetchDataAndInsertToChart(defaultStartTime, defaultEndTime);

fetch(AnotherapiURL)
    .then(response => response.json())
    .then(insertDataToChart)
    .catch(error => {
        console.error('Error:', error);
    });