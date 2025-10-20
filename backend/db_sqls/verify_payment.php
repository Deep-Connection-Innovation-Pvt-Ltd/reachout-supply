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
    $stmt = $conn->prepare("UPDATE orders SET payment_id=?, payment_signature=?, status='paid', paid_amount=? WHERE order_id=?");
    $stmt->bind_param("ssds", $payment_id, $signature, $data['amount'], $order_id);
    $stmt->execute();

    // Also insert into applications table
    // Corrected to match the 13 fields being sent from the frontend, letting `order_id`, `created_at`, `updated_at` be handled by the DB.
    $stmt2 = $conn->prepare("INSERT INTO applications (name, email, phone, university, graduationYear, postUniversity, postGraduationYear, mastersPursuing, areaOfExpertise, programType, paymentAmount, rci, cvUpload, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')");
    $stmt2->bind_param("ssssssssssdss", // 13 letters for 13 values
        $data['fullName'],
        $data['email'],
        $data['phone'],
        $data['graduationCollege'],
        $data['graduationYear'],
        $data['postGraduationCollege'],
        $data['postGraduationYear'],
        $data['masters_program'],
        $data['area_of_expertise'],
        $data['programType'],
        $data['amount'],
        $data['rciLicense'],
        $data['resumeFileName']
    );
    $stmt2->execute();

    echo json_encode(["success" => true, "message" => "Payment verified and stored"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid signature"]);
}
?>