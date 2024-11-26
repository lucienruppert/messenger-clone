<?php

require base_path('headers.php');

use Core\Database;

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);
$query = "SELECT COUNT(*) FROM players";
$count = $db->query($query)->fetchColumn();
echo json_encode($count);
