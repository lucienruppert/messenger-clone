<?php

require base_path('headers.php');

use Core\Database;

$json = file_get_contents('php://input');
$input = json_decode($json, true);

$email = $input['email'];

$config = require base_path('config.php');
$db = new Database($config['database'], $config['username'], $config['password']);

// Query to fetch basic event data
$query = "
    SELECT 
        e.id AS eventId,
        e.title,
        e.location,
        e.event_start,
        e.event_end,
        e.prereg_start,
        e.prereg_end
    FROM events e
    WHERE e.owner = :email
";

$players = $db->query($query, [':email' => $email])->get();

$events = [];

// Process event results and structure data
foreach ($players as $row) {
  $eventId = $row['eventId'];
  $events[$eventId] = [
    'id' => $eventId,
    'title' => $row['title'],
    'location' => $row['location'],
    'event_start' => $row['event_start'],
    'event_end' => $row['event_end'],
    'prereg_start' => $row['prereg_start'],
    'prereg_end' => $row['prereg_end'],
    'categories' => [],
    'extraFees' => []
  ];
}

// Query to fetch event categories
$categoryQuery = "
    SELECT 
        ec.eventId,
        ec.category,
        ec.categoryType,
        ec.rankingsType,
        ec.entryFeeType,
        ec.master,
        ec.pro,
        ec.rookie,
        ec.semiPro,
        ec.uniform
    FROM eventCategories ec
    JOIN events e ON ec.eventId = e.id
    WHERE e.owner = :email
";
$categoryResults = $db->query($categoryQuery, [':email' => $email])->get();

// Add categories to the respective events
foreach ($categoryResults as $row) {
  $eventId = $row['eventId'];
  if (isset($events[$eventId])) {
    $events[$eventId]['categories'][] = [
      'category' => $row['category'],
      'categoryType' => $row['categoryType'],
      'rankingsType' => $row['rankingsType'],
      'entryFeeType' => $row['entryFeeType'],
      'master' => $row['master'],
      'pro' => $row['pro'],
      'rookie' => $row['rookie'],
      'semiPro' => $row['semiPro'],
      'uniform' => $row['uniform']
    ];
  }
}

// Query to fetch extra fees
$feeQuery = "
    SELECT 
        ef.eventId,
        ef.extraFeeAmount,
        ef.extraFeeName
    FROM extraFees ef
    JOIN events e ON ef.eventId = e.id
    WHERE e.owner = :email
";
$feeResults = $db->query($feeQuery, [':email' => $email])->get();

// Add extra fees to the respective events
foreach ($feeResults as $row) {
  $eventId = $row['eventId'];
  if (isset($events[$eventId])) {
    $events[$eventId]['extraFees'][] = [
      'extraFeeAmount' => $row['extraFeeAmount'],
      'extraFeeName' => $row['extraFeeName']
    ];
  }
}

// Convert the events array to an indexed array (removing associative keys)
$events = array_values($events);
array_walk_recursive($events, 'trimArray');

// Return the response as JSON
echo json_encode($events);
