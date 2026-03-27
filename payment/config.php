<?php
/**
 * SafeNaija Payment Configuration
 * Quickteller API Integration (Test Mode)
 */

/**
 * Auto-detect base URL dynamically
 */
function getBaseURL() {
    // Detect protocol (http or https)
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    
    // Get the host
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
    
    // Get the directory path (remove filename, get directory only)
    $scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
    
    // Build base URL
    $baseURL = $protocol . '://' . $host . $scriptPath;
    
    return $baseURL;
}

// Quickteller API Configuration (TEST MODE) 
define('QUICKTELLER_MERCHANT_ID', ''); // Test merchant ID
define('QUICKTELLER_API_KEY', '');
define('QUICKTELLER_API_URL', 'https://qa.interswitchng.com/api/v3/purchases'); // Test endpoint

// Payment Configuration
define('PAYMENT_AMOUNT', 5000); // Annual fee in Naira (₦5,000)
define('PAYMENT_CURRENCY', 'NGN');
define('PAYMENT_VALIDITY_DAYS', 365); // 1 year validity

// Payment item code (Quickteller bill payment code)
define('PAYMENT_ITEM_CODE', '737'); // SafeNaija annual subscription

// Success/Error URLs - Auto-detected URLs
$baseURL = getBaseURL();
define('PAYMENT_SUCCESS_URL', $baseURL . '/verify.php');
define('PAYMENT_CANCEL_URL', str_replace('/payment', '/identity', $baseURL) . '/index.php');

/**
 * Generate payment reference number
 */
function generatePaymentReference($safenid) {
    return 'SN' . date('YmdHis') . substr(md5($safenid), 0, 8);
}

/**
 * Check if user has active payment
 */
function hasActivePayment($userData) {
    if (!isset($userData['payment_status']) || $userData['payment_status'] !== 'completed') {
        return false;
    }
    
    if (!isset($userData['payment_expiry'])) {
        return false;
    }
    
    $expiryDate = strtotime($userData['payment_expiry']);
    return $expiryDate > time();
}

/**
 * Calculate payment expiry date
 */
function calculatePaymentExpiry() {
    $expiry = new DateTime();
    $expiry->modify('+' . PAYMENT_VALIDITY_DAYS . ' days');
    return $expiry->format('Y-m-d H:i:s');
}

/**
 * Update user payment status
 */
function updateUserPaymentStatus($safenid, $paymentData) {
    $userFolder = '../identity/user';
    $filePath = $userFolder . '/' . $safenid . '.txt';
    
    if (!file_exists($filePath)) {
        return false;
    }
    
    $userData = json_decode(file_get_contents($filePath), true);
    
    // Add payment information - use null coalescing to prevent undefined key warnings
    $userData['payment_status'] = $paymentData['payment_status'] ?? ($paymentData['status'] ?? 'pending');
    $userData['payment_date'] = $paymentData['payment_date'] ?? ($paymentData['date'] ?? date('Y-m-d H:i:s'));
    $userData['payment_reference'] = $paymentData['payment_reference'] ?? ($paymentData['reference'] ?? '');
    $userData['payment_amount'] = $paymentData['payment_amount'] ?? PAYMENT_AMOUNT;
    $userData['payment_currency'] = $paymentData['payment_currency'] ?? PAYMENT_CURRENCY;
    $userData['payment_expiry'] = $paymentData['payment_expiry'] ?? ($paymentData['expiry'] ?? calculatePaymentExpiry());
    $userData['payment_method'] = $paymentData['payment_method'] ?? 'Quickteller';
    $userData['last_payment_check'] = date('Y-m-d H:i:s');
    
    // Save updated user data
    file_put_contents($filePath, json_encode($userData, JSON_PRETTY_PRINT), LOCK_EX);
    
    return true;
}

/**
 * Generate Quickteller payment request
 */
function generateQuicktellerPaymentRequest($safenid, $userData) {
    $reference = generatePaymentReference($safenid);
    
    $requestData = [
        'merchantId' => QUICKTELLER_MERCHANT_ID,
        'amount' => PAYMENT_AMOUNT,
        'currency' => PAYMENT_CURRENCY,
        'customerEmail' => $userData['email'],
        'customerName' => trim($userData['firstname'] . ' ' . $userData['lastname']),
        'customerMobile' => $userData['phone'],
        'paymentReference' => $reference,
        'itemCode' => PAYMENT_ITEM_CODE,
        'itemName' => 'SafeNaija Annual Subscription',
        'itemDescription' => 'Yearly access to SafeNaija emergency reporting system',
        'successUrl' => PAYMENT_SUCCESS_URL,
        'cancelUrl' => PAYMENT_CANCEL_URL,
        'notificationUrl' => getBaseURL() . '/notify.php',
        'redirectUrl' => PAYMENT_SUCCESS_URL,
        'metadata' => [
            'safenid' => $safenid,
            'nin' => $userData['nin']
        ]
    ];
    
    return $requestData;
}

/**
 * Verify Quickteller payment response (signature verification)
 */
function verifyQuicktellerSignature($data, $signature) {
    // In test mode, we'll do basic validation
    // In production, implement proper HMAC signature verification
    
    $dataString = implode('', [
        $data['merchantId'] ?? '',
        $data['paymentReference'] ?? '',
        $data['amount'] ?? '',
        $data['status'] ?? ''
    ]);
    
    $computedSignature = hash_hmac('sha256', $dataString, QUICKTELLER_API_KEY);
    
    return hash_equals($computedSignature, $signature);
}

?>
