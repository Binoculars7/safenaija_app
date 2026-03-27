<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Load payment configuration
require '../payment/config.php';

// Check if user is logged in - redirect to signup if not
if (!isset($_SESSION['safenid']) || empty($_SESSION['safenid'])) {
    echo "<script>window.location.href = '../identity';</script>";
    exit();
}

// Check if user has active payment - redirect to payment page if not
$safenid = $_SESSION['safenid'];
$userFolder = '../identity/user';
$filePath = $userFolder . '/' . $safenid . '.txt';

if (file_exists($filePath)) {
    $userData = json_decode(file_get_contents($filePath), true);
    if (!hasActivePayment($userData)) {
        // User doesn't have active payment - redirect to payment page
        echo "<script>window.location.href = '../payment';</script>";
        exit();
    }
} else {
    // User file not found - redirect to login
    echo "<script>window.location.href = '../login';</script>";
    exit();
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    echo "<script>window.location.href = '../login';</script>";
    exit();
}

// Get SafeNID from session
$displaySafeNID = $_SESSION['safenid'];
$userPhone = isset($_SESSION['phone']) ? $_SESSION['phone'] : 'N/A';

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>SafeNaija - Making Nigeria a better home</title>
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
            margin-top: 0em;
        }
    }

    /* Tag animation */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    #issueCategoryTag {
        animation: fadeIn 0.3s ease-in;
    }

    /* Ensure tag is always visible when shown */
    #issueCategoryTag[style*="display: inline-block"] {
        visibility: visible !important;
        opacity: 1 !important;
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
                <a href="index.php" class="navbar-brand">
                    <h1 class="text-white">SafeNaija</h1>
                </a>
                <button type="button" class="navbar-toggler ms-auto me-0" data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="navbar-nav ms-auto">
                        <a href="../agencyemail" class="nav-item nav-link active">See Agency Email</a>
                        <a href="#" class="nav-item nav-link active"><b>SafeNID: </b><span id="nav-safenid"><?php echo htmlspecialchars($displaySafeNID); ?></span></a>
                        <a href="?logout=1" class="nav-item nav-link" onclick="return confirm('Are you sure you want to logout?');">Logout</a>
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
                    <h1 id="typing-header" class="display-4 text-white mb-4 animated slideInRight" 
                        style="font-family: 'Courier New', Courier, monospace;">Report a Case</h1>
                    
                       <!--  <div class="mb-4 animated slideInRight input-center-inner">
                            <select id="casedropDown" name="casedropDown"
                                    class="form-control" 
                                    style="width: 100%; 
                                           border-radius: 25px; 
                                           padding: 0.75em 1.2em; 
                                           border: none;
                                           background: rgba(247, 249, 252, 0.3);
                                           box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                           font-size: 1rem;
                                           transition: background 0.2s;
                                           color: #fff;
                                           backdrop-filter: blur(2px);"
                                    onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                    onblur="this.style.background='rgba(247, 249, 252, 0.3)'">
                                <option value="" style="color: black;">Select a Case Category</option>
                                <option value="Accident" style="color: black;">Accident</option>
                                <option value="Fire" style="color: black;">Fire</option>
                                <option value="Robbery" style="color: black;">Robbery</option>
                                <option value="Kidnapping" style="color: black;">Kidnapping</option>
                                <option value="Fraud" style="color: black;">Fraud</option>
                                <option value="Health" style="color: black;">Health</option>
                                <option value="Vandalism" style="color: black;">Vandalism</option>
                                <option value="Misplace" style="color: black;">Misplace</option>
                            </select></div>
                             <div style="text-align:center; margin-top: -1.5em; color:white;">- OR -</div>
-->
                       
                        <form method="post">
                    <div class="input-center-wrapper">
                        <!-- CATEGORY TAG - FIXED POSITIONING -->
                        <div id="issueCategoryTag" 
                             style="display: none; 
                                    position: relative;
                                    z-index: 100;
                                    margin-bottom: 0.8em;
                                    align-self: flex-start;">
                        </div>

                        <!-- Hidden input to capture category -->
                        <input type="hidden" id="categoryInput" name="category" value="">

                        <!-- TEXTAREA -->
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <textarea id="urgentCaseTextarea" 
                                      name="urgent_case" 
                                      class="form-control" 
                                      placeholder="Type what happened. Min. 10 characters." 
                                      style="width: 100%; 
                                             border-radius: 25px; 
                                             padding: 1.2em 1.2em;
                                             min-height: 110px;
                                             border: none;
                                             background: rgba(247, 249, 252, 0.3);
                                             box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                             font-size: 1rem;
                                             transition: background 0.2s;
                                             color: #fff;
                                             margin-top: -0.1em;
                                             backdrop-filter: blur(2px);"
                                      onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                      onblur="this.style.background='rgba(247, 249, 252, 0.3)'" required></textarea>
                        </div>

                        <!-- GPS AUTO-DETECT LINK -->
                        <h1 id="typing-header" class="display-4 text-white mb-4 animated slideInRight" 
                            style="font-family: 'Courier New', Courier, monospace; font-size: 15px; margin-top: -1.2em;">
                            <a href="#" id="autodetectLink" class="autodetect-link" 
                               style="color: pink; text-decoration:none;">Click to autodetect location</a>
                        </h1>

                        

                        <!-- STATE SELECT -->
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <select id="stateSelect" name="stateSelect"
                                    class="form-control" 
                                    style="width: 100%; 
                                           border-radius: 25px; 
                                           padding: 0.75em 1.2em; 
                                           border: none;
                                           background: rgba(247, 249, 252, 0.3);
                                           box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                           font-size: 1rem;
                                           transition: background 0.2s;
                                           color: #fff;
                                           backdrop-filter: blur(2px);
                                           margin-top:-1.2em;"
                                    onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                    onblur="this.style.background='rgba(247, 249, 252, 0.3)'" required>
                                <option value="" style="color: black;">Select your State</option>
                                <option value="abia" style="color: black;">Abia</option>
                                <option value="adamawa" style="color: black;">Adamawa</option>
                                <option value="akwa_ibom" style="color: black;">Akwa Ibom</option>
                                <option value="anambra" style="color: black;">Anambra</option>
                                <option value="bauchi" style="color: black;">Bauchi</option>
                                <option value="bayelsa" style="color: black;">Bayelsa</option>
                                <option value="benue" style="color: black;">Benue</option>
                                <option value="borno" style="color: black;">Borno</option>
                                <option value="cross_river" style="color: black;">Cross River</option>
                                <option value="delta" style="color: black;">Delta</option>
                                <option value="ebonyi" style="color: black;">Ebonyi</option>
                                <option value="edo" style="color: black;">Edo</option>
                                <option value="ekiti" style="color: black;">Ekiti</option>
                                <option value="enugu" style="color: black;">Enugu</option>
                                <option value="gombe" style="color: black;">Gombe</option>
                                <option value="imo" style="color: black;">Imo</option>
                                <option value="jigawa" style="color: black;">Jigawa</option>
                                <option value="kaduna" style="color: black;">Kaduna</option>
                                <option value="kano" style="color: black;">Kano</option>
                                <option value="katsina" style="color: black;">Katsina</option>
                                <option value="kebbi" style="color: black;">Kebbi</option>
                                <option value="kogi" style="color: black;">Kogi</option>
                                <option value="kwara" style="color: black;">Kwara</option>
                                <option value="lagos" style="color: black;">Lagos</option>
                                <option value="nasarawa" style="color: black;">Nasarawa</option>
                                <option value="niger" style="color: black;">Niger</option>
                                <option value="ogun" style="color: black;">Ogun</option>
                                <option value="ondo" style="color: black;">Ondo</option>
                                <option value="osun" style="color: black;">Osun</option>
                                <option value="oyo" style="color: black;">Oyo</option>
                                <option value="plateau" style="color: black;">Plateau</option>
                                <option value="rivers" style="color: black;">Rivers</option>
                                <option value="sokoto" style="color: black;">Sokoto</option>
                                <option value="taraba" style="color: black;">Taraba</option>
                                <option value="yobe" style="color: black;">Yobe</option>
                                <option value="zamfara" style="color: black;">Zamfara</option>
                                <option value="fct" style="color: black;">FCT</option>
                            </select>
                        </div>

                        <!-- LGA SELECT -->
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <select id="lgaSelect" name="lgaSelect"
                                    class="form-control" 
                                    style="width: 100%; 
                                           border-radius: 25px; 
                                           padding: 0.75em 1.2em; 
                                           border: none;
                                           background: rgba(247, 249, 252, 0.3);
                                           box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                           font-size: 1rem;
                                           transition: background 0.2s;
                                           color: #fff;
                                           backdrop-filter: blur(2px);
                                           margin-top: -1.5em;"
                                    onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                    onblur="this.style.background='rgba(247, 249, 252, 0.3)'" required>
                                <option value="" style="color: black;">Select your LGA</option>
                            </select>
                        </div>

                        <!-- ADDRESS INPUT -->
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <input id="addressInput" name="addressInput"
                                   type="text" 
                                   class="form-control" 
                                   placeholder="What is your address?" 
                                   style="width: 100%; 
                                          border-radius: 25px; 
                                          padding: 0.75em 1.2em; 
                                          border: none;
                                          background: rgba(247, 249, 252, 0.3);
                                          box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                          font-size: 1rem;
                                          transition: background 0.2s;
                                          margin-top: -1.5em;
                                          margin-bottom: -0.5em;
                                          color: #fff;
                                          backdrop-filter: blur(2px);"
                                   onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                   onblur="this.style.background='rgba(247, 249, 252, 0.3)'" required>
                        </div>

                        <!-- GPS INPUT -->
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <input id="gpsInput" name="gpsInput"
                                   type="text" 
                                   class="form-control" 
                                   placeholder="GPS coordinates" 
                                   style="width: 100%; 
                                          border-radius: 25px; 
                                          padding: 0.75em 1.2em;
                                          border: none;
                                          background: rgba(247, 249, 252, 0.3);
                                          box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                          font-size: 1rem;
                                          transition: background 0.2s;
                                          margin-top: -1em;
                                          margin-bottom: -0.5em;
                                          color: #fff;
                                          backdrop-filter: blur(2px);"
                                   onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                   onblur="this.style.background='rgba(247, 249, 252, 0.3)'">
                        </div>

                        <!-- SUBMIT BUTTON -->
                        <div class="mb-4 animated slideInRight input-center-inner" style="margin-top:-0.7em;">
                            <input type="submit" name="submit" 
                                   class="form-control verify-btn"
                                   value="Report"
                                   style="color: black !important;">
                        </div>
                        
<?php 

if (isset($_POST['submit'])) {
    $gpsInput = $_POST['gpsInput'];
    $addressInput = $_POST['addressInput'];
    $lgaSelect = $_POST['lgaSelect'];
    $stateSelect = $_POST['stateSelect'];
    $urgent_case = $_POST['urgent_case'];
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';

    // Get SafeNID and user data from session - 
    $reporterSafeNID = $_SESSION['safenid'];
    $reporterPhone = isset($_SESSION['phone']) ? $_SESSION['phone'] : 'N/A';
    $reporterName = '';
    
    if (isset($_SESSION['user_data'])) {
        $userData = $_SESSION['user_data'];
        $reporterName = $userData['firstname'] . ' ' . $userData['lastname'];
    }

    // Function to read cases from file and find matching email
    function getCaseEmail($category) {
        $casesFile = 'case.txt';
        
        if (!file_exists($casesFile)) {
            return null;
        }
        
        $lines = file($casesFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            $parts = explode(',', $line);
            
            if (count($parts) >= 3) {
                $id = trim($parts[0]);
                $caseName = trim($parts[1]);
                $email = trim($parts[2]);
                
                // Case-insensitive comparison
                if (strcasecmp($caseName, $category) == 0) {
                    return $email;
                }
            }
        }
        
        return null;
    }

    // Get the appropriate email based on category
    $recipientEmail = getCaseEmail($category);
    
    if (!$recipientEmail) {
        $_SESSION['status'] = "Error: Unable to find appropriate department for this case category.";
        echo '<script>window.location.href = window.location.href;</script>';
        exit(0);
    }

    // Create PHPMailer instance
    $mail = new PHPMailer(true);


    try {
        // Server settings
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        
        $mail->Host = 'smtp.gmail.com';
        $mail->Username = 'elitespot.com@gmail.com';
        $mail->Password = 'wtgtfkhquqjihvkb';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('elitespot.com@gmail.com', 'SafeNaija Emergency Alert');
        $mail->addAddress($recipientEmail);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'URGENT: ' . strtoupper($category) . ' Report - SafeNaija';

        // Construct proper message with SafeNID
        $bodyContent = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f9fc;">
            <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                <h1 style="margin: 0;">🚨 EMERGENCY REPORT</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">Case Category: ' . htmlspecialchars($category) . '</h2>
                
                <div style="margin: 20px 0; background-color: #e3f2fd; padding: 15px; border-radius: 5px;">
                    <h3 style="color: #1976d2; margin-bottom: 10px;">👤 Reporter Information:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px; font-weight: bold; width: 30%;">SafeNID:</td>
                            <td style="padding: 5px; color: #1976d2; font-weight: bold;">' . htmlspecialchars($reporterSafeNID) . '</td>
                        </tr>
                        ' .'</td>
                        </tr>
                    </table>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #333; margin-bottom: 10px;">📋 Incident Details:</h3>
                    <p style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; line-height: 1.6;">
                        ' . nl2br(htmlspecialchars($urgent_case)) . '
                    </p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #333; margin-bottom: 10px;">📍 Location Information:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; background-color: #f8f9fa; font-weight: bold; width: 30%;">State:</td>
                            <td style="padding: 8px; background-color: #fff;">' . htmlspecialchars(ucfirst($stateSelect)) . '</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; background-color: #f8f9fa; font-weight: bold;">LGA:</td>
                            <td style="padding: 8px; background-color: #fff;">' . htmlspecialchars(ucfirst($lgaSelect)) . '</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; background-color: #f8f9fa; font-weight: bold;">Address:</td>
                            <td style="padding: 8px; background-color: #fff;">' . htmlspecialchars($addressInput) . '</td>
                        </tr>';
        
        if (!empty($gpsInput)) {
            $bodyContent .= '
                        <tr>
                            <td style="padding: 8px; background-color: #f8f9fa; font-weight: bold;">GPS Coordinates:</td>
                            <td style="padding: 8px; background-color: #fff;">' . htmlspecialchars($gpsInput) . '</td>
                        </tr>';
        }
        
        $bodyContent .= '
                    </table>
                </div>
                
                <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 3px;">
                    <p style="margin: 0; color: #856404;">
                        <strong>⚠️ This is an urgent report that requires immediate attention.</strong>
                    </p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
                    <p><strong>Report Time:</strong> ' . date('F j, Y, g:i a') . '</p>
                    <p><strong>Reporter SafeNID:</strong> ' . htmlspecialchars($reporterSafeNID) . '</p>
                    <p><strong>Reporter Contact:</strong> ' . htmlspecialchars($reporterPhone) . '</p>
                    <p style="margin-top: 15px;">This report was generated automatically by the SafeNaija Emergency Response System.</p>
                </div>
            </div>
        </div>';

        $mail->Body = $bodyContent;
        
        // Plain text alternative
        $mail->AltBody = "URGENT REPORT - " . strtoupper($category) . "\n\n" .
                        "Reporter SafeNID: " . $reporterSafeNID . "\n" .
                        (!empty($reporterName) ? "Reporter Name: " . $reporterName . "\n" : "") .
                        "Reporter Contact: " . $reporterPhone . "\n\n" .
                        "Incident Details:\n" . $urgent_case . "\n\n" .
                        "Location:\n" .
                        "State: " . ucfirst($stateSelect) . "\n" .
                        "LGA: " . ucfirst($lgaSelect) . "\n" .
                        "Address: " . $addressInput . "\n" .
                        (!empty($gpsInput) ? "GPS: " . $gpsInput . "\n" : "") .
                        "\nReport Time: " . date('F j, Y, g:i a');
        
        if($mail->send()) {
            $_SESSION['status'] = "✅ Report submitted successfully! The appropriate agency has been notified and will respond shortly.";
            $_SESSION['status_type'] = "success";
            echo '<script>window.location.href = window.location.href;</script>';
        } else {
            $_SESSION['status'] = "❌ Message could not be sent. Error: {$mail->ErrorInfo}";
            $_SESSION['status_type'] = "error";
        }
        
        echo ' ';
        exit(0);
        
    } catch (Exception $e) {
        $_SESSION['status'] = "❌ Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        $_SESSION['status_type'] = "error";
        echo '<script>window.location.href = window.location.href;</script>';
        exit(0);
    }
}

// Display status message if exists
if (isset($_SESSION['status'])) {
    $statusType = isset($_SESSION['status_type']) ? $_SESSION['status_type'] : 'info';
    $bgColor = $statusType == 'success' ? '#d4edda' : '#f8d7da';
    $textColor = $statusType == 'success' ? '#155724' : '#721c24';
    $borderColor = $statusType == 'success' ? '#c3e6cb' : '#f5c6cb';
    
    echo '<div style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
            <div style="background-color: ' . $bgColor . '; color: ' . $textColor . '; padding: 15px 20px; 
                        border: 1px solid ' . $borderColor . '; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                ' . $_SESSION['status'] . '
            </div>
          </div>';
    
    unset($_SESSION['status']);
    unset($_SESSION['status_type']);
}

?>
                    </div>
                </div>
</form>



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
                    <a href="index.php" class="d-inline-block mb-3">
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

    <!-- Styles -->
    <style>
        .input-center-inner textarea::placeholder,
        .input-center-inner input::placeholder,
        .input-center-inner select {
            color: #ffffff !important;
            opacity: 1 !important;
        }
        
        .input-center-inner textarea,
        .input-center-inner input {
            color: #fff !important;
        }

        .input-center-inner select option {
            color: black !important;
        }
        
        .autodetect-link:hover {
            color: #fff !important;
        }

        .verify-btn {
            width: 100%; 
            border-radius: 25px; 
            padding: 0.75em 1.2em; 
            border: 1.5px solid #bfc9e6;
            background: #f7f9fc;
            box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
            font-size: 1rem;
            transition: border-color 0.2s, background 0.2s, color 0.2s;
            color: black !important;
            cursor: pointer;
        }

        .verify-btn:focus {
            border-color: #1363c6;
            outline: none;
        }

        .verify-btn:hover {
            background: #bed0d8;
            color: black !important;
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

        @media (min-width: 992px) {
            .input-center-wrapper {
                align-items: flex-start;
            }
        }
    </style>

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
    
    <!-- Custom JavaScript for Category Capture -->


 <script>
        // Get references to the elements
        const caseDropDown = document.getElementById('casedropDown');
        const urgentCaseTextarea = document.getElementById('urgentCaseTextarea');

        let typingTimer;
        const typingSpeed = 40;

        // The function that creates the typing effect
        function typeWriter(text) {
            // 1. Give focus to the textarea BEFORE starting the animation.
            urgentCaseTextarea.focus();

            let i = 0;
            urgentCaseTextarea.value = '';

            function type() {
                if (i < text.length) {
                    urgentCaseTextarea.value += text.charAt(i);
                    i++;
                    typingTimer = setTimeout(type, typingSpeed);
                } else {
                    // --- NEW CODE STARTS HERE ---
                    // 2. When typing is finished, remove the focus. 
                    // This is like clicking away from the textarea.
                    urgentCaseTextarea.blur();
                    // --- NEW CODE ENDS HERE ---
                }
            }
            type();
        }

        // Add event listener to the dropdown
        caseDropDown.addEventListener('change', function() {
            clearTimeout(typingTimer);
            
            const selectedText = this.options[this.selectedIndex].text;
            
            if (this.value) {
                const fullText = `The issue is ${selectedText}`;
                typeWriter(fullText);
            } else {
                urgentCaseTextarea.value = '';
            }
        });

    </script>




    <script>
        // Monitor the issueCategoryTag element for changes and capture the category text
        document.addEventListener('DOMContentLoaded', function() {
            const categoryTag = document.getElementById('issueCategoryTag');
            const categoryInput = document.getElementById('categoryInput');
            
            // Create a MutationObserver to watch for changes in the category tag
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        updateCategoryInput();
                    }
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        updateCategoryInput();
                    }
                });
            });
            
            // Configuration of the observer
            const config = { 
                attributes: true, 
                childList: true, 
                characterData: true,
                subtree: true 
            };
            
            // Start observing
            if (categoryTag) {
                observer.observe(categoryTag, config);
            }
            
            // Function to update the hidden input with category value the 
            function updateCategoryInput() {
                if (categoryTag && categoryInput) {
                    const categoryText = categoryTag.textContent.trim();
                    const isVisible = window.getComputedStyle(categoryTag).display !== 'none';
                    
                    if (isVisible && categoryText) {
                        categoryInput.value = categoryText;
                        console.log('Category captured:', categoryText);
                    }
                }
            }
            
            // Also update before form submission
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    updateCategoryInput();
                    
                    // Validate that category is captured
                    if (!categoryInput.value) {
                        e.preventDefault();
                        alert('Please wait for the system to categorize your report before submitting.');
                        return false;
                    }
                });
            }
        });
    </script>
</body>

</html>