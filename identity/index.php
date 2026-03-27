<?php
session_start();

// Function to generate unique SafeNID
function generateSafeNID() {
    $userFolder = 'user';
    if (!is_dir($userFolder)) {
        mkdir($userFolder, 0755, true);
    }
    
    $existingFiles = scandir($userFolder);
    $existingIds = [];
    
    foreach ($existingFiles as $file) {
        if (preg_match('/^(SN\d{4})\.txt$/', $file, $matches)) {
            $existingIds[] = $matches[1];
        }
    }
    
    // Generate unique SafeNID
    do {
        $randomNum = str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT);
        $safeNID = 'SN' . $randomNum;
    } while (in_array($safeNID, $existingIds));
    
    return $safeNID;
}

// Function to check if NIN already exists
function ninExists($nin) {
    $userFolder = 'user';
    if (!is_dir($userFolder)) {
        return false;
    }
    
    $files = scandir($userFolder);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'txt') {
            $filePath = $userFolder . '/' . $file;
            $content = file_get_contents($filePath);
            $data = json_decode($content, true);
            
            if ($data && isset($data['nin']) && $data['nin'] === $nin) {
                return $data['safenid']; // Return existing SafeNID
            }
        }
    }
    return false;
}

// Function to save user data
function saveUserData($userData, $safeNID) {
    $userFolder = 'user';
    if (!is_dir($userFolder)) {
        mkdir($userFolder, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    
    // Prepare data to save
    $saveData = [
        'safenid' => $safeNID,
        'phone' => $userData['phone'],
        'nin' => $userData['nin'],
        'firstname' => $userData['firstname'],
        'middlename' => $userData['middlename'],
        'lastname' => $userData['lastname'],
        'gender' => $userData['gender'],
        'dateOfBirth' => $userData['dateOfBirth'],
        'email' => $userData['email'],
        'address' => $userData['address'],
        'state' => $userData['state'],
        'lga' => $userData['lga'],
        'registered_date' => $timestamp
    ];
    
    // Save to file named after SafeNID
    $filename = $userFolder . '/' . $safeNID . '.txt';
    file_put_contents($filename, json_encode($saveData, JSON_PRETTY_PRINT), LOCK_EX);
    
    return true;
}

// Handle AJAX verification request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
    isset($_SERVER['CONTENT_TYPE']) && 
    strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    
    $input = json_decode(file_get_contents('php://input'), true);
    $nin = isset($input['nin']) ? trim($input['nin']) : '';
    
    // Demo NIN database
    $demoUsers = [
    '12345678901' => [
        'firstname' => 'Chinedu',
        'middlename' => 'Emmanuel',
        'lastname' => 'Okafor',
        'nin' => '12345678901',
        'gender' => 'Male',
        'dateOfBirth' => '1990-05-15',
        'phone' => '08012345678',
        'email' => 'chinedu.okafor@email.com',
        'address' => '123 Allen Avenue, Ikeja',
        'state' => 'Lagos',
        'lga' => 'Ikeja',
    ],
    '23456789012' => [
        'firstname' => 'Amina',
        'middlename' => 'Zainab',
        'lastname' => 'Bello',
        'nin' => '23456789012',
        'gender' => 'Female',
        'dateOfBirth' => '1995-08-22',
        'phone' => '08123456789',
        'email' => 'amina.bello@email.com',
        'address' => '45 Ahmadu Bello Way',
        'state' => 'Kaduna',
        'lga' => 'Kaduna North',
    ],
    '34567890123' => [
        'firstname' => 'Oluwaseun',
        'middlename' => 'Grace',
        'lastname' => 'Adeyemi',
        'nin' => '34567890123',
        'gender' => 'Female',
        'dateOfBirth' => '1988-12-10',
        'phone' => '08098765432',
        'email' => 'seun.adeyemi@email.com',
        'address' => '78 Ring Road, Ibadan',
        'state' => 'Oyo',
        'lga' => 'Ibadan North',
    ],
    '45678901234' => [
        'firstname' => 'Ibrahim',
        'middlename' => 'Musa',
        'lastname' => 'Mohammed',
        'nin' => '45678901234',
        'gender' => 'Male',
        'dateOfBirth' => '1985-03-18',
        'phone' => '07011223344',
        'email' => 'ibrahim.mohammed@email.com',
        'address' => '22 Kano Road',
        'state' => 'Kano',
        'lga' => 'Nassarawa',
    ],
    '56789012345' => [
        'firstname' => 'Chioma',
        'middlename' => 'Amara',
        'lastname' => 'Eze',
        'nin' => '56789012345',
        'gender' => 'Female',
        'dateOfBirth' => '1992-07-25',
        'phone' => '08134567890',
        'email' => 'chioma.eze@email.com',
        'address' => '15 Enugu Road',
        'state' => 'Enugu',
        'lga' => 'Enugu East',
    ],
    '67890123456' => [
        'firstname' => 'Adebayo',
        'middlename' => 'Tunde',
        'lastname' => 'Balogun',
        'nin' => '67890123456',
        'gender' => 'Male',
        'dateOfBirth' => '1987-11-30',
        'phone' => '08055443322',
        'email' => 'adebayo.balogun@email.com',
        'address' => '34 Abeokuta Street',
        'state' => 'Ogun',
        'lga' => 'Abeokuta South',
    ],
    '78901234567' => [
        'firstname' => 'Fatima',
        'middlename' => 'Aisha',
        'lastname' => 'Sani',
        'nin' => '78901234567',
        'gender' => 'Female',
        'dateOfBirth' => '1993-04-12',
        'phone' => '09088776655',
        'email' => 'fatima.sani@email.com',
        'address' => '67 Sokoto Road',
        'state' => 'Sokoto',
        'lga' => 'Sokoto North',
    ],
    '89012345678' => [
        'firstname' => 'Emeka',
        'middlename' => 'Chukwuemeka',
        'lastname' => 'Nwosu',
        'nin' => '89012345678',
        'gender' => 'Male',
        'dateOfBirth' => '1989-09-05',
        'phone' => '07099887766',
        'email' => 'emeka.nwosu@email.com',
        'address' => '89 Owerri Street',
        'state' => 'Imo',
        'lga' => 'Owerri Municipal',
    ],
    '90123456789' => [
        'firstname' => 'Halima',
        'middlename' => 'Yusuf',
        'lastname' => 'Abdullahi',
        'nin' => '90123456789',
        'gender' => 'Female',
        'dateOfBirth' => '1991-12-28',
        'phone' => '08122334455',
        'email' => 'halima.abdullahi@email.com',
        'address' => '12 Maiduguri Road',
        'state' => 'Borno',
        'lga' => 'Maiduguri',
    ],
    '11223344556' => [
        'firstname' => 'Segun',
        'middlename' => 'Olumide',
        'lastname' => 'Akinwunmi',
        'nin' => '11223344556',
        'gender' => 'Male',
        'dateOfBirth' => '1986-06-14',
        'phone' => '08077665544',
        'email' => 'segun.akinwunmi@email.com',
        'address' => '56 Ilorin Street',
        'state' => 'Kwara',
        'lga' => 'Ilorin West',
    ],
    '22334455667' => [
        'firstname' => 'Ngozi',
        'middlename' => 'Chiamaka',
        'lastname' => 'Okoro',
        'nin' => '22334455667',
        'gender' => 'Female',
        'dateOfBirth' => '1994-02-20',
        'phone' => '09011223344',
        'email' => 'ngozi.okoro@email.com',
        'address' => '23 Aba Road',
        'state' => 'Abia',
        'lga' => 'Aba South',
    ],
    '33445566778' => [
        'firstname' => 'Bala',
        'middlename' => 'Yakubu',
        'lastname' => 'Ibrahim',
        'nin' => '33445566778',
        'gender' => 'Male',
        'dateOfBirth' => '1984-08-08',
        'phone' => '08155667788',
        'email' => 'bala.ibrahim@email.com',
        'address' => '45 Bauchi Road',
        'state' => 'Bauchi',
        'lga' => 'Bauchi',
    ],
    '44556677889' => [
        'firstname' => 'Temitope',
        'middlename' => 'Oluwatoyin',
        'lastname' => 'Alabi',
        'nin' => '44556677889',
        'gender' => 'Female',
        'dateOfBirth' => '1996-01-15',
        'phone' => '07033445566',
        'email' => 'temitope.alabi@email.com',
        'address' => '78 Akure Street',
        'state' => 'Ondo',
        'lga' => 'Akure South',
    ],
    '55667788990' => [
        'firstname' => 'Musa',
        'middlename' => 'Abubakar',
        'lastname' => 'Shehu',
        'nin' => '55667788990',
        'gender' => 'Male',
        'dateOfBirth' => '1983-10-22',
        'phone' => '08044556677',
        'email' => 'musa.shehu@email.com',
        'address' => '34 Yola Road',
        'state' => 'Adamawa',
        'lga' => 'Yola North',
    ],
    '66778899001' => [
        'firstname' => 'Blessing',
        'middlename' => 'Mfon',
        'lastname' => 'Ukpong',
        'nin' => '66778899001',
        'gender' => 'Female',
        'dateOfBirth' => '1997-05-30',
        'phone' => '08166778899',
        'email' => 'blessing.ukpong@email.com',
        'address' => '12 Uyo Street',
        'state' => 'Akwa Ibom',
        'lga' => 'Uyo',
    ],
    '77889900112' => [
        'firstname' => 'Sunday',
        'middlename' => 'Ojo',
        'lastname' => 'Olatunji',
        'nin' => '77889900112',
        'gender' => 'Male',
        'dateOfBirth' => '1982-12-03',
        'phone' => '07055667788',
        'email' => 'sunday.olatunji@email.com',
        'address' => '56 Ado Ekiti Road',
        'state' => 'Ekiti',
        'lga' => 'Ado Ekiti',
    ],
    '88990011223' => [
        'firstname' => 'Patience',
        'middlename' => 'Efe',
        'lastname' => 'Omoregie',
        'nin' => '88990011223',
        'gender' => 'Female',
        'dateOfBirth' => '1990-03-17',
        'phone' => '08066778899',
        'email' => 'patience.omoregie@email.com',
        'address' => '23 Benin City Road',
        'state' => 'Edo',
        'lga' => 'Benin City',
    ],
    '99001112234' => [
        'firstname' => 'Yusuf',
        'middlename' => 'Garba',
        'lastname' => 'Bello',
        'nin' => '99001112234',
        'gender' => 'Male',
        'dateOfBirth' => '1988-07-11',
        'phone' => '08177889900',
        'email' => 'yusuf.bello@email.com',
        'address' => '45 Minna Road',
        'state' => 'Niger',
        'lga' => 'Minna',
    ],
    '10111213141' => [
        'firstname' => 'Mercy',
        'middlename' => 'Ejiro',
        'lastname' => 'Edevbie',
        'nin' => '10111213141',
        'gender' => 'Female',
        'dateOfBirth' => '1993-09-25',
        'phone' => '09044556677',
        'email' => 'mercy.edevbie@email.com',
        'address' => '67 Asaba Road',
        'state' => 'Delta',
        'lga' => 'Asaba',
    ],
    '12131415161' => [
        'firstname' => 'Kabiru',
        'middlename' => 'Sani',
        'lastname' => 'Jibril',
        'nin' => '12131415161',
        'gender' => 'Male',
        'dateOfBirth' => '1985-04-08',
        'phone' => '08088990011',
        'email' => 'kabiru.jibril@email.com',
        'address' => '89 Gusau Road',
        'state' => 'Zamfara',
        'lga' => 'Gusau',
    ],
    '13141516171' => [
        'firstname' => 'Uche',
        'middlename' => 'Chidi',
        'lastname' => 'Nnamdi',
        'nin' => '13141516171',
        'gender' => 'Male',
        'dateOfBirth' => '1987-11-14',
        'phone' => '08199001122',
        'email' => 'uche.nnamdi@email.com',
        'address' => '34 Port Harcourt Road',
        'state' => 'Rivers',
        'lga' => 'Port Harcourt',
    ],
    '14151617181' => [
        'firstname' => 'Zainab',
        'middlename' => 'Rukayya',
        'lastname' => 'Lawal',
        'nin' => '14151617181',
        'gender' => 'Female',
        'dateOfBirth' => '1995-06-19',
        'phone' => '07066778899',
        'email' => 'zainab.lawal@email.com',
        'address' => '12 Birnin Kebbi Road',
        'state' => 'Kebbi',
        'lga' => 'Birnin Kebbi',
    ],
    '15161718191' => [
        'firstname' => 'Ifeanyi',
        'middlename' => 'Chukwuma',
        'lastname' => 'Okeke',
        'nin' => '15161718191',
        'gender' => 'Male',
        'dateOfBirth' => '1991-02-28',
        'phone' => '08099001122',
        'email' => 'ifeanyi.okeke@email.com',
        'address' => '56 Awka Road',
        'state' => 'Anambra',
        'lga' => 'Awka South',
    ]
];
    
    if (empty($nin) || strlen($nin) !== 11) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid NIN format'
        ]);
        exit;
    }
    
    // Check if NIN exists in demo database
    if (isset($demoUsers[$nin])) {
        $userData = $demoUsers[$nin];
        
        // Check if user already registered
        $existingSafeNID = ninExists($nin);
        
        if ($existingSafeNID) {
            // User already exists - notify them
            echo json_encode([
                'success' => false,
                'message' => 'Account already exists with this NIN. Please login instead.',
                'already_exists' => true
            ]);
        } else {
            // New user - generate SafeNID and save
            $safeNID = generateSafeNID();
            
            // Save to user folder as individual file
            if (saveUserData($userData, $safeNID)) {
                // Store in session
                $_SESSION['safenid'] = $safeNID;
                $_SESSION['phone'] = $userData['phone'];
                $_SESSION['nin'] = $nin;
                $_SESSION['user_data'] = $userData;
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Registration successful',
                    'safenid' => $safeNID,
                    'redirect' => '../payment'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Registration failed. Please try again.'
                ]);
            }
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'NIN not found. Please check and try again.'
        ]);
    }
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>SafeNaija - Signup</title>
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
    
    .verify-btn {
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
    
    .verify-btn:focus {
        border-color: #1363c6;
        outline: none;
    }

    .verify-btn:hover {
        background: #bed0d8;
        color: black !important;
    }
    
    .verify-btn:disabled {
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
                        <a href="../home" class="nav-item nav-link active">Home</a>
                        <a href="../login" class="nav-item nav-link">Login</a>
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
                    <div class="demo">
                        <button id="demo-btn" style="
                            background: linear-gradient(135deg, #e8e8e6 0%, #d1d1d1 100%);
                            color: #000;
                            border: none;
                            padding: 7px 23px;
                            border-radius: 25px;
                            font-weight: 600;
                            font-size: 0.8rem;
                            margin-bottom:1em;
                            cursor: pointer;
                            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
                            transition: all 0.3s;
                            opacity: 0.9;
                        " onmouseover="this.style.boxShadow='0 6px 20px rgba(255, 215, 0, 0.6)'" onmouseout="this.style.boxShadow='0 4px 15px rgba(255, 215, 0, 0.4)'">
                            Click to see Demo Users
                        </button>
                    </div>

                    <!-- Demo Users Modal -->
                    <div id="demoModal" style="
                        display: none;
                        position: fixed;
                        z-index: 1000;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        animation: fadeIn 0.3s;
                    ">
                        <div style="
                            background-color: white;
                            margin: 5% auto;
                            padding: 30px;
                            border-radius: 10px;
                            width: 90%;
                            max-width: 600px;
                            max-height: 80vh;
                            overflow-y: auto;
                            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h2 style="color: #1e3c72; margin: 0;">Demo Users List</h2>
                                <button id="closeModal" style="
                                    background: none;
                                    border: none;
                                    font-size: 28px;
                                    cursor: pointer;
                                    color: #999;
                                ">&times;</button>
                            </div>
                            
                            <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
                                Use any NIN below to test the registration:
                            </p>
                            
                            <div id="demoUsersList" style="
                                background: #f9f9f9;
                                border: 1px solid #ddd;
                                border-radius: 8px;
                                padding: 15px;
                            "></div>

                            <p style="color: #999; margin-top: 20px; font-size: 12px; text-align: center;">
                                Each user is linked to a unique NIN for testing purposes.
                            </p>
                        </div>
                    </div>

                    <style>
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        
                        .demo-user-row {
                            padding: 12px;
                            border-bottom: 1px solid #eee;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            transition: background 0.2s;
                        }
                        
                        .demo-user-row:hover {
                            background: #f0f0f0;
                        }
                        
                        .demo-user-info {
                            flex: 1;
                        }
                        
                        .demo-user-name {
                            font-weight: 600;
                            color: #1e3c72;
                            margin-bottom: 4px;
                        }
                        
                        .demo-user-nin {
                            font-family: monospace;
                            color: #666;
                            font-size: 14px;
                        }
                        
                        .demo-copy-btn {
                            background: #1e3c72;
                            color: white;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 12px;
                            transition: background 0.2s;
                        }
                        
                        .demo-copy-btn:hover {
                            background: #2a5298;
                        }
                    </style>

                    <script>
                        // Demo users data
                        const demoUsers = {
                            '12345678901': 'Chinedu Emmanuel Okafor',
                            '23456789012': 'Amina Zainab Bello',
                            '34567890123': 'Oluwaseun Grace Adeyemi',
                            '45678901234': 'Ibrahim Musa Mohammed',
                            '56789012345': 'Chioma Amara Eze',
                            '67890123456': 'Adebayo Tunde Balogun',
                            '78901234567': 'Fatima Aisha Sani',
                            '89012345678': 'Emeka Chukwuemeka Nwosu',
                            '90123456789': 'Halima Yusuf Abdullahi',
                            '11223344556': 'Segun Olumide Akinwunmi',
                            '22334455667': 'Ngozi Chiamaka Okoro',
                            '33445566778': 'Bala Yakubu Ibrahim',
                            '44556677889': 'Temitope Oluwatoyin Alabi',
                            '55667788990': 'Musa Abubakar Shehu',
                            '66778899001': 'Blessing Mfon Ukpong',
                            '77889900112': 'Sunday Ojo Olatunji',
                            '88990011223': 'Patience Efe Omoregie',
                            '99001112234': 'Yusuf Garba Bello',
                            '10111213141': 'Mercy Ejiro Edevbie',
                            '12131415161': 'Kabiru Sani Jibril',
                            '13141516171': 'Uche Chidi Nnamdi',
                            '14151617181': 'Zainab Rukayya Lawal',
                            '15161718191': 'Ifeanyi Chukwuma Okeke'
                        };

                        const demoBtn = document.getElementById('demo-btn');
                        const demoModal = document.getElementById('demoModal');
                        const closeModal = document.getElementById('closeModal');
                        const demoUsersList = document.getElementById('demoUsersList');

                        // Open modal
                        demoBtn.addEventListener('click', function() {
                            demoModal.style.display = 'block';
                            
                            // Populate the list
                            demoUsersList.innerHTML = '';
                            Object.entries(demoUsers).forEach(([nin, name]) => {
                                const row = document.createElement('div');
                                row.className = 'demo-user-row';
                                row.innerHTML = `
                                    <div class="demo-user-info">
                                        <div class="demo-user-name">${name}</div>
                                        <div class="demo-user-nin">${nin}</div>
                                    </div>
                                    <button class="demo-copy-btn" onclick="copyToNINInput('${nin}')">Use This</button>
                                `;
                                demoUsersList.appendChild(row);
                            });
                        });

                        // Close modal
                        closeModal.addEventListener('click', function() {
                            demoModal.style.display = 'none';
                        });

                        // Close when clicking outside modal
                        window.addEventListener('click', function(event) {
                            if (event.target === demoModal) {
                                demoModal.style.display = 'none';
                            }
                        });

                        // Copy NIN to input field
                        function copyToNINInput(nin) {
                            const ninInput = document.getElementById('nin-input');
                            ninInput.value = nin;
                            ninInput.focus();
                            demoModal.style.display = 'none';
                        }
                    </script>
                    <script>
                        function startTypingHeader() {
                            const txt = "Verify your NIN to continue";
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
                                id="nin-input"
                                placeholder="Enter Your NIN" 
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
                                class="form-control verify-btn"
                                value="Signup"
                                id="verify-button"
                                style="color: #000 !important;"
                            >
                        </div>
                        
                        <!-- Alert Box -->
                        <div id="alert-box" class="input-center-inner"></div>
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
    
    <!-- NIN Verification Script -->
    <script>
        const verifyButton = document.getElementById('verify-button');
        const ninInput = document.getElementById('nin-input');
        const alertBox = document.getElementById('alert-box');
        
        // Allow only numbers in NIN input
        ninInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
        
        // Allow Enter key to trigger verification
        ninInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyButton.click();
            }
        });
        
        verifyButton.addEventListener('click', async function() {
            const nin = ninInput.value.trim();
            
            // Clear previous messages
            alertBox.innerHTML = '';
            
            // Validation
            if (!nin) {
                showAlert('Please enter your NIN', 'warning');
                return;
            }
            
            if (nin.length !== 11) {
                showAlert('NIN must be exactly 11 digits', 'warning');
                return;
            }
            
            // Disable button and show loading
            verifyButton.disabled = true;
            const originalValue = verifyButton.value;
            verifyButton.value = 'Verifying...';
            
            try {
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nin: nin
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert(result.message + ' (SafeNID: ' + result.safenid + ')', 'success');
                    
                    // Redirect to report page after short delay
                    setTimeout(() => {
                        window.location.href = result.redirect;
                    }, 1500);
                } else {
                    showAlert(result.message, 'danger');
                }
                
            } catch (error) {
                showAlert('Error connecting to verification service. Please try again.', 'danger');
                console.error('Error:', error);
            } finally {
                // Re-enable button if there was an error
                if (!verifyButton.value.includes('Verifying')) {
                    verifyButton.disabled = false;
                    verifyButton.value = originalValue;
                }
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
            
            // Auto-hide after 5 seconds (except for success message which redirects)
            if (type !== 'success') {
                setTimeout(() => {
                    alertBox.innerHTML = '';
                    verifyButton.disabled = false;
                    verifyButton.value = 'Signup';
                }, 5000);
            }
        }
    </script>
</body>
</html>