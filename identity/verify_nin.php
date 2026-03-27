<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
$nin = isset($input['nin']) ? trim($input['nin']) : '';

// Response array
$response = [
    'success' => false,
    'message' => '',
    'data' => null
];

// Validate NIN format (11 digits)
if (empty($nin)) {
    $response['message'] = 'NIN is required';
    echo json_encode($response);
    exit;
}

if (!preg_match('/^\d{11}$/', $nin)) {
    $response['message'] = 'Invalid NIN format. NIN must be 11 digits';
    echo json_encode($response);
    exit;
}

// DEMO DATA - Replace this with actual NIMC API integration
// In production, you would call the official NIMC API here
$demoDatabase = [
    '12345678901' => [
        'nin' => '12345678901',
        'firstname' => 'Chinedu',
        'lastname' => 'Okafor',
        'middlename' => 'Emmanuel',
        'gender' => 'Male',
        'dateOfBirth' => '1990-05-15',
        'phone' => '08012345678',
        'email' => 'chinedu.okafor@email.com',
        'address' => '45 Admiralty Way, Lekki Phase 1, Lagos',
        'state' => 'Lagos',
        'lga' => 'Eti-Osa',
        'trackingId' => 'NIMC-' . strtoupper(bin2hex(random_bytes(8)))
    ],
    '23456789012' => [
        'nin' => '23456789012',
        'firstname' => 'Aisha',
        'lastname' => 'Bello',
        'middlename' => 'Fatima',
        'gender' => 'Female',
        'dateOfBirth' => '1988-08-22',
        'phone' => '08098765432',
        'email' => 'aisha.bello@email.com',
        'address' => '12 Ahmadu Bello Way, Kaduna',
        'state' => 'Kaduna',
        'lga' => 'Kaduna North',
        'trackingId' => 'NIMC-' . strtoupper(bin2hex(random_bytes(8)))
    ],
    '34567890123' => [
        'nin' => '34567890123',
        'firstname' => 'Oluwaseun',
        'lastname' => 'Adeyemi',
        'middlename' => 'Blessing',
        'gender' => 'Female',
        'dateOfBirth' => '1995-12-10',
        'phone' => '07012345678',
        'email' => 'seun.adeyemi@email.com',
        'address' => '78 Ring Road, Ibadan',
        'state' => 'Oyo',
        'lga' => 'Ibadan North',
        'trackingId' => 'NIMC-' . strtoupper(bin2hex(random_bytes(8)))
    ],
    '45678901234' => [
        'nin' => '45678901234',
        'firstname' => 'Ibrahim',
        'lastname' => 'Mohammed',
        'middlename' => 'Usman',
        'gender' => 'Male',
        'dateOfBirth' => '1992-03-18',
        'phone' => '08123456789',
        'email' => 'ibrahim.mohammed@email.com',
        'address' => '23 Independence Avenue, Abuja',
        'state' => 'FCT',
        'lga' => 'Abuja Municipal',
        'trackingId' => 'NIMC-' . strtoupper(bin2hex(random_bytes(8)))
    ],
    '56789012345' => [
        'nin' => '56789012345',
        'firstname' => 'Ngozi',
        'lastname' => 'Eze',
        'middlename' => 'Grace',
        'gender' => 'Female',
        'dateOfBirth' => '1987-11-25',
        'phone' => '09087654321',
        'email' => 'ngozi.eze@email.com',
        'address' => '67 Azikiwe Road, Port Harcourt',
        'state' => 'Rivers',
        'lga' => 'Port Harcourt',
        'trackingId' => 'NIMC-' . strtoupper(bin2hex(random_bytes(8)))
    ]
];

// Check if NIN exists in demo database
if (isset($demoDatabase[$nin])) {
    $userData = $demoDatabase[$nin];
    
    $response['success'] = true;
    $response['message'] = 'NIN verified successfully';
    $response['data'] = $userData;
} else {
    $response['message'] = 'Invalid NIN. No record found in NIMC database';
}

echo json_encode($response);

/* 
 * PRODUCTION IMPLEMENTATION NOTES:
 * 
 * To integrate with actual NIMC API:
 * 1. Obtain API credentials from NIMC
 * 2. Replace demo database with API call:
 * 
 * $apiUrl = 'https://nimc-api-endpoint.gov.ng/verify';
 * $apiKey = 'YOUR_API_KEY';
 * 
 * $ch = curl_init();
 * curl_setopt($ch, CURLOPT_URL, $apiUrl);
 * curl_setopt($ch, CURLOPT_POST, true);
 * curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
 *     'nin' => $nin
 * ]));
 * curl_setopt($ch, CURLOPT_HTTPHEADER, [
 *     'Content-Type: application/json',
 *     'Authorization: Bearer ' . $apiKey
 * ]);
 * curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 * 
 * $result = curl_exec($ch);
 * $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
 * curl_close($ch);
 * 
 * if ($httpCode === 200) {
 *     $apiData = json_decode($result, true);
 *     if ($apiData && isset($apiData['data'])) {
 *         $response['data'] = $apiData['data'];
 *         $response['success'] = true;
 *         $response['message'] = 'NIN verified successfully';
 *     } else {
 *         $response['message'] = 'Invalid response from NIMC API';
 *     }
 * } else {
 *     $response['message'] = 'Unable to verify NIN at this time';
 * }
 */
?>