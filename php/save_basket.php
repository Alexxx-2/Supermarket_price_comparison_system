<?php
// api/save_basket.php - Save a shopping basket

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Check authentication
$user_id = isAuthenticated();
if (!$user_id) {
    sendResponse(['error' => 'Unauthorized. Please login.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(['error' => 'Invalid JSON input'], 400);
}

$basketName = isset($input['basket_name']) ? sanitizeInput($input['basket_name']) : null;
$items = isset($input['items']) ? $input['items'] : null;

if (!$basketName || !$items) {
    sendResponse(['error' => 'Basket name and items are required'], 400);
}

$conn = getDBConnection();

// Check if basket with same name exists for this user
$checkSql = "SELECT id FROM baskets WHERE user_id = ? AND basket_name = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("is", $user_id, $basketName);
$checkStmt->execute();

if ($checkStmt->get_result()->num_rows > 0) {
    sendResponse(['error' => 'A basket with this name already exists'], 409);
}

$itemsJson = json_encode($items);

$sql = "INSERT INTO baskets (user_id, basket_name, items) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $user_id, $basketName, $itemsJson);

if ($stmt->execute()) {
    sendResponse([
        'success' => true,
        'message' => 'Basket saved successfully',
        'basket_id' => $conn->insert_id
    ]);
} else {
    sendResponse(['error' => 'Failed to save basket: ' . $conn->error], 500);
}
?>