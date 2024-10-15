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

/* Grafik Auslastung per Tag  ----------------------------------------------------*/
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

//---------------------------------------------------------------------*/
// STANDORTE LADESTATIONEN 
//---------------------------------------------------------------------*/

// Initialisieren der Karte und setzen der Ansicht auf eine bestimmte geografische Koordinate und Zoomstufe
var map = L.map('map').setView([47.4245, 9.3767], 13); // Koordinaten für St. Gallen

// Hinzufügen einer OpenStreetMap-Kachel-Layer zur Karte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Funktion, um ein Popup oder Tooltip für jedes Feature hinzuzufügen und bei Klick zu zoomen
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.address_street) {
        layer.bindTooltip(feature.properties.address_street, {
            permanent: false, // Tooltip wird nur beim Hover angezeigt
            direction: 'top' // Tooltip wird oberhalb des Markers angezeigt
        });
    }

    // Event-Listener für Klick auf den Marker
    layer.on('click', function() {
        map.setView(layer.getLatLng(), 17); // Zoomt auf den Marker und setzt die Zoomstufe auf 17
    });
}

// Laden und Hinzufügen der GeoJSON-Datei zur Karte
fetch('ladestationenStandorte.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.error('Error loading the GeoJSON file:', error));

// Event-Listener für das Dropdown-Menü
document.getElementById('address').addEventListener('change', function() {
  var selectedAddress = this.value;

  // Koordinaten für die Adressen (Beispiel)
  var addressCoordinates = {
      'Burgstrasse 15, Avia Osterwalder': [47.4245, 9.3767],
      'Bahnhofplatz 7': [47.4255, 9.3777],

  };

  // Überprüfen, ob die ausgewählte Adresse in den Koordinaten vorhanden ist
  if (addressCoordinates[selectedAddress]) {
      var coords = addressCoordinates[selectedAddress];
      map.setView(coords, 17); // Zoomt auf die ausgewählte Adresse und setzt die Zoomstufe auf 17
  }
});
