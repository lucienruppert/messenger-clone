<?php

namespace Core;

use Core\Middleware\Middleware;

class Router
{

  public $routes = [];

  public function add($uri, $controller, $method)
  {
    $this->routes[] = [
      'uri' => $uri,
      'controller' => $controller,
      'method' => $method,
      'middleware'  => 'default',
    ];
    return $this;
  }

  public function get($uri, $controller)
  {
    return $this->add($uri, $controller, 'GET');
  }

  public function post($uri, $controller)
  {
    return $this->add($uri, $controller, 'POST');
  }

  public function options($uri, $controller)
  {
    return $this->add($uri, $controller, 'OPTIONS');
  }

  public function delete($uri, $controller)
  {
    return $this->add($uri, $controller, 'DELETE');
  }

  public function patch($uri, $controller)
  {
    return $this->add($uri, $controller, 'PATCH');
  }

  public function put($uri, $controller)
  {
    return $this->add($uri, $controller, 'PUT');
  }

  public function route(string $uri, string $method)
  {
    foreach ($this->routes as $route) {
      if ($this->matchUri($route['uri'], $uri) && $route['method'] === strtoupper($method)) {

        if ($route['middleware'] !== 'default') {
          Middleware::resolve($route['middleware']);
        }

        return require base_path('Http/controllers/' . $route['controller']);
      }
    }
    $this->abort();
  }

  private function matchUri(string $routeUri, string $requestUri): bool
  {
    $routeUri = rtrim($routeUri, '/');
    $requestUri = rtrim($requestUri, '/');

    if (strpos($routeUri, '*') !== false) {
      $basePath = substr($routeUri, 0, strpos($routeUri, '*'));
      return strpos($requestUri, $basePath) === 0;
    }

    return $routeUri === $requestUri;
  }

  public function authorizeOrigin(): bool
  {
    $allowedOrigins = require base_path('cors.php');
    return isset($_SERVER["HTTP_ORIGIN"]) && in_array($_SERVER["HTTP_ORIGIN"], $allowedOrigins);
  }

  public function abort($code = 404, $message = "Not Found")
  {
    http_response_code($code);
    echo "$code $message";
    exit();
  }

  public function only($key)
  {
    $this->routes[array_key_last($this->routes)]['middleware'] = $key;
    return $this;
  }
}
