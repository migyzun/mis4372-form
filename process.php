<?php
/*
 * Program Name: process.php
 * Name: Jose Miguel Zuniga
 * Date Last Edited: 05/11/2026
 * Version: 2.0
 * Description: Receives POST data from the patient registration form,
 *              validates server-side, inserts into patient_db via PDO,
 *              then redirects to thankyou.php with session data.
 */

session_start();

// ── DB CONFIG ──────────────────────────────────────────────
$db_host = "localhost";
$db_name = "patient_db";
$db_user = "root";
$db_pass = "";          // change to your MySQL root password if set
// ──────────────────────────────────────────────────────────

// ── COLLECT & SANITIZE POST DATA ──────────────────────────
$userID        = trim($_POST['userID']        ?? '');
$password_raw  = $_POST['password']           ?? '';
$firstName     = trim($_POST['firstName']     ?? '');
$middleInitial = trim($_POST['middleInitial'] ?? '');
$lastName      = trim($_POST['lastName']      ?? '');
$dobMonth      = trim($_POST['dobMonth']      ?? '');
$dobDay        = trim($_POST['dobDay']        ?? '');
$dobYear       = trim($_POST['dobYear']       ?? '');
$ssn           = trim($_POST['ssn']           ?? '');
$address1      = trim($_POST['address1']      ?? '');
$address2      = trim($_POST['address2']      ?? '');
$city          = trim($_POST['city']          ?? '');
$state         = trim($_POST['state']         ?? '');
$zipCode       = trim($_POST['zipCode']       ?? '');
$email         = strtolower(trim($_POST['email'] ?? ''));
$phoneNumber   = trim($_POST['phoneNumber']   ?? '');
$gender        = trim($_POST['msex']          ?? '');
$marital       = trim($_POST['marital_status'] ?? '');
$insurance     = trim($_POST['insurance']     ?? '');
$description   = trim($_POST['description']   ?? '');
$painLevel     = intval($_POST['PainLevel']   ?? 0);

// Medical conditions - posted as array
$conditionsArr = $_POST['medicalConditions'] ?? [];
$medicalConditions = implode(', ', array_map('trim', $conditionsArr));

// Build DOB
$dob = '';
if ($dobYear && $dobMonth && $dobDay) {
    $dob = sprintf('%04d-%02d-%02d', intval($dobYear), intval($dobMonth), intval($dobDay));
}

// ── SERVER-SIDE VALIDATION ─────────────────────────────────
$errors = [];

if (strlen($userID) < 5 || strlen($userID) > 20)          $errors[] = "Username must be 5–20 characters.";
if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_\-]{4,19}$/', $userID)) $errors[] = "Invalid username format.";
if (strlen($password_raw) < 8 || strlen($password_raw) > 30) $errors[] = "Password must be 8–30 characters.";
if (!$firstName)                                            $errors[] = "First name is required.";
if (!$lastName)                                             $errors[] = "Last name is required.";
if (!$dob || !strtotime($dob))                             $errors[] = "Valid date of birth is required.";
if (!preg_match('/^\d{3}-\d{2}-\d{4}$/', $ssn))           $errors[] = "SSN must be in XXX-XX-XXXX format.";
if (!$address1)                                             $errors[] = "Address is required.";
if (!$city)                                                 $errors[] = "City is required.";
if (!$state)                                                $errors[] = "State is required.";
if (!preg_match('/^\d{5}$/', $zipCode))                    $errors[] = "Zip code must be 5 digits.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL))             $errors[] = "Valid email is required.";
if (!preg_match('/^\d{3}-\d{3}-\d{4}$/', $phoneNumber))   $errors[] = "Phone must be XXX-XXX-XXXX format.";
if (!in_array($gender,   ['Male','Female','Other']))        $errors[] = "Please select a gender.";
if (!in_array($marital,  ['Single','Married','Divorced']))  $errors[] = "Please select marital status.";
if (!in_array($insurance,['Yes','No','Unsure']))            $errors[] = "Please select insurance status.";

// Stop if server-side errors
if (!empty($errors)) {
    echo "<h3 style='color:red;font-family:sans-serif;'>Submission Error</h3><ul style='font-family:sans-serif;'>";
    foreach ($errors as $e) echo "<li>" . htmlspecialchars($e) . "</li>";
    echo "</ul><a href='index.html'>Go Back</a>";
    exit;
}

// ── PDO CONNECTION ─────────────────────────────────────────
try {
    $dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    die("<p style='font-family:sans-serif;color:red;'>Database connection failed. Please try again later.</p>");
}

// ── INSERT ─────────────────────────────────────────────────
$password_hashed = password_hash($password_raw, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("
        INSERT INTO patients
            (userID, password, firstName, middleInitial, lastName, dob, ssn,
             address1, address2, city, state, zipCode, email, phoneNumber,
             gender, marital_status, insurance, description, medicalConditions, painLevel)
        VALUES
            (:userID, :password, :firstName, :middleInitial, :lastName, :dob, :ssn,
             :address1, :address2, :city, :state, :zipCode, :email, :phoneNumber,
             :gender, :marital_status, :insurance, :description, :medicalConditions, :painLevel)
    ");

    $stmt->execute([
        ':userID'            => $userID,
        ':password'          => $password_hashed,
        ':firstName'         => $firstName,
        ':middleInitial'     => $middleInitial ?: null,
        ':lastName'          => $lastName,
        ':dob'               => $dob,
        ':ssn'               => $ssn,
        ':address1'          => $address1,
        ':address2'          => $address2 ?: null,
        ':city'              => $city,
        ':state'             => $state,
        ':zipCode'           => $zipCode,
        ':email'             => $email,
        ':phoneNumber'       => $phoneNumber,
        ':gender'            => $gender,
        ':marital_status'    => $marital,
        ':insurance'         => $insurance,
        ':description'       => $description ?: null,
        ':medicalConditions' => $medicalConditions ?: null,
        ':painLevel'         => $painLevel,
    ]);

    $newID = $pdo->lastInsertId();

} catch (PDOException $e) {
    // Handle duplicate entry gracefully
    if ($e->getCode() == 23000) {
        echo "<p style='font-family:sans-serif;color:red;'>That username, email, or SSN is already registered. 
              <a href='index.html'>Go back</a> and try different values.</p>";
    } else {
        echo "<p style='font-family:sans-serif;color:red;'>Database error: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
    exit;
}

// ── PASS DATA TO THANK-YOU PAGE VIA SESSION ───────────────
$_SESSION['submitted'] = [
    'id'                => $newID,
    'userID'            => $userID,
    'firstName'         => $firstName,
    'middleInitial'     => $middleInitial,
    'lastName'          => $lastName,
    'dob'               => "$dobMonth/$dobDay/$dobYear",
    'ssn'               => '***-**-' . substr(str_replace('-','',$ssn), -4),
    'address1'          => $address1,
    'address2'          => $address2,
    'city'              => $city,
    'state'             => $state,
    'zipCode'           => $zipCode,
    'email'             => $email,
    'phoneNumber'       => $phoneNumber,
    'gender'            => $gender,
    'marital_status'    => $marital,
    'insurance'         => $insurance,
    'description'       => $description,
    'medicalConditions' => $medicalConditions,
    'painLevel'         => $painLevel,
];

header("Location: thankyou.php");
exit;

// ── End of file: process.php ───────────────────────────────
?>
