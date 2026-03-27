<?php
session_start();
require '../payment/config.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['safenid']) || empty($_SESSION['safenid'])) {
    http_response_code(401);
    die(json_encode(['error' => 'User not authenticated']));
}

$safenid = $_SESSION['safenid'];

// Get user data
$userFolder = '../identity/user';
$filePath = $userFolder . '/' . $safenid . '.txt';

if (!file_exists($filePath)) {
    http_response_code(404);
    die(json_encode(['error' => 'User not found']));
}

$userData = json_decode(file_get_contents($filePath), true);

if (!$userData) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid user data']));
}

// Check if user has active payment
$hasPayment = hasActivePayment($userData);

$response = [
    'has_payment' => $hasPayment,
    'safenid' => $safenid,
    'name' => $userData['firstname'] . ' ' . $userData['lastname']
];

if ($hasPayment) {
    $response['payment_expiry'] = $userData['payment_expiry'] ?? date('Y-m-d', strtotime('+365 days'));
    $response['message'] = 'User has active payment';
}

http_response_code(200);
echo json_encode($response);
?>
