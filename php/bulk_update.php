<?php
// api/bulk_update.php - Bulk update prices via CSV (Admin only)

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Check admin authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_email'] !== 'admin@shopcompare.com') {
    sendResponse(['error' => 'Unauthorized. Admin access required.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(['error' => 'File upload failed'], 400);
}

$file = $_FILES['file'];

// Check file type
$fileType = mime_content_type($file['tmp_name']);
if ($fileType !== 'text/csv' && $fileType !== 'text/plain') {
    sendResponse(['error' => 'Only CSV files are allowed'], 400);
}

$conn = getDBConnection();

$handle = fopen($file['tmp_name'], 'r');
$header = fgetcsv($handle); // Skip header row

$updated = 0;
$errors = [];

while (($row = fgetcsv($handle)) !== false) {
    if (count($row) < 5) continue;
    
    $name = trim($row[0]);
    $naivas = (float)trim($row[2]);
    $carrefour = (float)trim($row[3]);
    $quickmart = (float)trim($row[4]);
    
    if ($name && !is_nan($naivas) && !is_nan($carrefour) && !is_nan($quickmart)) {
        // Check if product exists
        $checkSql = "SELECT id FROM products WHERE name = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("s", $name);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($rowResult = $result->fetch_assoc()) {
            $id = $rowResult['id'];
            $updateSql = "UPDATE products SET naivas_price = ?, carrefour_price = ?, quickmart_price = ? WHERE id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("dddi", $naivas, $carrefour, $quickmart, $id);
            if ($updateStmt->execute()) {
                $updated++;
            } else {
                $errors[] = "Failed to update: $name";
            }
        } else {
            $errors[] = "Product not found: $name";
        }
    }
}

fclose($handle);

sendResponse([
    'success' => true,
    'updated' => $updated,
    'errors' => $errors,
    'message' => "Successfully updated $updated products"
]);
?>