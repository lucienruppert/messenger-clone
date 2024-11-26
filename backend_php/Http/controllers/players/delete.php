<?php

require base_path('headers.php');

use Core\Database;
use Core\Response;

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);
$query = "TRUNCATE TABLE players";
$db->query($query);
http_response_code(Response::SUCCESS);
