<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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
curl_setopt($ch, CURLOPT_USERPWD, $razorpay_key . ':' . $razorpay_secret);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$order = json_decode($response, true);

// Save preliminary order to DB (optional, for tracking)
if (isset($order['id'])) {
    $stmt = $conn->prepare("INSERT INTO orders (order_id, amount, currency, program_type, customer_name, customer_email, customer_phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'created')");
    $stmt->bind_param("sdsssss", $order['id'], $data['programPrice'], $order['currency'], $data['programType'], $data['name'], $data['email'], $data['phone']);
    $stmt->execute();
}

echo json_encode($order);
?>