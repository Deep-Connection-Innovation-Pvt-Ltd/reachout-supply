<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'config.php';
$order_id = $_GET['order_id'] ?? '';

if ($order_id) {
    $sql = "SELECT * FROM orders WHERE order_id='$order_id'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Order not found"]);
    }
} else {
    echo json_encode(["error" => "No order ID provided"]);
}
?>