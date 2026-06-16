<?php
// api/sync_users.php - Sync users from frontend localStorage

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['users'])) {
    sendResponse(['error' => 'Invalid input'], 400);
}

$conn = getDBConnection();

$synced = 0;
$errors = [];

foreach ($input['users'] as $userData) {
    $fullname = sanitizeInput($userData['fullname'] ?? '');
    $email = sanitizeInput($userData['email'] ?? '');
    $password = $userData['password'] ?? '';
    $location = sanitizeInput($userData['location'] ?? '');
    
    if (!$fullname || !$email || !validateEmail($email)) {
        continue;
    }
    
    // Check if user exists
    $checkSql = "SELECT id FROM users WHERE email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        $hashedPassword = $password ? hashPassword($password) : '';
        
        $insertSql = "INSERT INTO users (fullname, email, password, location, registered_at) VALUES (?, ?, ?, ?, NOW())";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param("ssss", $fullname, $email, $hashedPassword, $location);
        
        if ($insertStmt->execute()) {
            $synced++;
        } else {
            $errors[] = "Failed to sync: $email";
        }
    }
}

sendResponse([
    'success' => true,
    'synced' => $synced,
    'errors' => $errors,
    'message' => "Synced $synced users"
]);
?>