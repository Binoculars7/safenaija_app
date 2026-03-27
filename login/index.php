<?php
session_start();

// Function to find user by SafeNID or NIN
function findUser($identifier) {
    $userFolder = '../identity/user';
    if (!is_dir($userFolder)) {
        return false;
    }
    
    $identifier = trim($identifier);
    
    // Check if it's a SafeNID format (starts with SN)
    if (preg_match('/^SN\d{4}$/', $identifier)) {
        // Direct file lookup for SafeNID
        $filePath = $userFolder . '/' . $identifier . '.txt';
        
        if (file_exists($filePath)) {
            $content = file_get_contents($filePath);
            $data = json_decode($content, true);
            
            if ($data && isset($data['safenid']) && $data['safenid'] === $identifier) {
                return $data;
            }
        }
        return false;
    }
    
    // Check if it's a NIN format (11 digits)
    if (preg_match('/^\d{11}$/', $identifier)) {
        // Search all files for matching NIN
        $files = scandir($userFolder);
        
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'txt') {
                $filePath = $userFolder . '/' . $file;
                $content = file_get_contents($filePath);
                $data = json_decode($content, true);
                
                if ($data && isset($data['nin']) && $data['nin'] === $identifier) {
                    return $data;
                }
            }
        }
    }
    
    return false;
}

// Handle AJAX login request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
    isset($_SERVER['CONTENT_TYPE']) && 
    strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    
    $input = json_decode(file_get_contents('php://input'), true);
    $identifier = isset($input['identifier']) ? trim($input['identifier']) : '';
    
    if (empty($identifier)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please enter your SafeNID or NIN'
        ]);
        exit;
    }
    
    // Validate format (SafeNID: SN followed by 4 digits, or NIN: 11 digits)
    $isSafeNID = preg_match('/^SN\d{4}$/', $identifier);
    $isNIN = preg_match('/^\d{11}$/', $identifier);
    
    if (!$isSafeNID && !$isNIN) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid format. Enter SafeNID (e.g., SN1234) or 11-digit NIN'
        ]);
        exit;
    }
    
    // Find user in database
    $userData = findUser($identifier);
    
    if ($userData) {
        // Login successful - check payment status
        $_SESSION['safenid'] = $userData['safenid'];
        $_SESSION['phone'] = $userData['phone'];
        $_SESSION['nin'] = $userData['nin'];
        $_SESSION['user_data'] = $userData;
        $_SESSION['logged_in'] = true;
        
        // Load payment config to check if user has active payment
        require '../payment/config.php';
        $redirect = hasActivePayment($userData) ? '../report' : '../payment';
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful! Welcome back.',
            'safenid' => $userData['safenid'],
            'firstname' => isset($userData['firstname']) ? $userData['firstname'] : '',
            'redirect' => $redirect
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Account not found. Please check your credentials or signup first.'
        ]);
    }
    exit;
}

// Check if already logged in
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo "<script>window.location.href = '../report';</script>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Login - SafeNaija</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">

    <!-- Favicon -->
    <link href="img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Ubuntu:wght@500;700&display=swap"
        rel="stylesheet">

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="lib/animate/animate.min.css" rel="stylesheet">
    <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="css/style.css" rel="stylesheet">
</head>

<style>
    #typing-header {
        font-size: 14px;
        margin-top: 3em;
    }
    
    @media (min-width: 600px) {
        #typing-header {
            font-size: 25px;
            margin-top:0em;
        }
    }
    
    #alert-box {
        margin-top: 1rem;
    }

    .input-center-inner input::placeholder {
        color: #ffffffcc !important;
        opacity: 1 !important;
    }
    
    .input-center-inner input {
        color: #fff !important;
    }
    
    .login-btn {
        color: black !important;
        width: 100%; 
        border-radius: 25px; 
        padding: 0.75em 1.2em; 
        border: 1.5px solid #bfc9e6;
        background: #f7f9fc;
        box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
        font-size: 1rem;
        font-weight: 500;
        transition: border-color 0.2s, background 0.2s, color 0.2s;
        cursor: pointer;
    }
    
    .login-btn:focus {
        border-color: #1363c6;
        outline: none;
    }

    .login-btn:hover {
        background: #bed0d8;
        color: black !important;
    }
    
    .login-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .input-center-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 0.5em;
    }
    
    .input-center-inner {
        display: flex;
        gap: 0.5em;
        align-items: center;
        width: 100%;
        max-width: 400px;
    }
    
    .signup-link {
        color: #fff;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
    }
    
    .signup-link:hover {
        color: #bed0d8;
        text-decoration: underline;
    }
    
    @media (min-width: 992px) {
        .input-center-wrapper {
            align-items: flex-start;
        }
    }
</style>

<body>
    <!-- Spinner Start -->
    <div id="spinner"
        class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <!-- Spinner End -->

    <!-- Navbar Start -->
    <div class="container-fluid sticky-top">
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-dark p-0">
                <a href="index.html" class="navbar-brand">
                    <h1 class="text-white">SafeNaija</h1>
                </a>
                <button type="button" class="navbar-toggler ms-auto me-0" data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav ms-auto">
                        <a href="../home" class="nav-item nav-link">Home</a>
                        <a href="../identity" class="nav-item nav-link">Signup</a>
                    </div>
                </div>
            </nav>
        </div>
    </div>
    <!-- Navbar End -->

    <!-- Hero Start -->
    <div class="container-fluid pt-5 bg-primary hero-header mb-5" id="home">
        <div class="container pt-5">
            <div class="row g-5 pt-5">
                <div class="col-lg-6 align-self-center text-center text-lg-start mb-lg-5" style="margin-top: -1em;">
                    <h1 id="typing-header" class="display-4 text-white mb-4 animated slideInRight" style="font-family: 'Courier New', Courier, monospace;"></h1>
                    
                    <script>
                        function startTypingHeader() {
                            const txt = "Login to continue";
                            let i = 0;
                            function typeEffect() {
                                document.getElementById("typing-header").innerHTML = txt.slice(0, i) + '<span style="border-right: .08em solid #fff"></span>';
                                i++;
                                if (i > txt.length) {
                                    i = 0;
                                    setTimeout(typeEffect, 4000);
                                } else {
                                    setTimeout(typeEffect, 70);
                                }
                            }
                            typeEffect();
                        }
                        document.addEventListener("DOMContentLoaded", startTypingHeader);
                    </script>
                    <div class="input-center-wrapper">
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <input 
                                type="text" 
                                class="form-control" 
                                id="identifier-input"
                                placeholder="Enter NIN or SafeNID" 
                                maxlength="11"
                                style="
                                    width: 100%; 
                                    border-radius: 25px; 
                                    padding: 0.75em 1.2em; 
                                    border: none;
                                    background: rgba(247, 249, 252, 0.3);
                                    box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                    font-size: 1rem;
                                    transition: background 0.2s;
                                    color: #fff;
                                    backdrop-filter: blur(2px);
                                "
                                onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                onblur="this.style.background='rgba(247, 249, 252, 0.3)'"
                            >
                        </div>
                        <div class="mb-4 animated slideInRight input-center-inner" style="margin-top:-0.7em;">
                            <input 
                                type="button" 
                                class="form-control login-btn"
                                value="Login"
                                id="login-button"
                                style="color: #000 !important;"
                            >
                        </div>
                        
                        <!-- Alert Box -->
                        <div id="alert-box" class="input-center-inner"></div>
                        
                        <!-- Signup Link -->
                        <div class="input-center-inner" style="margin-top: 0.5rem;">
                            <p class="text-white mb-0" style="font-size: 0.9rem;">
                                Don't have an account? <a href="../identity" class="signup-link">Sign up here</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 align-self-end text-center text-lg-end">
                    <img class="img-fluid" src="img/hero-img.png" alt="">
                </div>
            </div>
        </div>
    </div>
    <!-- Hero End -->

    <!-- Footer Start -->
    <div class="container-fluid bg-dark text-white-50 footer pt-5" id="contact" style="margin-top: -3em;">
        <div class="container py-5">
            <div class="row g-5">
                <div class="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.1s">
                    <a href="index.html" class="d-inline-block mb-3">
                        <h1 class="text-white">Safe<span class="text-primary"></span>Naija</h1>
                    </a>
                    <p class="mb-0">SafeNaija is an AI-powered platform that allows nigeria citizens to report crimes or emergencies in real time. This will help the right agencies to come through ASAP.</p>
                </div>
                <div class="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
                    <h5 class="text-white mb-4">Get In Touch</h5>
                    <p><i class="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                    <p><i class="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                    <p><i class="fa fa-envelope me-3"></i>info@example.com</p>
                    <div class="d-flex pt-2">
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-twitter"></i></a>
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-youtube"></i></a>
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-instagram"></i></a>
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.5s">
                    <h5 class="text-white mb-4">Popular Link</h5>
                    <a class="btn btn-link" href="">About Us</a>
                    <a class="btn btn-link" href="">Contact Us</a>
                    <a class="btn btn-link" href="">Privacy Policy</a>
                    <a class="btn btn-link" href="">Terms & Condition</a>
                    <a class="btn btn-link" href="">Career</a>
                </div>
                <div class="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.7s">
                    <h5 class="text-white mb-4">Our Services</h5>
                    <a class="btn btn-link" href="">Robotic Automation</a>
                    <a class="btn btn-link" href="">Machine learning</a>
                    <a class="btn btn-link" href="">Predictive Analysis</a>
                    <a class="btn btn-link" href="">Data Science</a>
                    <a class="btn btn-link" href="">Robot Technology</a>
                </div>
            </div>
        </div>
    </div>
    <!-- Footer End -->

    <!-- Back to Top -->
    <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i class="bi bi-arrow-up"></i></a>

    <!-- JavaScript Libraries -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="lib/wow/wow.min.js"></script>
    <script src="lib/easing/easing.min.js"></script>
    <script src="lib/waypoints/waypoints.min.js"></script>
    <script src="lib/counterup/counterup.min.js"></script>
    <script src="lib/owlcarousel/owl.carousel.min.js"></script>

    <!-- Template Javascript -->
    <script src="js/main.js"></script>
    
    <!-- Login Script -->
    <script>
        const loginButton = document.getElementById('login-button');
        const identifierInput = document.getElementById('identifier-input');
        const alertBox = document.getElementById('alert-box');
        
        // Allow Enter key to trigger login
        identifierInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginButton.click();
            }
        });
        
        // Handle input format (allow letters and numbers for SafeNID format)
        identifierInput.addEventListener('input', function() {
            // Convert to uppercase for SafeNID format
            let value = this.value.toUpperCase();
            
            // If starts with SN, keep letters; otherwise only numbers
            if (value.startsWith('SN')) {
                // Allow SN followed by up to 4 digits
                value = value.replace(/[^SN0-9]/g, '');
                if (value.length > 6) {
                    value = value.substring(0, 6);
                }
                // Update maxlength for SafeNID
                this.setAttribute('maxlength', '6');
            } else {
                // Only allow numbers for NIN
                value = value.replace(/\D/g, '');
                // Update maxlength for NIN
                this.setAttribute('maxlength', '11');
            }
            
            this.value = value;
        });
        
        loginButton.addEventListener('click', async function() {
            const identifier = identifierInput.value.trim();
            
            // Clear previous messages
            alertBox.innerHTML = '';
            
            // Validation
            if (!identifier) {
                showAlert('Please enter your SafeNID or NIN', 'warning');
                return;
            }
            
            // Disable button and show loading
            loginButton.disabled = true;
            const originalValue = loginButton.value;
            loginButton.value = 'Logging in...';
            
            try {
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identifier: identifier
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert(result.message, 'success');
                    
                    // Redirect to report page after short delay
                    setTimeout(() => {
                        window.location.href = result.redirect;
                    }, 1000);
                } else {
                    showAlert(result.message, 'danger');
                }
                
            } catch (error) {
                showAlert('Error connecting to login service. Please try again.', 'danger');
                console.error('Error:', error);
            } finally {
                loginButton.disabled = false;
                loginButton.value = originalValue;
            }
        });
        
        function showAlert(message, type) {
            const colors = {
                'warning': 'rgba(255, 193, 7, 0.9)',
                'danger': 'rgba(220, 53, 69, 0.9)',
                'success': 'rgba(25, 135, 84, 0.9)'
            };
            
            alertBox.innerHTML = `
                <div style="
                    width: 100%;
                    background: ${colors[type]};
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                    ${message}
                </div>
            `;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                alertBox.innerHTML = '';
            }, 5000);
        }
    </script>
</body>
</html>