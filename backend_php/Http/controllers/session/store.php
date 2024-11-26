<?php

session_start();

require base_path('headers.php');

use Core\Authenticator;
use Http\Forms\LoginForm;
use Core\Response;

$email = $_POST['email'];
$password = $_POST['password'];
//dd(password_hash($password, PASSWORD_BCRYPT));

$form = new LoginForm();
$authenticator = new Authenticator();

if ($form->validate($email, $password)) {
  if (!($authenticator)->attempt($email, $password)) {
    $form->error('A megadott adatokhoz nem tartozik felhasználó.');
    http_response_code(Response::UNAUTHORIZED);
  }
} else {
  http_response_code(Response::BAD_REQUEST);
}

if ($form->errors()) $response['errors'] = $form->errors();
if (isset($_SESSION['user'])) $response = $_SESSION['user'];
echo json_encode($response);
