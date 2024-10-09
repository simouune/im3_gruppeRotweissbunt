<?php
require_once ('config.php');
$transformStationData = include ('transform.php');

$dataArray = $transformStationData;


try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $stmt = $pdo->prepare("INSERT INTO `Ladesäulen` (`chargerID`, `chargingStationID`, `status`, `address`) VALUES (?, ?, ?, ?)");

    foreach ($dataArray as $data) {
        $stmt->execute([
            $data['chargerID'],
            $data['chargingStationID'],
            $data['status'],
            $data['address'],
        ]);
    }

    echo "Daten erfolgreich in die Datenbank geschrieben";

} catch (PDOException $e) {
    die ($e->getMessage());
}

?>