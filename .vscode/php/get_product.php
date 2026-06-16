<?php
// api/get_product.php - Get single product by ID

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(['error' => 'Product ID is required'], 400);
}

$conn = getDBConnection();

$sql = "SELECT * FROM products WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Product not found'], 404);
}

sendResponse($result->fetch_assoc());
?>