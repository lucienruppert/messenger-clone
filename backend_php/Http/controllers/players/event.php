<?php

require base_path('headers.php');

use Core\Database;

$jsonData = file_get_contents('php://input');
$names = json_decode($jsonData, true);

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

$result = [];
foreach($names['names'] as $name) {
  $query = "SELECT * FROM players WHERE name = :name";
  $playersRankings = $db->query($query, [':name' => $name])->get();
  $result = array_merge($result, $playersRankings);
}
echo json_encode($result);
