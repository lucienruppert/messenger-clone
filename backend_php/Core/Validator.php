<?php

namespace Core;

class Validator
{

  public static function checkString(string $value, int $min = 1, int $max = 100)
  {
    $value = trim($value);

    return strlen($value) >= $min && strlen($value) <= $max;
  }

  public static function checkEmail(string $value)
  {
    return filter_var($value, FILTER_VALIDATE_EMAIL);
  }
}
