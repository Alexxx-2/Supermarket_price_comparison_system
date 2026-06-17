<?php
// api/get_stats.php - Get dashboard statistics (Admin only)

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Check admin authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_email'] !== 'admin@shopcompare.com') {
    sendResponse(['error' => 'Unauthorized. Admin access required.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$conn = getDBConnection();

$stats = [];

// Total products
$result = $conn->query("SELECT COUNT(*) as count FROM products");
$stats['total_products'] = (int)$result->fetch_assoc()['count'];

// Total users (excluding admin)
$result = $conn->query("SELECT COUNT(*) as count FROM users WHERE email != 'admin@shopcompare.com'");
$stats['total_users'] = (int)$result->fetch_assoc()['count'];

// Total baskets
$result = $conn->query("SELECT COUNT(*) as count FROM baskets");
$stats['total_baskets'] = (int)$result->fetch_assoc()['count'];

// Supermarket popularity (simulated)
$stats['supermarket_stats'] = [
    'naivas' => rand(30, 45),
    'carrefour' => rand(25, 40),
    'quickmart' => rand(20, 35)
];

sendResponse($stats);
?>