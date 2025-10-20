<?php

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$razorpay_key = $_ENV['RAZORPAY_KEY_ID'] ?? getenv('RAZORPAY_KEY_ID');
$razorpay_secret = $_ENV['RAZORPAY_KEY_SECRET'] ?? getenv('RAZORPAY_KEY_SECRET');

$host = "localhost";
$user = "root";          // your db username
$pass = "";              // your db password
$dbname = "reachout_professional";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>