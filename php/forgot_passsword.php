<?php
// api/forgot_password.php - Request password reset

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(['error' => 'Invalid JSON input'], 400);
}

$email = isset($input['email']) ? sanitizeInput($input['email']) : null;

if (!$email || !validateEmail($email)) {
    sendResponse(['error' => 'Valid email is required'], 400);
}

$conn = getDBConnection();

// Check if user exists
$sql = "SELECT id, name, email FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Always return success for security (don't reveal if email exists)
    sendResponse(['success' => true, 'message' => 'If this email exists, a reset code has been sent']);
}

$user = $result->fetch_assoc();

// Generate reset code and store in database
$resetCode = generateResetCode();
$expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

$updateSql = "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("ssi", $resetCode, $expiresAt, $user['id']);
$updateStmt->execute();

// In production, send email here
// For now, return the code in response (simulate email)
sendResponse([
    'success' => true,
    'message' => 'Reset code sent to your email',
    'reset_code' => $resetCode // Remove in production, this should be sent via email
]);
?>