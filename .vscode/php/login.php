<?php
// api/login.php - Handle user login

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

$email = isset($input['email']) ? sanitizeInput($input['email']) : null;
$password = isset($input['password']) ? $input['password'] : null;

if (!$email || !$password) {
    sendResponse(['error' => 'Email and password are required'], 400);
}

if (!validateEmail($email)) {
    sendResponse(['error' => 'Invalid email format'], 400);
}

$conn = getDBConnection();

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Invalid email or password'], 401);
}

$user = $result->fetch_assoc();

if (!verifyPassword($password, $user['password'])) {
    sendResponse(['error' => 'Invalid email or password'], 401);
}

// Start session and store user
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_name'] = $user['fullname'];

// Generate a simple token (in production, use JWT)
$token = generateToken();
$_SESSION['api_token'] = $token;

sendResponse([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'fullname' => $user['fullname'],
        'email' => $user['email'],
        'location' => $user['location'],
        'registeredAt' => $user['registered_at']
    ],
    'token' => $token
]);
?>