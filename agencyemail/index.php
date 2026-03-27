<?php
$filename = '../report/case.txt';
$message = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['case_id']) && isset($_POST['new_email'])) {
    $caseId = $_POST['case_id'];
    $newEmail = trim($_POST['new_email']);
    
    // Validate email
    if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
        $message = '<div style="color: red;">Invalid email format!</div>';
    } else {
        // Read the file
        $lines = file($filename, FILE_IGNORE_NEW_LINES);
        $updated = false;
        
        // Update the specific case
        foreach ($lines as $index => $line) {
            if ($index === 0) continue; // Skip header
            
            $data = str_getcsv($line);
            if ($data[0] == $caseId) {
                $lines[$index] = $data[0] . ',' . $data[1] . ',' . $newEmail;
                $updated = true;
                break;
            }
        }
        
        // Write back to file
        if ($updated) {
            file_put_contents($filename, implode("\n", $lines));
            $message = '<div style="color: green;">Email updated successfully!</div><br>';
        } else {
            $message = '<div style="color: red;">Case not found!</div>';
        }
    }
}

// Read cases from file
$cases = [];
if (file_exists($filename)) {
    $lines = file($filename, FILE_IGNORE_NEW_LINES);
    foreach ($lines as $index => $line) {
        if ($index === 0) continue; // Skip header
        
        $data = str_getcsv($line);
        if (count($data) >= 3) {
            $cases[] = [
                'id' => $data[0],
                'case' => $data[1],
                'email' => $data[2]
            ];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Case Email Updater</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: bold;
        }
        select, input[type="email"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        button {
            background-color: #1363C6;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        button:hover {
            background-color: #1363C6;
        }
        .current-email {
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
    <script>
        function updateCurrentEmail() {
            const select = document.getElementById('case_id');
            const currentEmailDiv = document.getElementById('current_email');
            const selectedOption = select.options[select.selectedIndex];
            
            if (selectedOption.value) {
                currentEmailDiv.innerHTML = '<strong>Current Email:</strong> ' + selectedOption.getAttribute('data-email');
            } else {
                currentEmailDiv.innerHTML = '';
            }
        }
    </script>
</head>
<body>
    <div class="container">
        <div><a href="../report">Back to Report</a></div>
        <h1>Case Email Updater</h1>
        
        <?php echo $message; ?>
        
        <form method="POST">
            <label for="case_id">Select Case: </label>
            <select name="case_id" id="case_id" required onchange="updateCurrentEmail()">
                <option value="">-- Select a Case --</option>
                <?php foreach ($cases as $case): ?>
                    <option value="<?php echo htmlspecialchars($case['id']); ?>" 
                            data-email="<?php echo htmlspecialchars($case['email']); ?>">
                        Case #<?php echo htmlspecialchars($case['id']); ?> - <?php echo htmlspecialchars($case['case']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            
            <div id="current_email" class="current-email"></div>
            
            <label for="new_email">Enter New Email: <br><br>You can change it to your mail, so you can confirm the Agency Notification Message. </label>
            <input type="email" name="new_email" id="new_email" placeholder="Enter new email address" required>
            
            <button type="submit">Change Email</button>
        </form>
    </div>
</body>
</html>