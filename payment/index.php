<?php
session_start();
require '../payment/config.php';

// Check if user is logged in
if (!isset($_SESSION['safenid']) || empty($_SESSION['safenid'])) {
    header('Location: ../identity/index.php');
    exit();
}

$safenid = $_SESSION['safenid'];
$userFolder = '../identity/user';
$filePath = $userFolder . '/' . $safenid . '.txt';

// Get user data
if (!file_exists($filePath)) {
    echo "User not found";
    exit();
}

$userData = json_decode(file_get_contents($filePath), true);

// Check if user already has active payment
if (hasActivePayment($userData)) {
    header('Location: ../report/index.php');
    exit();
}

// Get or create payment reference
$paymentRef = $_SESSION['payment_reference'] ?? generatePaymentReference($safenid);
$_SESSION['payment_reference'] = $paymentRef;

$fullName = trim($userData['firstname'] . ' ' . $userData['lastname']);
$email = $userData['email'];
$phone = $userData['phone'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafeNaija - Complete Payment</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Open Sans', sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .payment-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            width: 100%;
            padding: 40px;
        }

        .payment-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .payment-header h1 {
            color: #1e3c72;
            font-size: 28px;
            margin-bottom: 10px;
        }

        .payment-header p {
            color: #666;
            font-size: 14px;
        }

        .success-badge {
            display: inline-block;
            width: 60px;
            height: 60px;
            background: #1e3c72;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            margin-bottom: 15px;
        }

        .payment-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            color: #666;
            font-weight: 600;
            font-size: 14px;
        }

        .info-value {
            color: #1e3c72;
            font-weight: 700;
            font-size: 14px;
        }

        .benefit-section {
            margin-bottom: 25px;
        }

        .benefit-title {
            color: #1e3c72;
            font-weight: 700;
            margin-bottom: 15px;
            font-size: 14px;
            text-transform: uppercase;
        }

        .benefit-list {
            list-style: none;
        }

        .benefit-list li {
            color: #333;
            padding: 8px 0;
            font-size: 14px;
            padding-left: 25px;
            position: relative;
        }

        .benefit-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #2ecc71;
            font-weight: bold;
        }

        .payment-button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .btn {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(30, 60, 114, 0.4);
        }

        .btn-secondary {
            background: #f0f0f0;
            color: #333;
        }

        .btn-secondary:hover {
            background: #e0e0e0;
        }

        .test-mode-warning {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 13px;
            border-left: 4px solid #ffc107;
        }

        .security-info {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .security-info i {
            margin-right: 5px;
        }

        .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #1e3c72;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .btn.loading .spinner {
            display: inline-block;
        }

        .btn.loading span {
            display: none;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <div class="payment-header">
            <div class="success-badge">
                <i class="fas fa-lock"></i>
            </div>
            <h1>Complete Your Payment</h1>
            <p>Unlock full access to SafeNaija Emergency Reporting</p>
        </div>

        <div class="test-mode-warning">
            <i class="fas fa-info-circle"></i>
            <strong>Test Mode:</strong> This is a test payment integration. Use test card details to proceed.
        </div>

        <div class="payment-info">
            <div class="info-row">
                <span class="info-label">SafeNID:</span>
                <span class="info-value"><?php echo htmlspecialchars($safenid); ?></span>
            </div>
            <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value"><?php echo htmlspecialchars($fullName); ?></span>
            </div>
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value" style="font-size: 12px;"><?php echo htmlspecialchars($email); ?></span>
            </div>
            <div class="info-row">
                <span class="info-label">Annual Fee:</span>
                <span class="info-value">₦<?php echo number_format(PAYMENT_AMOUNT); ?></span>
            </div>
            <div class="info-row">
                <span class="info-label">Validity:</span>
                <span class="info-value"><?php echo PAYMENT_VALIDITY_DAYS; ?> Days</span>
            </div>
        </div>

        <div class="benefit-section">
            <div class="benefit-title">What You Get:</div>
            <ul class="benefit-list">
                <li>Full access to emergency reporting system</li>
                <li>Real-time incident tracking</li>
                <li>Automated alerts and notifications</li>
                <li>Case status updates</li>
                <li>Direct contact with authorities</li>
                <li>Annual subscription (12 months)</li>
            </ul>
        </div>

        <button type="button" class="btn btn-primary" id="processPaymentBtn" onclick="processPayment()">
            <span>
                <i class="fas fa-credit-card"></i>
                Proceed to Payment
            </span>
            <div class="spinner"></div>
        </button>

        <button type="button" class="btn btn-secondary" onclick="window.location.href='../report/index.php'">
            <i class="fas fa-arrow-left"></i>
            Go Back
        </button>

        <div class="security-info">
            <i class="fas fa-shield-alt"></i>
            Secured by Quickteller. Your payment is 100% safe and encrypted.
        </div>
    </div>

    <script>
        function processPayment() {
            const btn = document.getElementById('processPaymentBtn');
            btn.classList.add('loading');
            btn.disabled = true;

            // In test mode, create a form to submit to Quickteller
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '../payment/initiate.php';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'action';
            input.value = 'initiate_payment';

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }

        // Check payment status every 5 seconds
        let checkCount = 0;
        function checkPaymentStatus() {
            checkCount++;
            if (checkCount > 120) { // Stop after 10 minutes
                console.log('Payment check timeout');
                return;
            }

            fetch('../payment/check_status.php?safenid=<?php echo $safenid; ?>')
                .then(response => response.json())
                .then(data => {
                    if (data.has_payment) {
                        window.location.href = '../report/index.php';
                    } else {
                        setTimeout(checkPaymentStatus, 5000);
                    }
                })
                .catch(err => console.error('Status check error:', err));
        }

        // Start checking status if user closed payment window
        // setTimeout(checkPaymentStatus, 10000);
    </script>
</body>
</html>
