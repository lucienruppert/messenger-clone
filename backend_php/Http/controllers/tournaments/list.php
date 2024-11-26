<?php

require base_path('headers.php');

use Core\Database;

$json = file_get_contents('php://input');
$input = json_decode($json, true);

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

$query = "SELECT * FROM preregistrants WHERE event = :event";
$preregistrants = $db->query($query, [':event' => $input['id']])->get();

foreach ($preregistrants as $index => $preregistrant) {
  $query = "SELECT * FROM preregistrantsCategories WHERE preregistrantId = :preregistrantId";
  $categories = $db->query($query, [':preregistrantId' => $preregistrant['id']])->get();
  $preregistrants[$index]['categories'] = $categories;
}
echo json_encode($preregistrants);
