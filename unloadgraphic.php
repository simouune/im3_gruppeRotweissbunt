<?php
require_once 'config.php';

header('Content-Type: application/json');


if (isset($_GET['start_time']) && isset($_GET['end_time'])) {
    $start_time = date('Y-m-d 00:00:00', strtotime($_GET['start_time']));
    $end_time = date('Y-m-d 23:59:59', strtotime($_GET['end_time']));
} else {
    $start_time = '2024-10-11 00:00:00';
    $end_time = '2024-10-14 23:59:59';
}

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $sql = "SELECT * FROM `Ladesäulen` WHERE `timestamp` BETWEEN '{$start_time}' AND '{$end_time}'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $listOfStations= $stmt->fetchAll(PDO::FETCH_ASSOC); // Ensure the result is an associative array

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
    exit;
}


//----------------------------------------------------------
//BERECHNUNG UND ANZEIGEN DER AUSLASTUNGSRATE
//----------------------------------------------------------
function groupStationsByAddress($listOfStations) {
    $groupedStations = [];
    foreach ($listOfStations as $station) {
        $address = $station['address'];
        if (!isset($groupedStations[$address])) {
            $groupedStations[$address] = [];
        }
        $groupedStations[$address][] = $station;
    }
    return $groupedStations;
}

function calculateAuslastungsrate($stations) {
    $availableCount = 0;
    $totalCount = 0;
    foreach ($stations as $station) {
        if ($station['status'] !== 'OutOfService' && $station['status'] !== 'Unknown') {
            $totalCount++;
            if ($station['status'] === 'Available') {
                $availableCount++;
            }
        }
    }
    $unavailableCount = $totalCount - $availableCount;
    $auslastungsrate = ($totalCount > 0) ? ($unavailableCount / $totalCount) * 100 : 0;
    return [
        'address' => $stations[0]['address'],
        'available_count' => $availableCount,
        'unavailable_count' => $unavailableCount,
        'allEntries' => $totalCount,
        'auslastungsrate' => round($auslastungsrate, 1)
    ];
}

$groupedStations = groupStationsByAddress($listOfStations);
$resultForGraphic = [];

foreach ($groupedStations as $address => $stations) {
    $resultForGraphic[$address] = calculateAuslastungsrate($stations);
}

// Sort the result by auslastungsrate in descending order and get the top 10
usort($resultForGraphic, function($a, $b) {
    return $b['auslastungsrate'] <=> $a['auslastungsrate'];
});

$top5Results = array_slice($resultForGraphic, 0, 5);

echo json_encode($top5Results);

//----------------------------------------------------------