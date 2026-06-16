<?php
// api/delete_product.php - Delete product (Admin only)

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

// Check admin authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_email'] !== 'admin@shopcompare.com') {
    sendResponse(['error' => 'Unauthorized. Admin access required.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(['error' => 'Product ID is required'], 400);
}

$conn = getDBConnection();

$sql = "DELETE FROM products WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        sendResponse([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    } else {
        sendResponse(['error' => 'Product not found'], 404);
    }
} else {
    sendResponse(['error' => 'Failed to delete product: ' . $conn->error], 500);
}
?>