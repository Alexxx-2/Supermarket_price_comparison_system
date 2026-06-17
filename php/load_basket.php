<?php
// api/load_basket.php - Load a specific saved basket

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

$user_id = isAuthenticated();
if (!$user_id) {
    sendResponse(['error' => 'Unauthorized. Please login.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$basketId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($basketId <= 0) {
    sendResponse(['error' => 'Basket ID is required'], 400);
}

$conn = getDBConnection();

$sql = "SELECT id, basket_name, items FROM baskets WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $basketId, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Basket not found'], 404);
}

$basket = $result->fetch_assoc();
$basket['items'] = json_decode($basket['items']);

sendResponse($basket);
?>