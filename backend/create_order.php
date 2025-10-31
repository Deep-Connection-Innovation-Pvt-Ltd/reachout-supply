<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$amount = $data['amount'] * 100; // Razorpay expects paise

$orderData = [
    'amount' => $amount,
    'currency' => 'INR',
    'receipt' => 'receipt_' . uniqid(),
];

// Create Razorpay order using cURL
$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt($ch, CURLOPT_USERPWD, $razorpay_key_id . ':' . $razorpay_secret);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$order = json_decode($response, true);

// Save preliminary order to DB (optional, for tracking)
if (isset($order['id'])) {
    $stmt = $pdo->prepare("INSERT INTO orders (order_id, amount, currency, program_type, customer_name, customer_email, customer_phone, status) VALUES (:order_id, :amount, :currency, :program_type, :customer_name, :customer_email, :customer_phone, 'created')");
    $stmt->execute([
        ':order_id' => $order['id'],
        ':amount' => $data['programPrice'],
        ':currency' => $order['currency'],
        ':program_type' => $data['programType'],
        ':customer_name' => $data['name'],
        ':customer_email' => $data['email'],
        ':customer_phone' => $data['phone']
    ]);
}

// Add the public key_id to the response for the frontend
$order['key_id'] = $razorpay_key_id;

echo json_encode($order);
?>