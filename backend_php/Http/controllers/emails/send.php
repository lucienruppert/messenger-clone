<?php

require base_path('headers.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

use Core\Database;

$json = file_get_contents('php://input');
$input = json_decode($json, true);
$ownerEmail = $input['email'];

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

$query1 = "SELECT * FROM users WHERE email = :ownersEmail";
$owner = $db->query($query1, [':ownersEmail' => $ownerEmail])->find();
$ownerId = $owner['id'];

$query2 = "SELECT * FROM emails WHERE owner = :ownerId";
$emailList = $db->query($query2, [':ownerId' => $ownerId])->get();

$counter = 0;
$errors = [];

foreach ($emailList as $email) {
  array_push($errors, $email['email']);
  sendMailTo($email['email']);
  $counter++;
}

function sendMailTo($email)
{
  $to = $email;
  $subject = "Teszt email";
  $headers = "From: noreply@luciendelmar.com\r\n";
  $body = "Jó napot kívánok!";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html;charset=utf-8\r\n";

  $success = mail($to, $subject, $body, $headers);

  if (!$success) {
    error_log("Failed to send email to: $email");
    array_push($errors, $email);
  }
}

$response = [
  'sent' => $counter,
  'failed' => $errors
];

echo json_encode($response);
