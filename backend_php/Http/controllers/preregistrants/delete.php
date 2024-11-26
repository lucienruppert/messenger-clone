<?php

require base_path('headers.php');

use Core\Database;

$json = file_get_contents('php://input');
$input = json_decode($json, true);

if (!isset($input['name']) || !isset($input['eventId']) || !isset($input['category'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required fields: name, eventId, or category.']);
  exit;
}

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

$query = "SELECT * FROM preregistrants WHERE name = :name AND eventId = :eventId";
$preregistrant = $db->query($query, [':name' => $input['name'], ':eventId' => intval($input['eventId'])])->find();

if (!$preregistrant) {
  http_response_code(404);
  echo json_encode(['error' => 'Preregistrant not found.']);
  exit;
}

$query = "DELETE FROM preregistrantsCategories WHERE preregistrantId = :preregistrantId AND category = :category";
$db->query($query, [':preregistrantId' => $preregistrant['id'], ':category' => $input['category']]);

$query = "SELECT * FROM preregistrantsCategories WHERE preregistrantId = :preregistrantId";
$preregistrantCategories = $db->query($query, [':preregistrantId' => $preregistrant['id']])->get();

if (empty($preregistrantCategories)) {
  $query = "DELETE FROM preregistrants WHERE id = :preregistrantId";
  $db->query($query, [':preregistrantId' => $preregistrant['id']]);
  http_response_code(200);
  echo json_encode(['message' => 'Preregistrant deleted successfully.']);
} else {
  http_response_code(400);
  echo json_encode(['error' => 'Preregistrant has associated categories, cannot delete.']);
}

http_response_code(200);