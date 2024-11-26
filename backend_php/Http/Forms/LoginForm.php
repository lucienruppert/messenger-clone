<?php

namespace Http\Forms;

use Core\Validator;

class LoginForm
{
  public $errors = [];

  public function validate($email, $password)
  {
    if (!Validator::checkEmail($email)) {
      $this->errors[] = 'Érvénytelen email.';
    }

    if (!Validator::checkString($password)) {
      $this->errors[] = 'Érvénytelen jelszó.';
    }

    return empty($this->errors);
  }

  public function errors()
  {
    return $this->errors;
  }

  public function error($message)
  {
    $this->errors[] = $message;
  }
}
