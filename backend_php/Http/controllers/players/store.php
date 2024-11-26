<?php

require base_path('headers.php');

use Core\Database;

$jsonData = file_get_contents('php://input');
$players = json_decode($jsonData, true);

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

if (is_array($players)) {

  $db->beginTransaction();

  try {
    foreach ($players as $player) {
      $query = "INSERT INTO players (name, rankings, rankingsType, scores) 
              VALUES (:name, :rankings, :rankingsType, :scores)";

      $db->query($query, [
        ':name' => $player['name'],
        ':rankings' => $player['rankings'],
        ':rankingsType' => $player['rankingsType'],
        ':scores' => intval($player['scores']),
      ]);
    }

    $db->commit();

    $response = ['count' => count($players)];
    header('Content-Type: application/json');
    echo json_encode($response);
  } catch (Exception $e) {

    $db->rollBack();

    http_response_code(500);
    echo json_encode(['error' => 'Failed to save player data', 'details' => $e->getMessage()]);
  }
} else {

  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
}
