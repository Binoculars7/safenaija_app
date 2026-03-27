<?php
session_start();
require '../payment/config.php';

// Get payment status from the test form or Quickteller callback
$paymentStatus = isset($_POST['payment_status']) ? $_POST['payment_status'] : (isset($_GET['payment_status']) ? $_GET['payment_status'] : '');
$paymentReference = isset($_POST['reference']) ? $_POST['reference'] : (isset($_GET['reference']) ? $_GET['reference'] : '');
$safenid = isset($_POST['safenid']) ? $_POST['safenid'] : (isset($_SESSION['safenid']) ? $_SESSION['safenid'] : '');
$amount = isset($_POST['amount']) ? $_POST['amount'] : (isset($_GET['amount']) ? $_GET['amount'] : PAYMENT_AMOUNT);

// Validate required parameters
if (empty($paymentStatus) || empty($paymentReference) || empty($safenid)) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Verification Error</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Open Sans', sans-serif; text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
            .error { color: #d32f2f; margin: 20px 0; }
            .btn { background: #1e3c72; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; }
            .btn:hover { background: #2a5298; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Payment Verification Failed</h1>
            <p class="error">⚠️ Missing payment information. Payment reference, status, or user ID not found.</p>
            <p>Please try the payment process again from the beginning.</p>
            <a href="../payment/index.php" class="btn">← Back to Payment</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Get user data
$userFolder = '../identity/user';
$filePath = $userFolder . '/' . $safenid . '.txt';

if (!file_exists($filePath)) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>User Not Found</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Open Sans', sans-serif; text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
            .error { color: #d32f2f; margin: 20px 0; }
            .btn { background: #1e3c72; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>User Not Found</h1>
            <p class="error">⚠️ The user associated with this payment could not be found.</p>
            <a href="../identity/index.php" class="btn">← Register Account</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Load user data
$userData = json_decode(file_get_contents($filePath), true);

if (!$userData) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Data Error</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Open Sans', sans-serif; text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
            .error { color: #d32f2f; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Data Processing Error</h1>
            <p class="error">⚠️ Could not process user data. Please try again.</p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Process payment verification
if ($paymentStatus === 'completed') {
    // Payment successful - update user record
    $paymentData = [
        'payment_status' => 'completed',
        'payment_reference' => $paymentReference,
        'payment_date' => date('Y-m-d H:i:s'),
        'payment_amount' => $amount,
        'payment_expiry' => calculatePaymentExpiry(),
        'payment_method' => 'Quickteller',
        'payment_currency' => 'NGN'
    ];
    
    // Update user file with payment information
    updateUserPaymentStatus($safenid, $paymentData);
    
    // Update session
    $_SESSION['safenid'] = $safenid;
    $_SESSION['payment_verified'] = true;
    
    // Success page
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Successful</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Open Sans', sans-serif; text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
            .success { color: #4caf50; font-size: 48px; margin: 20px 0; }
            .text { color: #333; font-size: 18px; margin: 15px 0; }
            .reference { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: monospace; }
            .btn { background: #4caf50; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; font-size: 16px; }
            .btn:hover { background: #45a049; }
            .details { background: #f0f0f0; padding: 20px; border-radius: 5px; text-align: left; margin-top: 20px; }
            .detail-row { margin: 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success">✓</div>
            <h1>Payment Successful!</h1>
            <p class="text">Your annual subscription has been activated.</p>
            
            <div class="reference">
                Reference: <?php echo htmlspecialchars($paymentReference); ?>
            </div>
            
            <div class="details">
                <div class="detail-row">
                    <span class="label">SafeNID:</span> <?php echo htmlspecialchars($safenid); ?>
                </div>
                <div class="detail-row">
                    <span class="label">Amount Paid:</span> ₦<?php echo number_format($amount); ?>
                </div>
                <div class="detail-row">
                    <span class="label">Payment Date:</span> <?php echo date('M d, Y H:i A'); ?>
                </div>
                <div class="detail-row">
                    <span class="label">Validity Period:</span> 365 days
                </div>
                <div class="detail-row">
                    <span class="label">Expires:</span> <?php echo date('M d, Y', strtotime('+365 days')); ?>
                </div>
            </div>
            
            <p style="margin-top: 30px; color: #666;">You can now access the SafeNaija reporting system to file and track emergency cases.</p>
            
            <a href="../report/index.php" class="btn">→ Access Report System</a>
        </div>
        
        <script>
            // Auto-redirect after 3 seconds if user doesn't click button
            setTimeout(function() {
                window.location.href = '../report/index.php';
            }, 3000);
        </script>
    </body>
    </html>
    <?php
} elseif ($paymentStatus === 'pending') {
    // Payment pending
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Pending</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Open Sans', sans-serif; text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
            .pending { color: #ff9800; font-size: 48px; margin: 20px 0; }
            .text { color: #333; font-size: 16px; margin: 15px 0; }
            .btn { background: #1e3c72; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; }
            .btn:hover { background: #2a5298; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="pending">⏳</div>
            <h1>Payment Pending</h1>
            <p class="text">Your payment is being processed. Please wait for confirmation.</p>
            <p class="text" style="color: #999; font-size: 14px;">Reference: <?php echo htmlspecialchars($paymentReference); ?></p>
            <a href="check_status.php" class="btn">Check Payment Status</a>
            <a href="../payment/index.php" class="btn" style="background: #999;">← Back to Payment</a>
        </div>
    </body>
    </html>
    <?php
} else {
    // Payment failed
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Failed</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Open Sans', sans-serif; text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
            .error { color: #d32f2f; font-size: 48px; margin: 20px 0; }
            .text { color: #333; font-size: 16px; margin: 15px 0; }
            .btn { background: #1e3c72; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; }
            .btn:hover { background: #2a5298; }
            .failed-btn { background: #d32f2f; }
            .failed-btn:hover { background: #c62828; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error">✗</div>
            <h1>Payment Failed</h1>
            <p class="text">Unfortunately, your payment could not be processed.</p>
            <p class="text" style="color: #999; font-size: 14px;">Reference: <?php echo htmlspecialchars($paymentReference); ?></p>
            <p class="text">Please try again or contact support if the problem persists.</p>
            <a href="../payment/index.php" class="btn">← Try Again</a>
        </div>
    </body>
    </html>
    <?php
}
?>
