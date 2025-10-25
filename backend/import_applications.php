<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS setup — same as create_order.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'config.php'; // contains your $pdo connection

// Read incoming JSON
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['rows']) || !is_array($input['rows'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid data format. Expected JSON with "rows" array.']);
    exit();
}

$rows = $input['rows'];
if (empty($rows)) {
    echo json_encode(['status' => 'error', 'message' => 'No rows found to import.']);
    exit();
}

try {
    $pdo->beginTransaction();

    // Prepare insert statement for the applications table
    $stmt = $pdo->prepare("
        INSERT INTO applications (name, email, phone, job_id, status, created_at)
        VALUES (:name, :email, :phone, :job_id, :status, NOW())
    ");

    $inserted = 0;
    foreach ($rows as $r) {
        // Clean and validate data
        $name = trim($r['name'] ?? '');
        $email = trim($r['email'] ?? '');
        $phone = trim($r['phone'] ?? '');
        $job_id = isset($r['job_id']) && $r['job_id'] !== '' ? intval($r['job_id']) : null;
        $status = $r['status'] ?? 'new';

        // Skip invalid rows
        if ($name === '' && $email === '') {
            continue;
        }

        // Optional: check for duplicate emails
        $check = $pdo->prepare("SELECT id FROM applications WHERE email = :email LIMIT 1");
        $check->execute(['email' => $email]);
        if ($check->fetch()) {
            continue; // skip duplicates
        }

        // Execute insert
        $stmt->execute([
            ':name' => $name ?: null,
            ':email' => $email ?: null,
            ':phone' => $phone ?: null,
            ':job_id' => $job_id,
            ':status' => $status,
        ]);

        $inserted++;
    }

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => "$inserted rows imported successfully.",
        'inserted' => $inserted
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
