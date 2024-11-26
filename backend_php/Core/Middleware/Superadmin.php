<?php

namespace Core\Middleware;

use Core\Response;

class Superadmin
{

  public function handle()
  {
    if (session_status() == PHP_SESSION_NONE) {
      session_start();
    }
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'superadmin') {
      require base_path('headers.php');
      http_response_code(Response::UNAUTHORIZED);
      echo json_encode(['errors' => 'Unathorized']);
      exit();
    }
  }
}
