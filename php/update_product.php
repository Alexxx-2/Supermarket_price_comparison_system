<?php
// api/update_product.php - Update product (Admin only)

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Check admin authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_email'] !== 'admin@shopcompare.com') {
    sendResponse(['error' => 'Unauthorized. Admin access required.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(['error' => 'Invalid JSON input'], 400);
}

$id = isset($input['id']) ? (int)$input['id'] : 0;
$name = isset($input['name']) ? sanitizeInput($input['name']) : null;
$category = isset($input['category']) ? sanitizeInput($input['category']) : null;
$naivas = isset($input['naivas']) ? (float)$input['naivas'] : null;
$carrefour = isset($input['carrefour']) ? (float)$input['carrefour'] : null;
$quickmart = isset($input['quickmart']) ? (float)$input['quickmart'] : null;

if ($id <= 0 || !$name || !$category || $naivas === null || $carrefour === null || $quickmart === null) {
    sendResponse(['error' => 'All fields are required'], 400);
}

$conn = getDBConnection();

// Check if product exists
$checkSql = "SELECT id FROM products WHERE id = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("i", $id);
$checkStmt->execute();

if ($checkStmt->get_result()->num_rows === 0) {
    sendResponse(['error' => 'Product not found'], 404);
}

$sql = "UPDATE products SET name = ?, category = ?, naivas_price = ?, carrefour_price = ?, quickmart_price = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdddi", $name, $category, $naivas, $carrefour, $quickmart, $id);

if ($stmt->execute()) {
    sendResponse([
        'success' => true,
        'message' => 'Product updated successfully'
    ]);
} else {
    sendResponse(['error' => 'Failed to update product: ' . $conn->error], 500);
}
?>