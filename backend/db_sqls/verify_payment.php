<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'config.php';
$data = json_decode(file_get_contents("php://input"), true);

$order_id = $data['order_id'];
$payment_id = $data['payment_id'];
$signature = $data['signature'];

// Verify signature
$generated_signature = hash_hmac('sha256', $order_id . "|" . $payment_id, $razorpay_secret);

if ($generated_signature === $signature) {
    // Update order details
    $stmt = $conn->prepare("UPDATE orders SET payment_id=?, payment_signature=?, status='paid', paid_amount=amount WHERE order_id=?");
    $stmt->bind_param("sss", $payment_id, $signature, $order_id);
    $stmt->execute();

    // Also insert into applications table
    $stmt2 = $conn->prepare("INSERT INTO applications (order_id, name, email, phone, university, graduationYear, postUniversity, postGraduationYear, mastersPursuing, areaOfExpertise, programType, paymentAmount, rci, cvUpload, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')");
    $stmt2->bind_param("ssssssssssssss",
        $order_id,
        $data['name'],
        $data['email'],
        $data['phone'],
        $data['university'],
        $data['graduationYear'],
        $data['postUniversity'],
        $data['postGraduationYear'],
        $data['mastersPursuing'],
        $data['areaOfExpertise'],
        $data['programType'],
        $data['amount'],
        $data['rci'],
        $data['cvUpload']
    );
    $stmt2->execute();

    echo json_encode(["success" => true, "message" => "Payment verified and stored"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid signature"]);
}
?>