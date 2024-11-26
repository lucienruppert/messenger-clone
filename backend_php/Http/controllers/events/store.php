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
    $email = saveEvent($db, $input);
    if ($input['categories'])
      storeCategories($db, $input['categories'], $email);
    if ($input['extraFees'])
      storeExtraFees($db, $input['extraFees'], $email);

    $db->commit();
    $response = ['id' => $email];
    echo json_encode($response);
  } catch (Exception $e) {

    $db->rollBack();

    http_response_code(500);
    echo json_encode(['error' => 'Failed to save event data', 'details' => $e->getMessage()]);
  }
} else {

  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
}

function storeCategories($db, $categories, $id)
{
  foreach ($categories as $category) {
    $query = "INSERT INTO eventCategories (eventId, category, categoryType, rankingsType, entryFeeType, master, pro, rookie, semiPro, uniform) 
              VALUES (:eventId, :category, :categoryType, :rankingsType, :entryFeeType, :master, :pro, :rookie, :semiPro, :uniform)";

    $db->query($query, [
      ':eventId' => $id,
      ':category' => $category['category'],
      ':categoryType' => $category['categoryType'],
      ':rankingsType' => $category['rankingsType'],
      ':entryFeeType' => $category['entryFeeType'],
      ':master' => $category['master'],
      ':pro' => $category['pro'],
      ':rookie' => $category['rookie'],
      ':semiPro' => $category['semiPro'],
      ':uniform' => $category['uniform'],
    ]);
  }
}

function storeExtraFees($db, $extraFees, $id)
{
  foreach ($extraFees as $extraFee) {
    $query = "INSERT INTO extraFees (eventId, extraFeeName, extraFeeAmount) 
              VALUES (:eventId, :extraFeeName, :extraFeeAmount)";

    $db->query($query, [
      ':eventId' => $id,
      ':extraFeeName' => $extraFee['extraFeeName'],
      ':extraFeeAmount' => $extraFee['extraFeeAmount'],
    ]);
  }
}

function saveEvent($db, $input)
{
  $query = "INSERT INTO events (title, location, owner, event_start, event_end, prereg_start, prereg_end) VALUES (:title, :location, :owner, :eventStart, :eventEnd, :preregStart, :preregEnd)";
  $params = [
    ':title' => $input['title'],
    ':location' => $input['location'],
    ':owner' => $input['owner'],
    ':eventStart' => formatDate($input['competition']['start']),
    ':eventEnd' => formatDate($input['competition']['end']),
    ':preregStart' => formatDate($input['preregistration']['start']),
    ':preregEnd' => formatDate($input['preregistration']['end']),
  ];
  $db->query($query, $params);

  return $db->lastInsertId();
}

function formatDate($date)
{
  return (new DateTime($date))->format('Y-m-d');
}
