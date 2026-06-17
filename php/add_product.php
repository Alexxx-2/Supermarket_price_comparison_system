<?php
// api/add_product.php - Add new product (Admin only)

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Check admin authentication (simple check)
if (!isset($_SESSION['user_id']) || $_SESSION['user_email'] !== 'admin@shopcompare.com') {
    sendResponse(['error' => 'Unauthorized. Admin access required.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(['error' => 'Invalid JSON input'], 400);
}

$name = isset($input['name']) ? sanitizeInput($input['name']) : null;
$category = isset($input['category']) ? sanitizeInput($input['category']) : null;
$naivas = isset($input['naivas']) ? (float)$input['naivas'] : null;
$carrefour = isset($input['carrefour']) ? (float)$input['carrefour'] : null;
$quickmart = isset($input['quickmart']) ? (float)$input['quickmart'] : null;

if (!$name || !$category || $naivas === null || $carrefour === null || $quickmart === null) {
    sendResponse(['error' => 'All fields are required'], 400);
}

$conn = getDBConnection();

$sql = "INSERT INTO products (name, category, naivas_price, carrefour_price, quickmart_price) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssddd", $name, $category, $naivas, $carrefour, $quickmart);

if ($stmt->execute()) {
    sendResponse([
        'success' => true,
        'message' => 'Product added successfully',
        'id' => $conn->insert_id
    ]);
} else {
    sendResponse(['error' => 'Failed to add product: ' . $conn->error], 500);
}
?>