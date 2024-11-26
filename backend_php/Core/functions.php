<?php

use Core\Response;

function dd($value)
{
  echo '<pre>';
  var_dump($value);
  echo '</pre>';
  die();
}

function base_path($path)
{
  return BASE_PATH . $path;
}

function authorize($condition, $status = Response::FORBIDDEN)
{
  if (!$condition) {
    abort($status);
  }
}

function abort($code = Response::NOT_FOUND): void
{
  http_response_code($code);
}

function trimArray(&$value)
{
  if (is_string($value)) {
    $value = trim($value);
  }
}