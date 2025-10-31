<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow requests from your frontend development server
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
require_once 'config.php';

try {
    // Get JSON input
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->order_id) || !isset($data->status)) {
        throw new Exception("Missing order_id or status");
    }

    $order_id = $data->order_id;
    $newStatus = $data->status;
    $currentDateTime = date('Y-m-d H:i:s');

    // Ensure updated_applications table exists with the correct structure
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS updated_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        university VARCHAR(150),
        graduationYear YEAR,
        postUniversity VARCHAR(150),
        postGraduationYear YEAR,
        mastersPursuing VARCHAR(150),
        areaOfExpertise VARCHAR(150),
        programType VARCHAR(100) NOT NULL,
        paymentAmount DECIMAL(10,2) DEFAULT 0.00,
        rci ENUM('Yes', 'No') NOT NULL DEFAULT 'No',
        cvUpload VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    $pdo->exec($createTableSQL);
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Debug log
    error_log("Updating status for order_id: $order_id to status: $newStatus");

    try {
        // 1. Get current application data
        $stmt = $pdo->prepare("SELECT * FROM applications WHERE order_id = :order_id");
        $stmt->execute([':order_id' => $order_id]);
        $application = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$application) {
            throw new Exception("Application not found with order_id: $order_id");
        }

        // 2. Update status and updated_at in the applications table
        $stmt = $pdo->prepare("UPDATE applications SET status = :status, updated_at = :updated_at WHERE order_id = :order_id");
        $stmt->execute([
            ':status' => $newStatus,
            ':updated_at' => $currentDateTime,
            ':order_id' => $order_id
        ]);

        // 3. Prepare application data for insert/update
        $appData = [
            'order_id' => $order_id,
            'name' => $application['name'] ?? '',
            'email' => $application['email'] ?? '',
            'phone' => $application['phone'] ?? '',
            'university' => $application['university'] ?? null,
            'graduationYear' => $application['graduationYear'] ?? null,
            'postUniversity' => $application['postUniversity'] ?? null,
            'postGraduationYear' => $application['postGraduationYear'] ?? null,
            'mastersPursuing' => $application['mastersPursuing'] ?? null,
            'areaOfExpertise' => $application['areaOfExpertise'] ?? null,
            'programType' => $application['programType'] ?? '',
            'paymentAmount' => $application['paymentAmount'] ?? 0.00,
            'rci' => $application['rci'] ?? 'No',
            'cvUpload' => $application['cvUpload'] ?? null,
            'status' => $newStatus,
            'created_at' => $application['created_at'] ?? $currentDateTime,
            'updated_at' => $currentDateTime
        ];

        // 4. Check if the application already exists in updated_applications
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM updated_applications WHERE order_id = :order_id");
        $stmt->execute([':order_id' => $order_id]);
        $exists = $stmt->fetchColumn() > 0;
        
        error_log("Checking if order_id $order_id exists in updated_applications: " . ($exists ? 'Yes' : 'No'));

        if (!$exists) {
            // Insert into updated_applications with all fields
            $columns = implode(', ', array_keys($appData));
            $placeholders = ':' . implode(', :', array_keys($appData));
            
            $sql = "INSERT INTO updated_applications ($columns) VALUES ($placeholders)";
            $stmt = $pdo->prepare($sql);
            
            // Bind all parameters
            foreach ($appData as $key => $value) {
                $stmt->bindValue(":$key", $value);
            }
            
            $result = $stmt->execute();
            error_log("Insert into updated_applications result: " . ($result ? 'Success' : 'Failed'));
            
            if (!$result) {
                $error = $stmt->errorInfo();
                error_log("Insert error: " . print_r($error, true));
                throw new Exception("Failed to insert into updated_applications: " . ($error[2] ?? 'Unknown error'));
            }
        } else {
            // Update existing record in updated_applications
            unset($appData['created_at']); // Don't update created_at
            $updates = [];
            foreach (array_keys($appData) as $key) {
                if ($key !== 'order_id') { // Don't include order_id in SET clause
                    $updates[] = "$key = :$key";
                }
            }
            $updates = implode(', ', $updates);
            
            $sql = "UPDATE updated_applications SET $updates WHERE order_id = :order_id";
            $stmt = $pdo->prepare($sql);
            
            // Bind all parameters
            foreach ($appData as $key => $value) {
                $stmt->bindValue(":$key", $value);
            }
            
            $result = $stmt->execute();
            error_log("Update updated_applications result: " . ($result ? 'Success' : 'Failed'));
            
            if (!$result) {
                $error = $stmt->errorInfo();
                error_log("Update error: " . print_r($error, true));
                throw new Exception("Failed to update updated_applications: " . ($error[2] ?? 'Unknown error'));
            }
        }

        // Commit the transaction
        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Application status updated successfully',
            'order_id' => $order_id,
            'new_status' => $newStatus
        ]);

    } catch (Exception $e) {
        // Rollback the transaction on error
        $pdo->rollBack();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred',
        'error' => $e->getMessage()
    ]);
}
?>
                throw new Exception("Failed to prepare insert statement for updated_applications: " . $conn->error);
            }
            $insertStmt->bind_param(
                "isssssissssssssss",
                $application['order_id'],
                $application['name'],
                $application['email'],
                $application['phone'],
                $application['university'],
                $application['graduationYear'],
                $application['postUniversity'],
                $application['postGraduationYear'],
                $application['mastersPursuing'],
                $application['areaOfExpertise'],
                $application['programType'],
                $application['paymentAmount'],
                $application['rci'],
                $application['cvUpload'],
                $application['status'],
                $application['created_at'],
                $application['updated_at']
            );
            $insertStmt->execute();
            $insertStmt->close();
        }
    } else {
        // If already in updated_applications, just update its status and updated_at
        $stmt = $conn->prepare("UPDATE updated_applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?");
        if ($stmt === false) {
            throw new Exception("Failed to prepare update statement for updated_applications: " . $conn->error);
        }
        $stmt->bind_param("si", $newStatus, $order_id);
        $stmt->execute();
        $stmt->close();
    }

    // Commit transaction
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Application status updated successfully."]);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
