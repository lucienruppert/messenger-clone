<?php

require base_path('headers.php');

use Core\Database;

$json = file_get_contents('php://input');
$input = json_decode($json, true);

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

if (is_array($input)) {
  $db->beginTransaction();
  try {
    $query = "SELECT * FROM preregistrants WHERE name = :name AND eventId = :eventId";
    $params = ['name' => $input['name'], 'eventId' => intval($input['event'])];
    $result = $db->query($query, $params)->find();

    if (!$result) {

      $email = storePreregistrant($db, $input);
      storeCategories($db, $input['categories'], $email);
    } else {
      storeCategories($db, $input['categories'], $result['id']);
    }

    $db->commit();
    http_response_code(200);
  } catch (Exception $e) {

    $db->rollBack();

    http_response_code(500);
    echo json_encode(['error' => 'Failed to save event data', 'details' => $e->getMessage()]);
  }
} else {

  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
}

// function deleteCategoriesByPreregistrantId($db, $preregistrantId)
// {
//   $query = "DELETE FROM preregistrantsCategories WHERE preregistrantId = :preregistrantId";
//   $db->query($query, [
//     ':preregistrantId' => $preregistrantId,
//   ]);
// }

function storePreregistrant($db, $input)
{
  $query = "INSERT INTO preregistrants (name, email, sex, eventId) 
            VALUES (:name, :email, :sex, :eventId)";

  $params = [
    ':name' => $input['name'],
    ':email' => $input['email'],
    ':sex' => $input['sex'] ?? null,
    ':eventId' => intval($input['event']),
  ];

  $db->query($query, $params);
  return $db->lastInsertId();
}

function storeCategories($db, $categories, $preregistrantId)
{
  foreach ($categories as $category) {
    $query = "INSERT INTO preregistrantsCategories (preregistrantId, category, partner) 
              VALUES (:preregistrantId, :category, :partner)";

    $db->query($query, [
      ':preregistrantId' => $preregistrantId,
      ':category' => $category['category'],
      ':partner' => $category['partner'] ?? NULL,
    ]);
  }
}
