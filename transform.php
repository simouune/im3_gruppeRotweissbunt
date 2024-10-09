<?php

$stationData = include ('extract.php');

$loadDaten = [];

if (is_array($stationData['results'])) {
    foreach ($stationData['results'] as $stromquelle) {
        if (isset($stromquelle['evsestatusrecord_evseid'], $stromquelle['chargingstationid'], $stromquelle['evsestatusrecord_evsestatus'], $stromquelle['address_street'])) {
            $loadDaten[] = [
                'chargerID' => $stromquelle['evsestatusrecord_evseid'],
                'chargingStationID' => $stromquelle['chargingstationid'],
                'status' => $stromquelle['evsestatusrecord_evsestatus'],
                'address' => $stromquelle['address_street'],
            ];
        }
    }

    return $loadDaten;
} else {
    echo "Error: stationData is not an array.";
}

?>