CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE updated_applications (
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
);