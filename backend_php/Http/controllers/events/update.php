<?php

require base_path('headers.php');

use Core\Database;
use Core\Response;

$json = file_get_contents('php://input');
$input = json_decode($json, true);
$email = $input['id'];

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

if (is_array($input)) {
  $db->beginTransaction();

  try {
    saveEvent($db, $input);
    if ($input['categories']) {
      deleteCategoriesByEvent($db, $email);
      storeCategories($db, $input['categories'], $email);
    }
    if ($input['extraFees']) {
      deleteExtraFeesByEvent($db, $email);
      storeExtraFees($db, $input['extraFees'], $email);
    }

    $db->commit();
    http_response_code(Response::SUCCESS);
  } catch (Exception $e) {

    $db->rollBack();

    http_response_code(500);
    echo json_encode(['error' => 'Failed to save event data', 'details' => $e->getMessage()]);
  }
} else {

  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
}

function deleteCategoriesByEvent($db, $id)
{
  $query = "DELETE FROM eventCategories WHERE eventId = :eventId";
  $db->query($query, [
    ':eventId' => $id,
  ]);
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

function deleteExtraFeesByEvent($db, $id)
{
  $query = "DELETE FROM extraFees WHERE eventId = :eventId";
  $db->query($query, [
    ':eventId' => $id,
  ]);
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
  $title = $input['title'];
  $location = $input['location'];
  $owner = $input['owner'];
  $eventStart = (new DateTime($input['competition']['start']))->format('Y-m-d');
  $eventEnd = (new DateTime($input['competition']['end']))->format('Y-m-d');
  $preregStart = (new DateTime($input['preregistration']['start']))->format('Y-m-d');
  $preregEnd = (new DateTime($input['preregistration']['end']))->format('Y-m-d');
  $id = $input['id'];

  $query = "UPDATE events 
          SET title = :title, 
              location = :location, 
              owner = :owner, 
              event_start = :eventStart, 
              event_end = :eventEnd, 
              prereg_start = :preregStart, 
              prereg_end = :preregEnd 
          WHERE id = :id";
  $db->query($query, [
    ':title' => $title,
    ':location' => $location,
    ':owner' => $owner,
    ':eventStart' => $eventStart,
    ':eventEnd' => $eventEnd,
    ':preregStart' => $preregStart,
    ':preregEnd' => $preregEnd,
    ':id' => $id,
  ]);
}
