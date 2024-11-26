<?php

namespace Core;

use Core\Database;

class Authenticator
{

  public $user;

  public function attempt($email, $password)
  {
    $config = require base_path('config.php');
    $db = new Database($config['database'], $config['username'], $config['password']);
    $query = "select * from users where email = :email";
    $result = $db->query($query, [':email' => $email])->find();

    if ($result && password_verify($password, $result['password'])) {
      $this->setUser($result);
      $this->initSession($this->user);
      return true;
    }
    return false;
  }

  public function setUser($result)
  {
    $this->user = [
      'email' => $result['email'],
      'role' => $result['role'],
    ];
  }

  public function initSession($user)
  {
    $_SESSION['user'] = $user;
    //session_regenerate_id(true);
  }

  public function logout()
  {
    if (session_status() === PHP_SESSION_NONE) {
      session_start();
    }

    $_SESSION = [];
    session_destroy();
    $params = session_get_cookie_params();
    setcookie('PHPSESSID', '', time() - 3600, $params['path'], $params['domain']);

    require base_path('headers.php');
    echo json_encode(['message' => 'Logout successful']);
    exit;
  }
}
