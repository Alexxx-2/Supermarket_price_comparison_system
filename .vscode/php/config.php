<?php
// config.php
// Main configuration file

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Leave empty if no password for XAMPP
define('DB_NAME', 'supermarket_price_comparison_db');

// Application configuration
define('APP_NAME', 'ShopCompare');
define('APP_URL', 'http://localhost/supermarket-api');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set timezone
date_default_timezone_set('Africa/Nairobi');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session (for admin login)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>