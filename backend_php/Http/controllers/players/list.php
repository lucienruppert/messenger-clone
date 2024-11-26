<?php

require base_path('headers.php');

use Core\Database;

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

$query = "SELECT * FROM players";
$players = $db->query($query)->get();
echo json_encode($players);
