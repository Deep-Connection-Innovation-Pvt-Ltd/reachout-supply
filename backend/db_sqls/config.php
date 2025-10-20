<?php
$host = "localhost";
$user = "root";          // your db username
$pass = "";              // your db password
$dbname = "reachout_professional";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Razorpay keys
$razorpay_key = "rzp_test_rZe0zUGpvux0SS";
$razorpay_secret = "gx0mRXVimvuLnGYEyJ1X8eI3";
?>