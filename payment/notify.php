<?php
require '../payment/config.php';

header('Content-Type: application/json');

// Log all incoming data for debugging
$logData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'post_data' => $_POST,
    'get_data' => $_GET
];

error_log(json_encode($logData));

// Get payment notification from Quickteller
$paymentReference = isset($_POST['reference']) ? $_POST['reference'] : '';
$paymentStatus = isset($_POST['status']) ? $_POST['status'] : '';
$amount = isset($_POST['amount']) ? $_POST['amount'] : 0;
$signature = isset($_POST['signature']) ? $_POST['signature'] : '';

// Validate required fields
if (empty($paymentReference) || empty($paymentStatus)) {
    http_response_code(400);
    die(json_encode(['error' => 'Missing required fields', 'request_id' => uniqid()]));
}

// Verify signature (if provided)
if (!empty($signature)) {
    $paymentData = [
        'reference' => $paymentReference,
        'status' => $paymentStatus,
        'amount' => $amount
    ];
    
    if (!verifyQuicktellerSignature($paymentData, $signature)) {
        http_response_code(403);
        die(json_encode(['error' => 'Invalid signature', 'request_id' => uniqid()]));
    }
}

// Extract SafeNID from reference (format: SN{timestamp}{hash})
// Reference format: SN20240115153045{hash} - SafeNID comes before payment reference
// We need to find the user by payment reference
$userFolder = '../identity/user';
$usersFound = false;

if (is_dir($userFolder)) {
    $files = scandir($userFolder);
    
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'txt') {
            $filePath = $userFolder . '/' . $file;
            $userData = json_decode(file_get_contents($filePath), true);
            
            // Check if this user has this payment reference
            if (isset($userData['payment_reference']) && $userData['payment_reference'] === $paymentReference) {
                $safenid = pathinfo($file, PATHINFO_FILENAME);
                $usersFound = true;
                
                // Update payment status
                if ($paymentStatus === 'completed' || $paymentStatus === 'success' || $paymentStatus === 'paid') {
                    $paymentData = [
                        'payment_status' => 'completed',
                        'payment_reference' => $paymentReference,
                        'payment_date' => date('Y-m-d H:i:s'),
                        'payment_amount' => $amount ? $amount : PAYMENT_AMOUNT,
                        'payment_expiry' => calculatePaymentExpiry(),
                        'payment_method' => 'Quickteller',
                        'payment_currency' => 'NGN'
                    ];
                    
                    updateUserPaymentStatus($safenid, $paymentData);
                    
                    // Log successful payment
                    error_log("Payment completed for $safenid - Reference: $paymentReference");
                    
                    http_response_code(200);
                    die(json_encode([
                        'success' => true,
                        'message' => 'Payment verified and recorded',
                        'safenid' => $safenid,
                        'reference' => $paymentReference
                    ]));
                } else if ($paymentStatus === 'pending') {
                    error_log("Payment pending for $safenid - Reference: $paymentReference");
                    http_response_code(200);
                    die(json_encode([
                        'success' => true,
                        'message' => 'Payment status updated to pending',
                        'safenid' => $safenid,
                        'reference' => $paymentReference
                    ]));
                } else {
                    // Payment failed
                    error_log("Payment failed for $safenid - Status: $paymentStatus - Reference: $paymentReference");
                    http_response_code(200);
                    die(json_encode([
                        'success' => false,
                        'message' => 'Payment failed',
                        'safenid' => $safenid,
                        'reference' => $paymentReference
                    ]));
                }
            }
        }
    }
}

if (!$usersFound) {
    error_log("Payment notification received but user not found - Reference: $paymentReference");
    http_response_code(404);
    die(json_encode(['error' => 'Payment reference not found', 'reference' => $paymentReference]));
}

// If we reach here, something unexpected happened
http_response_code(500);
die(json_encode(['error' => 'Unexpected error processing payment notification']));
?>
