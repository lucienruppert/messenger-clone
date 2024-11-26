<?php

require base_path('headers.php');

use Core\Database;

$json = file_get_contents('php://input');
$input = json_decode($json, true);

$email = intval($input['eventId']);

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

$query = "SELECT * FROM payables WHERE eventId = :eventId";
$payables = $db->query($query, [':eventId' => $email])->get();

foreach ($payables as $index => $payable) {
  $query = "SELECT * FROM payablesCategories WHERE payablesId = :payablesId";
  $categories = $db->query($query, [':payablesId' => $payable['id']])->get();
  $payables[$index]['categories'] = $categories;
}

foreach ($payables as $index => $payable) {
  $query = "SELECT * FROM payablesExtraFees WHERE payablesId = :payablesId";
  $extraFees = $db->query($query, [':payablesId' => $payable['id']])->get();
  $payables[$index]['extraFees'] = $extraFees;
}

echo json_encode($payables);
