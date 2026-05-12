<!--
  Program Name: thankyou.php
  Name: Jose Miguel Zuniga
  Date Created: 11/14/2025
  Date Last Edited: 05/11/2026
  Version: 2.0
  Description: Thank-you confirmation page that displays a summary
               of the submitted patient registration data.
-->
<?php
session_start();

// If someone visits this page directly without submitting, redirect them
if (empty($_SESSION['submitted'])) {
    header("Location: index.html");
    exit;
}

$d = $_SESSION['submitted'];

// Clear session after reading so refreshing doesn't re-show stale data
unset($_SESSION['submitted']);

// Helper: display value or dash
function show($val) {
    return htmlspecialchars($val ?: '—');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Divine Heaven Clinic</title>
    <link href="homework4.css" rel="stylesheet">
    <style>
        /* ── Thank-you page specific styles ── */
        .ty-card {
            max-width: 750px;
            margin: 40px auto 0;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 40px;
        }
        .ty-card h2 {
            color: #10B981;
            margin-bottom: 6px;
        }
        .ty-card .sub {
            color: #6B7280;
            margin-bottom: 30px;
            font-size: 15px;
        }
        .review-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .review-table th {
            background: #1E3A5F;
            color: #fff;
            padding: 10px 14px;
            text-align: left;
            font-size: 15px;
        }
        .review-table tr:nth-child(even) td {
            background: #F0FDF4;
        }
        .review-table td {
            padding: 9px 14px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 14px;
            vertical-align: top;
        }
        .review-table td:first-child {
            font-weight: bold;
            color: #374151;
            width: 220px;
        }
        .review-table td:last-child {
            color: #0A192F;
            font-style: italic;
        }
        .section-header td {
            background: #A7F3D0 !important;
            font-weight: bold;
            color: #065F46;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 6px 14px;
        }
        .btn-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .btn-row a, .btn-row button {
            padding: 10px 22px;
            border-radius: 4px;
            font-size: 15px;
            cursor: pointer;
            border: none;
            text-decoration: none;
            font-family: "Times New Roman", serif;
            font-weight: bold;
            transition: background 0.2s;
        }
        .btn-home {
            background: #10B981;
            color: #fff;
        }
        .btn-home:hover { background: #0A192F; color: #fff; }
        .btn-print {
            background: #3B82F6;
            color: #fff;
        }
        .btn-print:hover { background: #1E3A5F; }
        .acct-badge {
            display: inline-block;
            background: #ECFDF5;
            border: 2px solid #10B981;
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 18px;
            font-weight: bold;
            color: #065F46;
            margin-bottom: 24px;
        }
    </style>
</head>
<body>
    <!-- Sticky Header -->
    <header class="sticky-header">
        <img id="logo" src="logo.jpg" alt="Divine Heaven Clinic logo" />
        <h1>Divine Heaven Clinic</h1>
        <p>Today is: <span id="currentDate"></span></p>
    </header>
    <hr>

    <main>
        <div class="ty-card">
            <h2>✅ Registration Successful!</h2>
            <p class="sub">Thank you for registering with Divine Heaven Clinic. We will be contacting you shortly.</p>

            <div class="acct-badge">
                Patient Record #<?= htmlspecialchars($d['id']) ?> &nbsp;·&nbsp; Welcome, <?= show($d['firstName']) ?>!
            </div>

            <!-- ── SUBMISSION SUMMARY TABLE ── -->
            <table class="review-table">
                <thead>
                    <tr><th colspan="2">Submission Summary</th></tr>
                </thead>
                <tbody>
                    <!-- Account -->
                    <tr class="section-header"><td colspan="2">Account Information</td></tr>
                    <tr><td>Username</td>          <td><?= show($d['userID']) ?></td></tr>
                    <tr><td>Password</td>           <td>••••••••  (securely stored)</td></tr>

                    <!-- Personal -->
                    <tr class="section-header"><td colspan="2">Personal Information</td></tr>
                    <tr><td>First Name</td>         <td><?= show($d['firstName']) ?></td></tr>
                    <tr><td>Middle Initial</td>     <td><?= show($d['middleInitial']) ?></td></tr>
                    <tr><td>Last Name</td>          <td><?= show($d['lastName']) ?></td></tr>
                    <tr><td>Date of Birth</td>      <td><?= show($d['dob']) ?></td></tr>
                    <tr><td>SSN</td>                <td><?= show($d['ssn']) ?></td></tr>
                    <tr><td>Gender</td>             <td><?= show($d['gender']) ?></td></tr>
                    <tr><td>Marital Status</td>     <td><?= show($d['marital_status']) ?></td></tr>

                    <!-- Contact -->
                    <tr class="section-header"><td colspan="2">Contact Information</td></tr>
                    <tr><td>Address</td>            <td><?= show($d['address1']) . ($d['address2'] ? ', ' . show($d['address2']) : '') ?></td></tr>
                    <tr><td>City, State, ZIP</td>   <td><?= show($d['city']) ?>, <?= show($d['state']) ?> <?= show($d['zipCode']) ?></td></tr>
                    <tr><td>Email</td>              <td><?= show($d['email']) ?></td></tr>
                    <tr><td>Phone</td>              <td><?= show($d['phoneNumber']) ?></td></tr>

                    <!-- Medical -->
                    <tr class="section-header"><td colspan="2">Medical Information</td></tr>
                    <tr><td>Insurance</td>          <td><?= show($d['insurance']) ?></td></tr>
                    <tr><td>Medical Conditions</td> <td><?= show($d['medicalConditions']) ?></td></tr>
                    <tr><td>Pain Level</td>         <td><?= htmlspecialchars($d['painLevel']) ?> / 10</td></tr>
                    <tr><td>Reason for Visit</td>   <td><?= show($d['description']) ?></td></tr>
                </tbody>
            </table>

            <div class="btn-row">
                <a href="index.html" class="btn-home">← Register Another Patient</a>
                <button onclick="window.print()" class="btn-print">🖨 Print This Page</button>
            </div>
        </div>
    </main>
    <hr>

    <!-- Footer -->
    <footer>
        <div>
            <a href="https://www.uh.edu/">
                <img id="footer-logo" src="logo.jpg" alt="Footer Logo" />
            </a>
            <p>
                <a href="mailto:migyzuniga@gmail.com">migyzuniga@gmail.com</a> |
                <a href="mailto:migyzuniga@gmail.com" class="contact">Contact Us!</a> |
                9999 Elgin Rd, Houston, TX 77004
            </p>
        </div>
    </footer>

    <script>
        const dateEl = document.getElementById('currentDate');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    </script>
</body>
</html>
<!-- End of file: thankyou.php -->
