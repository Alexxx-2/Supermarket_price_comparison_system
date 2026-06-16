<?php
// api/reset_password.php - Reset password with code

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

$code = isset($input['code']) ? sanitizeInput($input['code']) : null;
$newPassword = isset($input['newPassword']) ? $input['newPassword'] : null;

if (!$code || !$newPassword) {
    sendResponse(['error' => 'Reset code and new password are required'], 400);
}

if (strlen($newPassword) < 6) {
    sendResponse(['error' => 'Password must be at least 6 characters'], 400);
}

$conn = getDBConnection();

// Find user with matching reset code
$sql = "SELECT id, email FROM users WHERE reset_token = ? AND reset_token_expires > NOW()";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Invalid or expired reset code'], 400);
}

$user = $result->fetch_assoc();

// Update password and clear reset code
$hashedPassword = hashPassword($newPassword);
$updateSql = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("si", $hashedPassword, $user['id']);

if ($updateStmt->execute()) {
    sendResponse([
        'success' => true,
        'message' => 'Password has been reset successfully'
    ]);
} else {
    sendResponse(['error' => 'Failed to reset password'], 500);
}
?>