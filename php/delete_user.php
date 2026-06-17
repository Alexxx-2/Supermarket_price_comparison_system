<?php
// api/delete_user.php - Delete a user (Admin only)

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Check admin authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_email'] !== 'admin@shopcompare.com') {
    sendResponse(['error' => 'Unauthorized. Admin access required.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$userId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($userId <= 0) {
    sendResponse(['error' => 'User ID is required'], 400);
}

$conn = getDBConnection();

$sql = "DELETE FROM users WHERE id = ? AND email != 'admin@shopcompare.com'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        sendResponse([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } else {
        sendResponse(['error' => 'User not found or cannot delete admin'], 404);
    }
} else {
    sendResponse(['error' => 'Failed to delete user: ' . $conn->error], 500);
}
?>