<?php
require_once 'config.php';

header('Content-Type: application/json');


if (isset($_GET['address'])) {
    $address = $_GET['address'];
} else {
    $address = 'Avia Osterwalder, Burgstrasse 15, 9000 St.Gallen';
}

if (isset($_GET['start_time']) && isset($_GET['end_time'])) {
    $start_time = date('Y-m-d 00:00:00', strtotime($_GET['start_time']));
    $end_time = date('Y-m-d 23:59:59', strtotime($_GET['end_time']));
} else {
    $start_time = '2024-10-11 00:00:00';
    $end_time = date('Y-m-d 23:59:59');
}

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $sql = "SELECT * FROM `Ladesäulen` WHERE `address` = ? AND `timestamp` BETWEEN '{$start_time}' AND '{$end_time}'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$address]);

    $stationListe = $stmt->fetchAll(PDO::FETCH_ASSOC); // Ensure the result is an associative array

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
    exit;
}


//----------------------------------------------------------
//BERECHNUNG UND ANZEIGEN DER AUSLASTUNGSRATE
//----------------------------------------------------------
function countAvailableStations($stationListe) {
    $count = 0;
    foreach ($stationListe as $station) {
        if ($station['status'] === 'Available') {
            $count++;
        }
    }
    return $count;
}

function filterStations($stationListe) {
    return array_filter($stationListe, function($station) {
        return !in_array($station['status'], ['OutOfService', 'Unknown']);
    });
}

$groupedStations = [];
foreach ($stationListe as $station) {
    $date = date('Y-m-d', strtotime($station['timestamp'])); // Group by full day
    if (!isset($groupedStations[$date])) {
        $groupedStations[$date] = [];
    }
    $groupedStations[$date][] = $station;
}

$weekdayNames = [
    'Monday' => 'Montag',
    'Tuesday' => 'Dienstag',
    'Wednesday' => 'Mittwoch',
    'Thursday' => 'Donnerstag',
    'Friday' => 'Freitag',
    'Saturday' => 'Samstag',
    'Sunday' => 'Sonntag'
];

$result = [];
foreach ($groupedStations as $day => $stations) {
    $filteredStations = filterStations($stations);
    $availableCount = countAvailableStations($filteredStations);
    $totalCount = count($filteredStations);
    $unavailableCount = $totalCount - $availableCount;
    $auslastungsrate = ($totalCount > 0) ? ($unavailableCount / $totalCount) * 100 : 0;
    $weekday = date('l', strtotime($day)); // Get the weekday
    $weekdayGerman = $weekdayNames[$weekday]; // Translate to German

    $result[$day] = [
        'address' => $address,
        'weekday' => $weekdayGerman,
        'available_count' => $availableCount,
        'unavailable_count' => $unavailableCount,
        'allEntries' => $totalCount,
        'auslastungsrate' => round($auslastungsrate, 1)
    ];
}

echo json_encode($result);
//----------------------------------------------------------