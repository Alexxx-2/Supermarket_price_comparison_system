<?php
// api/delete_basket.php - Delete a saved basket

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

$user_id = isAuthenticated();
if (!$user_id) {
    sendResponse(['error' => 'Unauthorized. Please login.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$basketId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($basketId <= 0) {
    sendResponse(['error' => 'Basket ID is required'], 400);
}

$conn = getDBConnection();

$sql = "DELETE FROM baskets WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $basketId, $user_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        sendResponse([
            'success' => true,
            'message' => 'Basket deleted successfully'
        ]);
    } else {
        sendResponse(['error' => 'Basket not found'], 404);
    }
} else {
    sendResponse(['error' => 'Failed to delete basket: ' . $conn->error], 500);
}
?>