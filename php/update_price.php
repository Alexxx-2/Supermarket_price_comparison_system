<?php
// api/update_price.php - Update individual product price (Admin only)

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Check admin authentication
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

$id = isset($input['id']) ? (int)$input['id'] : 0;
$naivas = isset($input['naivas']) ? (float)$input['naivas'] : null;
$carrefour = isset($input['carrefour']) ? (float)$input['carrefour'] : null;
$quickmart = isset($input['quickmart']) ? (float)$input['quickmart'] : null;

if ($id <= 0 || $naivas === null || $carrefour === null || $quickmart === null) {
    sendResponse(['error' => 'Product ID and prices are required'], 400);
}

$conn = getDBConnection();

// Get old prices for history
$oldSql = "SELECT name, naivas_price, carrefour_price, quickmart_price FROM products WHERE id = ?";
$oldStmt = $conn->prepare($oldSql);
$oldStmt->bind_param("i", $id);
$oldStmt->execute();
$oldResult = $oldStmt->get_result();

if ($oldResult->num_rows === 0) {
    sendResponse(['error' => 'Product not found'], 404);
}

$old = $oldResult->fetch_assoc();

// Update prices
$sql = "UPDATE products SET naivas_price = ?, carrefour_price = ?, quickmart_price = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("dddi", $naivas, $carrefour, $quickmart, $id);

if (!$stmt->execute()) {
    sendResponse(['error' => 'Failed to update prices: ' . $conn->error], 500);
}

// Save price history
$supermarkets = ['naivas' => $naivas, 'carrefour' => $carrefour, 'quickmart' => $quickmart];
$oldPrices = ['naivas' => $old['naivas_price'], 'carrefour' => $old['carrefour_price'], 'quickmart' => $old['quickmart_price']];

foreach ($supermarkets as $supermarket => $newPrice) {
    if ($oldPrices[$supermarket] != $newPrice) {
        $historySql = "INSERT INTO price_history (product_id, supermarket, old_price, new_price, changed_by) VALUES (?, ?, ?, ?, ?)";
        $historyStmt = $conn->prepare($historySql);
        $historyStmt->bind_param("issdi", $id, $supermarket, $oldPrices[$supermarket], $newPrice, $_SESSION['user_id']);
        $historyStmt->execute();
    }
}

sendResponse([
    'success' => true,
    'message' => 'Prices updated successfully'
]);
?>