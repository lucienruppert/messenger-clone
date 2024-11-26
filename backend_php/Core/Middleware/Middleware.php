<?php

namespace Core\Middleware;

class Middleware
{

  public const MAP = [
    'superadmin' => Superadmin::class,
  ];

  public static function resolve($key)
  {
    if (!$key) return;
    $middleware = static::MAP[$key] ?? false;
    if (!$middleware) throw new \Exception("Middleware not found: $key");
    (new $middleware)->handle();
  }
}
