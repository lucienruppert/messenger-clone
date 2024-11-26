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
    $query = "SELECT * FROM payables WHERE name = :name AND eventId = :eventId";
    $params = ['name' => $input['name'], 'eventId' => intval($input['eventId'])];
    $result = $db->query($query, $params)->find();

    if (!$result) {
      $email = storePreregistrant($db, $input);
      storeCategories($db, $input['categories'], $email);
      if ($input['extraFees'])
        storeExtraFees($db, $input['extraFees'], $email);
    } else {
      updatePayables($db, $input, $result['id']);
      deletePayablesCategories($db, $result['id']);
      deletePayablesExtraFees($db, $result['id']);
      storeCategories($db, $input['categories'], $result['id']);
      if ($input['extraFees'])
        storeExtraFees($db, $input['extraFees'], $result['id']);
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

function deletePayablesCategories($db, $payablesId)
{
  $query = "DELETE FROM payablesCategories WHERE payablesId = :payablesId";
  $db->query($query, [
    ':payablesId' => $payablesId,
  ]);
}

function deletePayablesExtraFees($db, $payablesId)
{
  $query = "DELETE FROM payablesExtraFees WHERE payablesId = :payablesId";
  $db->query($query, [
    ':payablesId' => $payablesId,
  ]);
}

function storePreregistrant($db, $input)
{
  $query = "INSERT INTO payables (name, eventId, isAllFeesPaid, totalFees) 
            VALUES (:name, :eventId, :isAllFeesPaid, :totalFees)";

  $params = [
    ':name' => $input['name'],
    ':eventId' => $input['eventId'],
    ':isAllFeesPaid' => $input['isAllFeesPaid'] ? 1 : 0,
    ':totalFees' => $input['totalFees'],
  ];

  $db->query($query, $params);
  return $db->lastInsertId();
}

function updatePayables($db, $input, $id)
{
  $query = "UPDATE payables SET isAllFeesPaid = :isAllFeesPaid, totalFees = :totalFees WHERE id = :id";

  $params = [
    ':isAllFeesPaid' => $input['isAllFeesPaid'] ? 1 : 0,
    ':totalFees' => $input['totalFees'],
    ':id' => $id,
  ];

  $db->query($query, $params);
  return $db->lastInsertId();
}

function storeExtraFees($db, $extraFees, $payablesId)
{
  foreach ($extraFees as $extraFee) {
    $query = "INSERT INTO payablesExtraFees (payablesId, fee, isPaid, amount) 
              VALUES (:payablesId, :fee, :isPaid, :amount)";

    $db->query($query, [
      ':payablesId' => $payablesId,
      ':fee' => $extraFee['fee'],
      ':isPaid' => $extraFee['isPaid'] ? 1 : 0,
      ':amount' => $extraFee['amount'],
    ]);
  }
}

function storeCategories($db, $categories, $payablesId)
{
  foreach ($categories as $category) {
    $query = "INSERT INTO payablesCategories (payablesId, category, rankingsType, isPaid, rankings, feeByRankings) 
              VALUES (:payablesId, :category, :rankingsType, :isPaid, :rankings, :feeByRankings)";

    $db->query($query, [
      ':payablesId' => $payablesId,
      ':category' => $category['category'],
      ':rankingsType' => $category['rankingsType'],
      ':isPaid' => $category['isPaid'] ? 1 : 0,
      ':rankings' => $category['rankings'],
      ':feeByRankings' => $category['feeByRankings'] ?? NULL,
    ]);
  }
}
