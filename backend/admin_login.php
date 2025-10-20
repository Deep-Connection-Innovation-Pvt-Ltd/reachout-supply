<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include 'config.php'; // Include your database configuration

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        $response['message'] = 'Username and password are required.';
        echo json_encode($response);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE name = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin && password_verify($password, $admin['password'])) {
            // Login successful
            // For simplicity, we'll just return success. In a real application, you'd set a session or JWT.
            $response['success'] = true;
            $response['message'] = 'Login successful.';
        } else {
            $response['message'] = 'Invalid username or password.';
        }
    } catch (PDOException $e) {
        $response['message'] = 'Database error: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
