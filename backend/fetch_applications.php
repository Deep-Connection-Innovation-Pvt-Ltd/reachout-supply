<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
require_once 'config.php';

try {
    $statusFilter = $_GET['status'] ?? 'all';
    
    // Check if we're getting new or updated applications
    if ($statusFilter === 'new') {
        // Get applications where created_at equals updated_at (not yet updated)
        $sql = "SELECT * FROM applications WHERE created_at = updated_at OR updated_at IS NULL";
    } elseif ($statusFilter === 'updated') {
        // Get applications where created_at is different from updated_at (has been updated)
        $sql = "SELECT * FROM applications WHERE created_at != updated_at";
    } else {
        // Get all applications if no specific status filter
        $sql = "SELECT * FROM applications";
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true, 
        'applications' => $applications
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Database error occurred',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'An error occurred',
        'error' => $e->getMessage()
    ]);
}
?>
