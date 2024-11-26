<?php

use Core\Response;

const BASE_PATH = __DIR__ . '/../';
require BASE_PATH . 'Core/functions.php';
require base_path('Core/Response.php');

spl_autoload_register(function ($class) {
  $class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
  require base_path("$class.php");
});

$router = new Core\Router();
if (!$router->authorizeOrigin()) $router->abort(Response::FORBIDDEN, 'Out of luck, forbidden origin.');
$routes = require base_path('routes.php');
$uri = parse_url($_SERVER['REQUEST_URI'])['path'];
$router->route($uri, $_SERVER['REQUEST_METHOD']);