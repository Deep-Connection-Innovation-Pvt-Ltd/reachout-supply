<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow requests from your frontend development server
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

include 'config.php'; // Include your database configuration

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

    // Extract form data
    $formData = [
        'fullName' => $_POST['fullName'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'rciLicense' => $_POST['rciLicense'] ?? '',
        'graduationCollege' => $_POST['graduationCollege'] ?? '',
        'graduationYear' => $_POST['graduationYear'] ?? '',
        'postGraduationCollege' => $_POST['postGraduationCollege'] ?? '',
        'postGraduationYear' => $_POST['postGraduationYear'] ?? '',
        'masters_program' => $_POST['masters_program'] ?? '',
        'area_of_expertise' => $_POST['area_of_expertise'] ?? '',
        'other_expertise' => $_POST['other_expertise'] ?? '', // Handle if 'Others' is selected
        'programType' => $_POST['programType'] ?? '',
        'paymentAmount' => floatval($_POST['paymentAmount'] ?? 0),
        'status' => $_POST['status'] ?? 'pending_payment' // Default to pending_payment
    ];

    // Handle file upload
    $uploadDir = __DIR__ . '/uploads/';
    $resumePath = null;
    
    // Create uploads directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Failed to create upload directory');
        }
    }

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
    }

    // Insert into applications table
    $stmt = $pdo->prepare("INSERT INTO applications (
        name, email, phone, university, graduationYear, 
        postUniversity, postGraduationYear, mastersPursuing, 
        areaOfExpertise, programType, paymentAmount, rci, 
        cvUpload, status, created_at, updated_at
    ) VALUES (
        :name, :email, :phone, :university, :graduationYear, 
        :postUniversity, :postGraduationYear, :mastersPursuing, 
        :areaOfExpertise, :programType, :paymentAmount, :rciLicense, 
        :cvUpload, :status, NOW(), NOW()
    )");

    $stmt->execute([
        ':name' => $formData['fullName'],
        ':email' => $formData['email'],
        ':phone' => $formData['phone'],
        ':university' => $formData['graduationCollege'],
        ':graduationYear' => $formData['graduationYear'],
        ':postUniversity' => $formData['postGraduationCollege'],
        ':postGraduationYear' => $formData['postGraduationYear'],
        ':mastersPursuing' => $formData['masters_program'],
        ':areaOfExpertise' => $formData['area_of_expertise'] === 'Others (please specify)' ? $formData['other_expertise'] : $formData['area_of_expertise'],
        ':programType' => $formData['programType'],
        ':paymentAmount' => $formData['paymentAmount'],
        ':rciLicense' => $formData['rciLicense'],
        ':cvUpload' => $resumePath,
        ':status' => $formData['status']
    ]);

    $response['success'] = true;
    $response['message'] = 'Application submitted successfully with pending payment.';

} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = 'Application submission failed.';
    $response['error'] = $e->getMessage();
}

// Return JSON response
echo json_encode($response);

// Close connection
if (isset($conn)) {
    $conn->close();
}
?>