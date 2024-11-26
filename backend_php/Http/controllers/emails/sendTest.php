<?php

require base_path('headers.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$to = "luciendelmar@gmail.com";
$subject = "Teszt email";
$headers = "From: noreply@luciendelmar.com\r\n";
$body = "Jó napot kívánok!";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html;charset=utf-8\r\n";
$result = mail($to, $subject, $body, $headers);

echo json_encode($result ? "Sikeres kiküldés" : "Sikertelen kiküldés");