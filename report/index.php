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
        font-size: 14px;  /* Mobile first */
        margin-top: 3em;
    }
    
    
    @media (min-width: 600px) {
        #typing-header {
            font-size: 25px;  /* Larger screens */
            margin-top:0em;
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
                        <a href="#home" class="nav-item nav-link active">Home</a>
                        <a href="#home" class="nav-item nav-link active"><b>NIN: </b>1234567890</a>
                        <a href="../signup" class="nav-item nav-link">Logout</a>
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
                    <h1 id="typing-header" class="display-4 text-white mb-4 animated slideInRight" style="font-family: 'Courier New', Courier, monospace;">Report a Case</h1>
                    
                    
                    <div class="input-center-wrapper">
                        <div id="issueCategoryTag" class="tag" style="display: none; background: #fff3cd; color: #d9534f; border-radius: 15px; padding: 0.1em 1em; font-weight: 500; font-size: 12px ; margin-bottom: 0.7em; box-shadow: 0 2px 6px rgba(249, 193, 22, 0.1); border: 1px solid #ffe1a3;">
                            
                        </div>
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <textarea id="urgentCaseTextarea" name="urgent_case" class="form-control" 
                            placeholder="What happened ?" 
                            style="
                                width: 100%; 
                                border-radius: 25px; 
                                padding: 1.2em 1.2em; 
                                min-height: 110px;
                                border: none;
                                background: rgba(247, 249, 252, 0.3);
                                box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                font-size: 1rem;
                                transition: background 0.2s;
                                color: #fff;
                                backdrop-filter: blur(2px);
                            "
                            "
                            onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                            onblur="this.style.background='rgba(247, 249, 252, 0.3)'"></textarea>
                            <style>
                                .input-center-inner textarea::placeholder {
                                    color: #ffffff !important;
                                    opacity: 1 !important;
                                }
                                .input-center-inner textarea {
                                    color: #fff !important;
                                }
                            </style>
                        </div>
                        <h1 id="typing-header" class="display-4 text-white mb-4 animated slideInRight" style="font-family: 'Courier New', Courier, monospace; font-size: 15px;">
                            <a href="#" id="autodetectLink" class="autodetect-link" style="color: pink; text-decoration:none;">Click to autodetect location</a>
                        </h1>
                        <style>
                             #typing-header{
                                margin-top: -1.2em;
                            }
                            .autodetect-link:hover {
                                color: #fff !important;
                            }
                        </style>
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <select 
                                id="stateSelect"
                                class="form-control" 
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
                                    margin-top:-1.2em;
                                "
                                onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                onblur="this.style.background='rgba(247, 249, 252, 0.3)'"
                            >
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
                            <style>
                                .input-center-inner select option {
                                    color: black !important;
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
                                }
                            </style>
                        </div>
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <select 
                                id="lgaSelect"
                                class="form-control" 
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
                                    margin-top: -1.5em;
                                "
                                onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                onblur="this.style.background='rgba(247, 249, 252, 0.3)'"
                            >
                                <option value="" style="color: black;">Select your LGA</option>
                               
                            </select>
                            <style>
                                .input-center-inner select option {
                                    color: black !important;
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
                                }
                            </style>
                        </div>
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <input 
                                id="addressInput"
                                type="text" 
                                class="form-control" 
                                placeholder="What is your address?" 
                                style="
                                    width: 100%; 
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
                                    backdrop-filter: blur(2px);
                                "
                                onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                onblur="this.style.background='rgba(247, 249, 252, 0.3)'"
                            >
                        </div>
                        <div class="mb-4 animated slideInRight input-center-inner">
                            <input 
                                id="gpsInput"
                                type="text" 
                                class="form-control" 
                                placeholder="GPS coordinates" 
                                style="
                                    width: 100%; 
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
                                    backdrop-filter: blur(2px);
                                "
                                onfocus="this.style.background='rgba(247, 249, 252, 0.45)'"
                                onblur="this.style.background='rgba(247, 249, 252, 0.3)'"
                            >
                        </div>
                        <div class="mb-4 animated slideInRight input-center-inner" style="margin-top:-0.7em;">
                            <style>
                                .verify-btn {
                                    width: 100%; 
                                    border-radius: 25px; 
                                    padding: 0.75em 1.2em; 
                                    border: 1.5px solid #bfc9e6;
                                    background: #f7f9fc;
                                    box-shadow: 0 2px 8px rgba(20, 24, 62, 0.05);
                                    font-size: 1rem;
                                    transition: 
                                        border-color 0.2s,
                                        background 0.2s,
                                        color 0.2s;
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
                            <input 
                                type="button" 
                                class="form-control verify-btn"
                                value="Report"
                                style="color: black !important;"
                            >
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


    <!-- Full Screen Search Start -->
    <div class="modal fade" id="searchModal" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content" style="background: rgba(20, 24, 62, 0.7);">
                <div class="modal-header border-0">
                    <button type="button" class="btn btn-square bg-white btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex align-items-center justify-content-center">
                    <div class="input-group" style="max-width: 600px;">
                        <input type="text" class="form-control bg-transparent border-light p-3"
                            placeholder="Type search keyword">
                        <button class="btn btn-light px-4"><i class="bi bi-search"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Full Screen Search End -->







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
        <div class="container wow fadeIn" data-wow-delay="0.1s">
            
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

    <!-- Spell Checker Library for autocorrection -->
    <script src="https://cdn.jsdelivr.net/npm/typo-js@1.1.20/typo.min.js"></script>

    <!-- Template Javascript -->
    <script src="js/main.js"></script>
</body>

</html>