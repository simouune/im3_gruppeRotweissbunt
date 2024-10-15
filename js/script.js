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
      'Bildweiherstrasse 9': [47.404614, 9.309243],
      'Bionstrasse 5': [47.4081, 9.314843],
      'Breitfeldstrasse 10': [47.40869, 9.310732],
      'Breitfeldstrasse 9': [47.408038, 9.31104],
      'Burggraben 16': [47.425514, 9.378698],
      'Dufourstrasse 40': [47.432199, 9.375876],
      'Dufourstrasse 50': [47.43084468, 9.37393592],
      'Fürstenlandstrasse 97, Elektrofachschule': [47.412991, 9.345903],
      'Erlacherstrasse 3': [47.410742, 9.336991],
      'Favrestrasse 6': [47.437958, 9.414108],
      'Fürstenlandstrasse 122': [47.411487, 9.339593],
      'Fürstenlandstrasse 17': [47.414955, 9.353563],
      'Gartenstrasse 8': [47.42245, 9.374],
      'Geltenwilerstrasse 16/18': [47.418982, 9.366082],
      'Grütlistrasse 27': [47.433314, 9.405287],
      'Ikarusstrasse 2': [47.404143, 9.304324],
      'Kreuzbleicheweg 2': [47.420849, 9.360128],
      'Lagerstrasse 6': [47.422804, 9.367154],
      'Langgasse 151': [47.44874, 9.39761],
      'Lerchenfeldstrasse 11': [47.41348, 9.33982],
      'Lerchenfeldstrasse 5': [47.412367, 9.341061],
      'Bachstrasse 29, Parkhaus Migros': [47.43595, 9.391535],
      'Poststrasse 23': [47.423811, 9.371472],
      'St. Jakob-Strasse 55, Radisson Blu Hotel': [47.431091, 9.380416],
      'Rorschacher Strasse 253': [47.437577, 9.405831],
      'Rorschacher Strasse 286': [47.44319, 9.41551],
      'Rorschacher Strasse 311': [47.45132, 9.42016],
      'Schachenstrasse 3': [47.438703, 9.4187353],
      'Schochengasse 5': [47.42126, 9.37254],
      'Schuppisstrasse 11': [47.4413774, 9.41780248],
      'Schuppisstrasse 3': [47.440224, 9.418414],
      'St. Leonhard-Strasse 35': [47.42190917, 9.37041657],
      'Steinachstrasse': [47.43156, 9.38608],
      'Tannenstrasse 54': [47.43752, 9.379337],
      'Torstrasse 12': [47.427311, 9.378891],
      'Ulmenstrasse': [47.420052637079664, 9.35472254851419],
      'Unterstrasse 52': [47.41843, 9.366014],
      'Zürcher Strasse 204': [47.412799, 9.335419],
      'Zürcher Strasse 475': [47.40741, 9.302264],
      'Zürcherstrasse 114': [47.416474, 9.344008],
      'Zürcherstrasse 464': [47.408108, 9.30469],
      'Zürcherstrasse 511': [47.40733293, 9.29418607],
  };

  // Überprüfen, ob die ausgewählte Adresse in den Koordinaten vorhanden ist
  if (addressCoordinates[selectedAddress]) {
      var coords = addressCoordinates[selectedAddress];
      map.setView(coords, 17); // Zoomt auf die ausgewählte Adresse und setzt die Zoomstufe auf 17
  }
});
