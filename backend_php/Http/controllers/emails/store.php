<?php

require base_path('headers.php');

use Core\Database;
use Http\Forms\RegistrationForm;
use Core\Response;

$email = $_POST['email'];
$owner = $_POST['owner'];
$project = $_POST['project'];

$errors = [];

$form = new RegistrationForm();

if ($form->validate($email)) {
  $registeredEmail = storeEmail($email, $owner, $project)['email'];
  $response['status'] = "$registeredEmail cím sikeresen regisztrálva.";
  http_response_code(Response::SUCCESS);
} else {
  http_response_code(Response::BAD_REQUEST);
}

function storeEmail($email, $owner, $project)
{
  $config = require base_path('config.php');
  $db = new Database($config['database'], $config['username'], $config['password']);
  $query = "insert into emails (email, owner, project) values (:email, :owner, :project)";
  $db->query($query, [
    ':email' => $email,
    ':owner' => intval($owner),
    ':project' => $project,
  ]);

  $lastInsertedId = $db->lastInsertId();
  $query = "SELECT * FROM emails WHERE id = :id";
  return $db->query($query, [':id' => $lastInsertedId])->find();
}

if ($form->errors()) $response['errors'] = $form->errors();
echo json_encode($response);
