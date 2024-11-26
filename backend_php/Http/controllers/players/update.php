<?php

require base_path('headers.php');

use Core\Database;

$json = file_get_contents('php://input');
$fileName = json_decode($json, true);
$fileName = $fileName['fileName'];

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

$query = "UPDATE playersFileName SET name = :fileName";
$db->query($query, [
  ':fileName' => $fileName,
]);

$query = "SELECT * FROM playersFileName";
$filename = $db->query($query)->find()['name'];
$response = ['fileName' => $fileName];
echo json_encode($response);
