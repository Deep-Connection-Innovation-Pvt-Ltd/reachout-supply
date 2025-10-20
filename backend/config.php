<?php

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$razorpay_key_id = $_ENV['RAZORPAY_KEY_ID'] ?? getenv('RAZORPAY_KEY_ID');
$razorpay_secret = $_ENV['RAZORPAY_KEY_SECRET'] ?? getenv('RAZORPAY_KEY_SECRET');

$host = "localhost";
$user = "root";          // your db username
$pass = "";              // your db password
$dbname = "reachout_professional";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// It's good practice to ensure the keys are loaded
if (!$razorpay_key_id || !$razorpay_secret) {
    // In a real app, you'd want to log this error, not die()
    die("Razorpay API keys are not configured in the .env file.");
}
?>