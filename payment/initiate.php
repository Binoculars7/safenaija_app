<?php
session_start();
require '../payment/config.php';

// Check if user is logged in
if (!isset($_SESSION['safenid']) || empty($_SESSION['safenid'])) {
    http_response_code(401);
    die(json_encode(['error' => 'User not authenticated']));
}

$safenid = $_SESSION['safenid'];
$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'initiate_payment') {
    // Get user data
    $userFolder = '../identity/user';
    $filePath = $userFolder . '/' . $safenid . '.txt';
    
    if (!file_exists($filePath)) {
        die(json_encode(['error' => 'User not found']));
    }
    
    $userData = json_decode(file_get_contents($filePath), true);
    
    // Generate payment request
    $paymentRequest = generateQuicktellerPaymentRequest($safenid, $userData);
    $paymentReference = $paymentRequest['paymentReference'];
    
    // Store in session for verification
    $_SESSION['payment_reference'] = $paymentReference;
    $_SESSION['payment_amount'] = PAYMENT_AMOUNT;
    
    // Show test payment form for testing purposes
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Processing Payment...</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
            .form-group { margin: 15px 0; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .info-box { background: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .btn { background: #1e3c72; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
            .btn:hover { background: #2a5298; }
            .test-notice { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>SafeNaija Payment - Test Mode</h1>
            
            <div class="test-notice">
                <strong>⚠️ TEST MODE:</strong> This is a simulated payment gateway for testing purposes.
            </div>
            
            <div class="info-box">
                <p><strong>Payment Reference:</strong> <?php echo htmlspecialchars($paymentReference); ?></p>
                <p><strong>Amount:</strong> ₦<?php echo number_format(PAYMENT_AMOUNT); ?></p>
                <p><strong>Merchant:</strong> SafeNaija Reporting System</p>
            </div>
            
            <form method="post" action="verify.php">
                <h3>Test Payment Details</h3>
                
                <div class="form-group">
                    <label>Select Payment Status:</label>
                    <select name="payment_status" required>
                        <option value="">-- Choose Status --</option>
                        <option value="completed">✓ Payment Successful</option>
                        <option value="pending">⏳ Payment Pending</option>
                        <option value="failed">✗ Payment Failed</option>
                    </select>
                </div>
                
                <input type="hidden" name="reference" value="<?php echo htmlspecialchars($paymentReference); ?>">
                <input type="hidden" name="amount" value="<?php echo PAYMENT_AMOUNT; ?>">
                <input type="hidden" name="safenid" value="<?php echo htmlspecialchars($safenid); ?>">
                <input type="hidden" name="merchant_id" value="<?php echo QUICKTELLER_MERCHANT_ID; ?>">
                
                <button type="submit" class="btn">Process Test Payment</button>
            </form>
            
            <p style="margin-top: 20px; color: #999; font-size: 12px;">
                In production, this would redirect to the actual Quickteller payment gateway.
            </p>
        </div>
    </body>
    </html>
    <?php
} else {
    die(json_encode(['error' => 'Invalid action']));
}
?>
