<?php
// api/register.php - Handle user registration

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(['error' => 'Invalid JSON input'], 400);
}

$fullname = isset($input['fullname']) ? sanitizeInput($input['fullname']) : null;
$email = isset($input['email']) ? sanitizeInput($input['email']) : null;
$password = isset($input['password']) ? $input['password'] : null;
$location = isset($input['location']) ? sanitizeInput($input['location']) : null;

if (!$fullname || !$email || !$password) {
    sendResponse(['error' => 'Fullname, email, and password are required'], 400);
}

if (!validateEmail($email)) {
    sendResponse(['error' => 'Invalid email format'], 400);
}

if (strlen($password) < 6) {
    sendResponse(['error' => 'Password must be at least 6 characters'], 400);
}

$conn = getDBConnection();

// Check if email already exists
$checkSql = "SELECT id FROM users WHERE email = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $email);
$checkStmt->execute();

if ($checkStmt->get_result()->num_rows > 0) {
    sendResponse(['error' => 'Email already registered'], 409);
}

$hashedPassword = hashPassword($password);

$sql = "INSERT INTO users (fullname, email, password, location, registered_at) VALUES (?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $fullname, $email, $hashedPassword, $location);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    sendResponse([
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'id' => $userId,
            'fullname' => $fullname,
            'email' => $email,
            'location' => $location
        ]
    ]);
} else {
    sendResponse(['error' => 'Registration failed: ' . $conn->error], 500);
}
?>