<?php

$router = new Core\Router();
$path = '/backend_chat/api';

$router->options("$path/*", '/options.php');

$router->post("$path/login", '/session/store.php');
// $router->post("$path/logout", '/session/destroy.php');
// $router->post("$path/register", 'registration/store.php');
// // $router->post("$path/register", 'registration/store.php')->only('superadmin');
// $router->post("$path/email/add", 'emails/store.php');
// $router->post("$path/email/send", 'emails/send.php');
// $router->post("$path/email/sendtest", 'emails/sendTest.php');

// $router->post("$path/players/filename", '/players/filename.php');
// $router->post("$path/players/filename-update", '/players/update.php');
// $router->post("$path/players/count", '/players/count.php');
// $router->post("$path/players/delete", '/players/delete.php');
// $router->delete("$path/players/delete", '/players/delete.php');
// $router->post("$path/players/store", '/players/store.php');
// $router->post("$path/players/list", '/players/list.php');
// $router->post("$path/players/event", '/players/event.php');

// $router->post("$path/events/store", '/events/store.php');
// $router->post("$path/events/list", '/events/list.php');
// $router->post("$path/events/update", '/events/update.php');
// $router->post("$path/events/event", '/events/event.php');

// $router->post("$path/preregistrants/store", '/preregistrants/store.php');
// $router->post("$path/preregistrants/list", '/preregistrants/list.php');
// $router->post("$path/preregistrants/delete", '/preregistrants/delete.php');

// $router->post("$path/financials/store", '/financials/store.php');
// $router->post("$path/financials/list", '/financials/list.php');

// $router->post("$path/tournaments/list", '/tournaments/list.php');