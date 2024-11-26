<?php

namespace Http\Forms;

use Core\Validator;

class RegistrationForm
{
  public $errors = [];

  public function validate($email)
  {
    if (!Validator::checkEmail($email)) {
      $this->errors[] = 'Érvénytelen email.';
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
