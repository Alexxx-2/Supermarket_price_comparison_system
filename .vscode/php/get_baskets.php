<?php
// api/get_baskets.php - Get all saved baskets for a user

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

$user_id = isAuthenticated();
if (!$user_id) {
    sendResponse(['error' => 'Unauthorized. Please login.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$conn = getDBConnection();

$sql = "SELECT id, basket_name, items, created_at FROM baskets WHERE user_id = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$baskets = [];
while ($row = $result->fetch_assoc()) {
    $row['items'] = json_decode($row['items']);
    $baskets[] = $row;
}

sendResponse($baskets);
?>