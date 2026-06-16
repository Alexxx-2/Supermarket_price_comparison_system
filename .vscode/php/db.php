<?php
// includes/db.php
// Database connection file

require_once __DIR__ . '/../config.php';

function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        return $conn;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit();
    }
}

// Returns a JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Escapes input for safe SQL queries
function sanitize($conn, $input) {
    return $conn->real_escape_string($input);
}

// Checks if user is logged in (API token based)
function isAuthenticated() {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        return null;
    }
    
    // In production, validate JWT token here
    // For demo, check if token matches session user
    if (isset($_SESSION['user_id'])) {
        return $_SESSION['user_id'];
    }
    
    return null;
}
?>