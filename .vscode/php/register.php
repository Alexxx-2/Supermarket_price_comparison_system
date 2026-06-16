<?php
// api/register.php - Handle user registration

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get raw POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

$fullname = isset($input['fullname']) ? sanitizeInput($input['fullname']) : null;
$email = isset($input['email']) ? sanitizeInput($input['email']) : null;
$password = isset($input['password']) ? $input['password'] : null;
$location = isset($input['location']) ? sanitizeInput($input['location']) : null;

if (!$fullname || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Fullname, email, and password are required']);
    exit();
}

if (!validateEmail($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters']);
    exit();
}

$conn = getDBConnection();

// Check if email already exists
$checkSql = "SELECT id FROM users WHERE email = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $email);
$checkStmt->execute();

if ($checkStmt->get_result()->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    exit();
}

$hashedPassword = hashPassword($password);

$sql = "INSERT INTO users (fullname, email, password, location, registered_at) VALUES (?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $fullname, $email, $hashedPassword, $location);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    http_response_code(200);
    echo json_encode([
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
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed: ' . $conn->error]);
}
?>