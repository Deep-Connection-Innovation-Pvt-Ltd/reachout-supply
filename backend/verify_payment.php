<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
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

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'error' => ''
];

try {
    // Check if the request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method. Only POST is allowed.');
    }

    // Get form data
    $order_id = $_POST['order_id'] ?? '';
    $payment_id = $_POST['payment_id'] ?? '';
    $signature = $_POST['signature'] ?? '';
    $amount = floatval($_POST['amount'] ?? 0);

    // Validate required fields
    if (empty($order_id) || empty($payment_id) || empty($signature)) {
        throw new Exception('Missing required payment verification data.');
    }

    // Verify signature
    $generated_signature = hash_hmac('sha256', $order_id . "|" . $payment_id, $razorpay_secret);

    if ($generated_signature !== $signature) {
        throw new Exception('Invalid payment signature.');
    }

    // Start transaction
    $pdo->beginTransaction();

    try {
        // Update order details
        $stmt = $pdo->prepare("UPDATE orders SET payment_id = :payment_id, payment_signature = :signature, status = 'paid', paid_amount = :amount, updated_at = NOW() WHERE order_id = :order_id");
        
        $stmt->execute([
            ':payment_id' => $payment_id,
            ':signature' => $signature,
            ':amount' => $amount,
            ':order_id' => $order_id
        ]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception('Failed to update order: ' . $stmt->error);
        }
        // Insert into applications table
        $stmt2 = $pdo->prepare("INSERT INTO applications (
            name, email, phone, university, graduationYear, 
            postUniversity, postGraduationYear, mastersPursuing, 
            areaOfExpertise, programType, paymentAmount, rci, 
            cvUpload, status, created_at, updated_at
        ) VALUES (
            :name, :email, :phone, :university, :graduationYear, 
            :postUniversity, :postGraduationYear, :mastersPursuing, 
            :areaOfExpertise, :programType, :paymentAmount, :rciLicense, 
            :resumeFileName, 'new', NOW(), NOW()
        )");

        if (!$stmt2) {
            throw new Exception('Failed to prepare application insert statement.');
        }

        // Handle file upload
        $uploadDir = __DIR__ . '/uploads/';
        $resumePath = '';
        
        // Create uploads directory if it doesn't exist
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                throw new Exception('Failed to create upload directory');
            }
        }

        // Process file upload if exists
        if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['resume']['tmp_name'];
            $fileName = $_FILES['resume']['name'];
            $fileSize = $_FILES['resume']['size'];
            $fileType = $_FILES['resume']['type'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));

            // Sanitize file name
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            
            // Check if file type is allowed
            $allowedExtensions = ['pdf', 'doc', 'docx'];
            if (!in_array($fileExtension, $allowedExtensions)) {
                throw new Exception('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
            }

            // Check file size (5MB max)
            $maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
            if ($fileSize > $maxFileSize) {
                throw new Exception('File size is too large. Maximum size allowed is 5MB.');
            }

            // Move the uploaded file to the upload directory
            $destPath = $uploadDir . $newFileName;
            if (move_uploaded_file($fileTmpPath, $destPath)) {
                $resumePath = 'uploads/' . $newFileName; // Relative path for database
            } else {
                throw new Exception('There was an error uploading your file.');
            }
        } else if (empty($_POST['resumeFileName'])) {
            throw new Exception('No file was uploaded or there was an upload error.');
        } else {
            // If no new file but we have a filename, use the existing one
            $resumePath = $_POST['resumeFileName'];
        }

        // Get form data
        $formData = [
            'fullName' => $_POST['fullName'] ?? '',
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'graduationCollege' => $_POST['graduationCollege'] ?? '',
            'graduationYear' => $_POST['graduationYear'] ?? '',
            'postGraduationCollege' => $_POST['postGraduationCollege'] ?? '',
            'postGraduationYear' => $_POST['postGraduationYear'] ?? '',
            'masters_program' => $_POST['masters_program'] ?? '',
            'area_of_expertise' => $_POST['area_of_expertise'] ?? '',
            'programType' => $_POST['programType'] ?? '',
            'rciLicense' => $_POST['rciLicense'] ?? '',
            'resumeFileName' => $resumePath // Use the processed file path
        ];

        $stmt2->execute([
            ':name' => $formData['fullName'],
            ':email' => $formData['email'],
            ':phone' => $formData['phone'],
            ':university' => $formData['graduationCollege'],
            ':graduationYear' => $formData['graduationYear'],
            ':postUniversity' => $formData['postGraduationCollege'],
            ':postGraduationYear' => $formData['postGraduationYear'],
            ':mastersPursuing' => $formData['masters_program'],
            ':areaOfExpertise' => $formData['area_of_expertise'],
            ':programType' => $formData['programType'],
            ':paymentAmount' => $amount,
            ':rciLicense' => $formData['rciLicense'],
            ':resumeFileName' => $formData['resumeFileName']
        ]);

        // Commit transaction
        $pdo->commit();

        $response = [
            'success' => true,
            'message' => 'Payment verified and application submitted successfully.',
            'order_id' => $order_id
        ];

    } catch (Exception $e) {
// Rollback transaction on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(400);
    $response = [
        'success' => false,
        'message' => 'Payment verification failed.',
        'error' => $e->getMessage()
    ];
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);

// Close connection
if (isset($conn)) {
    $conn->close();
}
?>
