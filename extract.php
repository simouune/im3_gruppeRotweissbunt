<?php

$url = "https://www.daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/ladestationen-fur-elektroautos-im-kanton-stgallen/records?limit=100";

// Initialisiert eine cURL-Sitzung
$ch = curl_init($url);

// Setzt Optionen
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Führt die cURL-Sitzung aus und erhält den Inhalt
$response = curl_exec($ch);

// Schließt die cURL-Sitzung
curl_close($ch);

// Debugging: Zeigt die Rohantwort an
// echo "Rohantwort: " . $response;

// JSON-Daten dekodieren
$stationData = json_decode($response, true);

return $stationData;


