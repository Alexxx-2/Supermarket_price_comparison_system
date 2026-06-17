<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'supermarket_price_comparison_db');
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
} else {
    echo json_encode(['success' => 'Database connected']);
}
$conn->close();
?>