document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Standardformular-Submit-Verhalten

    // Fetch and update chart data
    fetchAndUpdateChartData();

});

document.getElementById('dataDropdown').addEventListener('change', function() {
    // Fetch and update chart data
    fetchAndUpdateChartData();
});

function fetchAndUpdateChartData() {

    // Capture form data
    const startDate = document.getElementById('start_date').value || '2024-10-11';
    const endDate = document.getElementById('end_date').value || new Date().toISOString().split('T')[0];
    const address = document.getElementById('address').value;

    // Automatically set the times
    const startTime = `${startDate}T00:00:00`;
    const endTime = `${endDate}T23:59:59`;

    // Send data to the PHP script
    fetch(`unload.php?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}&address=${encodeURIComponent(address)}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result); // Process the PHP script response
        updateChartWithData(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


/* Grafik Auslastung per Tag  ----------------------------------------------------*/
const ctx = document.getElementById('myChart');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Verwende die Werte aus dem wochentage Array
      datasets: [{
        label: 'Auslastungsrate',
        data: [], // Hier kannst du die tatsächlichen Daten einsetzen
        borderColor: '#023859',  // Farbe der Linie
        backgroundColor: '#023859', // Farbe der Datenpunkte
        borderWidth: 2,  // Dicke der Linie
        pointRadius: 4,  // Größe der Datenpunkte
        pointBackgroundColor: '#327EC6', // Farbe der Datenpunkte
        pointBorderColor: '#023859',     // Rahmenfarbe der Datenpunkte
        tension: 0,  // Optionale Spannung, um die Linie weich zu zeichnen
      }]
    },
    options: {
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 15,  // Legendentext-Schriftgröße
            },
            generateLabels: function(chart) {
                return chart.data.datasets.map(function(dataset, i) {
                  return {
                    text: dataset.label,
                    fillStyle: 'rgb(247, 252, 255)',  // Farbe des Punktes 
                    strokeStyle: 'rgb(247, 252, 255)',// Punktumrandung
                    pointStyle: 'circle',              // Setzt den Punktstil
                    hidden: false,
                  };
                });
              }
          }
        },
        tooltip: {
            enabled: true,         // Aktiviert Tooltips
            backgroundColor: '#327EC6',  // Hintergrundfarbe des Tooltips
            titleColor: '#FFFFFF',       // Farbe des Titels im Tooltip
            bodyColor: '#FFFFFF',        // Textfarbe des Tooltip-Inhalts
            displayColors: false,        // Entfernt die Farbboxen im Tooltip
            callbacks: {
              label: function(context) {
                // Hier kannst du den Text anpassen, der für die Daten angezeigt wird
                let label = "Auslastung an diesem Tag: ";
  
                // Anpassung des angezeigten Datenwerts (z. B. formatiert)
                label += context.raw + ' %'; // Text mit Werten und Einheit
                return label;
              },
              title: function(context) {
                // Anpassung des Titels (z. B. der Kategorie/Wochentag)
                return '' + context[0].label;
              }
            }
          },
      },
      scales: {
        x: {
          grid: {
            color: 'rgb(247, 252, 255)',  // Gitterfarbe für die X-Achse
          },
          ticks: {
            color: '#001F32',  // Farbe der X-Achsen-Beschriftungen
            font: {
              size: 15,  // Schriftgröße der X-Achsen-Beschriftungen
            },
          }
        },
        y: {
          beginAtZero: true,  // Beginnt bei Null auf der Y-Achse
          grid: {
            color: '#D9E4EC',  // Gitterfarbe für die Y-Achse
          },
          ticks: {
            color: '#001F32',  // Farbe der Y-Achsen-Beschriftungen
            font: {
              size: 14,  // Schriftgröße der Y-Achsen-Beschriftungen
            },
          }
        }
      }
    }
});




function updateChartWithData(result) {
    const wochentage = [];
    const tooltipDates = [];
    const auslastungInProzent = [];
    let label = "";
    
    // Hole das Startdatum aus dem Formular
    const startDate = document.getElementById('start_date').value || '2024-10-11'; 
    let currentDate = new Date(startDate); // Beginn mit dem Startdatum
    
    const werteArray = Object.values(result);
    
    werteArray.forEach(item => {
        // Format für die X-Achse (nur Wochentag)
        const optionsShort = { weekday: 'short' };
        const formattedWeekday = currentDate.toLocaleDateString('de-DE', { weekday: 'long' }); // Ganzer Wochentag für X-Achse
        
        // Format für den Tooltip (komplettes Datum)
        const optionsFull = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('de-DE', optionsFull); // Volles Datum für Tooltip
        
        auslastungInProzent.push(item.auslastungsrate);
        wochentage.push(formattedWeekday); // Nur Wochentag für X-Achse
        tooltipDates.push(formattedDate);  // Volles Datum für Tooltip
        
        label = item.address; // Setze die Adresse als Label für die Datenreihe
        
        // Nächsten Tag hinzufügen
        currentDate.setDate(currentDate.getDate() + 1);
    });

    // Aktualisiere die Chart-Daten
    chart.data.datasets[0].label = label;
    chart.data.datasets[0].data = auslastungInProzent;
    chart.data.labels = wochentage;

    // Custom Tooltip
    chart.options.plugins.tooltip.callbacks.label = function(context) {
        let label = "Auslastung an diesem Tag: " + context.raw + ' %'; // Text mit Werten und Einheit
        return label;
    };
    chart.options.plugins.tooltip.callbacks.title = function(context) {
        // Zeige volles Datum im Tooltip
        return tooltipDates[context[0].dataIndex]; // Index aus Tooltipdaten holen
    };

    chart.update(); // Aktualisiere das Diagramm
}



document.getElementById('end_date').value = new Date().toISOString().split('T')[0];

const apiURL = 'https://projekt.rotweissbunt.com/unload.php';

fetch(apiURL)
    .then(response => response.json())
    .then(updateChartWithData)
    .catch(error => {
        console.error('Error:', error);
    });




//---------------------------------------------------------------------*/
// EINSTIEGSFAKT INTRO SECTION: AKTUELLE AUSLASTUNG
//---------------------------------------------------------------------*/

async function fetchAvailability() {
    try {
        // Beispiel-URL der API, die die Verfügbarkeit zurückgibt
        const response = await fetch('https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/ladestationen-fur-elektroautos-im-kanton-stgallen/records?limit=100');
        const data = await response.json();

        // Extrahieren der Verfügbarkeit aus der API-Antwort
        let totalStations = data.total_count;
        let availableStations = data.results.filter(record => record.evsestatusrecord_evsestatus === 'Available').length;
        let freeRate = (availableStations / totalStations) * 100;

        // Aktualisieren des Elements mit der ID "freeRate"
        document.getElementById('freeRate').textContent = `${freeRate.toFixed(2)} %`;
    } catch (error) {
        console.error('Error fetching availability:', error);
    }
}

// Abrufen der Verfügbarkeit beim Laden der Seite
document.addEventListener('DOMContentLoaded', fetchAvailability);


//---------------------------------------------------------------------*/
// KARTE LADESTATIONEN-STANDORTE
//---------------------------------------------------------------------*/

// Initialisieren der Karte und setzen der Ansicht auf eine bestimmte geografische Koordinate und Zoomstufe
var map = L.map('map').setView([47.419421, 9.363853], 17); // Koordinaten für St. Gallen

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
      'Avia Osterwalder, Burgstrasse 15, 9000 St.Gallen': [47.419421, 9.363853],
      'Bahnhofplatz 7': [47.421946, 9.36923],
      'Bildweiherstrasse 9': [47.404614, 9.309243],
      'Bionstrasse 5': [47.4081, 9.314843],
      'Breitfeldstrasse 10': [47.40869, 9.310732],
      'Breitfeldstrasse 9': [47.408038, 9.31104],
      'Burggraben 16': [47.425514, 9.378698],
      'Dufourstrasse 40': [47.432199, 9.375876],
      'Dufourstrasse 50': [47.43084468, 9.37393592],
      'Elektrofachschule St. Gallen, Fürstenlandstrasse 97, 9014 St. Gallen': [47.412991, 9.345903],
      'Erlacherstrasse 3': [47.410742, 9.336991],
      'Favrestrasse 6': [47.437958, 9.414108],
      'Fürstenlandstrasse 122': [47.411487, 9.339593],
      'Fürstenlandstrasse 17': [47.414955, 9.353563],
      'Gartenstrasse 8': [47.42245, 9.374],
      'Geltenwilerstrasse 16/18 0': [47.418982, 9.366082],
      'Grütlistrasse 27': [47.433314, 9.405287],
      'Ikarusstrasse 2': [47.404143, 9.304324],
      'Kreuzbleicheweg 2': [47.420849, 9.360128],
      'Lagerstrasse 6': [47.422804, 9.367154],
      'Langgasse 151': [47.44874, 9.39761],
      'Lerchenfeldstrasse 11': [47.41348, 9.33982],
      'Lerchenfeldstrasse 5': [47.412367, 9.341061],
      'Parkhaus Migros St. Fiden, Bachstrasse 29, 9008 St. Gallen': [47.43595, 9.391535],
      'Poststrasse 23': [47.423811, 9.371472],
      'Radisson Blu Hotel, St. Jakob-Strasse 55, 9000 St. Gallen': [47.431091, 9.380416],
      'Rorschacher Strasse 253': [47.437577, 9.405831],
      'Rorschacher Strasse 286': [47.44319, 9.41551],
      'Rorschacher Strasse 311': [47.45132, 9.42016],
      'Schachenstrasse 3': [47.438703, 9.4187353],
      'Schochengasse 5': [47.42126, 9.37254],
      'Schuppisstrasse 11': [47.4413774, 9.41780248],
      'Schuppisstrasse 3': [47.440224, 9.418414],
      'St. Leonhard-Strasse 35': [47.42190917, 9.37041657],
      'Steinachstrasse': [47.43156, 9.38608],
      'Steinachstrasse 41': [47.429561, 9.384191],
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
