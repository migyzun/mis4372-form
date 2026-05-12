/*
 * Program name: homework4.js
 * Name: Jose Miguel Zuniga
 * Date Created: 10/20/25
 * Date Last Edited: 05/11/2026
 * Version: 5.0
 * Description: Homework 4 JS - all validation, cookie/localStorage, Fetch API
 * Changes:
 * 5.0 | Added zip-code auto-fill via zippopotam.us API
 */

// ── PAIN LEVEL ────────────────────────────────────────────
function updatePainLevel(value) {
    document.getElementById("painValue").textContent = value;
}

// ── REVIEW DISPLAY ────────────────────────────────────────
function displayInput() {
    var formContents = new FormData(document.getElementById("patientForm"));
    var formOutput = "<table class='output'><thead><tr><th colspan='2'>Your Information</th></tr></thead><tbody>";

    for (var [key, value] of formContents.entries()) {
        var input = document.querySelector(`[name="${key}"]`);
        if (!input) continue;
        var type = input.type;
        if (type === "checkbox" && !input.checked) continue;
        if (type === "radio"    && !input.checked) continue;
        switch (type) {
            case "checkbox": formOutput += `<tr><td align='right'>${key}</td><td class='outputdata'>&#x2713;</td></tr>`; break;
            case "password":  formOutput += `<tr><td align='right'>${key}</td><td class='outputdata'>${"*".repeat(value.length)}</td></tr>`; break;
            default:          formOutput += `<tr><td align='right'>${key}</td><td class='outputdata'>${value}</td></tr>`; break;
        }
    }
    document.getElementById("reviewArea").innerHTML = formOutput + "</tbody></table>";
}

// ── VALIDATE USER ID ─────────────────────────────────────
function validateUserID() {
    var userIDInput = document.getElementById("userID");
    var userID = userIDInput.value.toLowerCase();
    var userIDError = document.getElementById("userIDError");
    userIDError.textContent = "";
    if (userID.length === 0) return false;
    if (userID.length < 5 || userID.length > 20) { userIDError.textContent = "ERROR: Username must be between 5 and 20 characters."; return false; }
    if (!isNaN(userID.charAt(0))) { userIDError.textContent = "ERROR: Username cannot start with a number."; return false; }
    if (!/^[a-z0-9_-]+$/.test(userID)) { userIDError.textContent = "ERROR: Username can only contain letters, numbers, underscores, or dashes."; return false; }
    userIDInput.value = userID;
    checkFormValidity();
    return true;
}

// ── VALIDATE PASSWORD ────────────────────────────────────
function validatePassword() {
    var password = document.getElementById("password").value;
    var passwordError = document.getElementById("passwordError");
    var userID = document.getElementById("userID").value.toLowerCase();
    passwordError.textContent = "";
    if (password.length === 0) return false;
    if (password.length < 8 || password.length > 30) { passwordError.textContent = "ERROR: Password must be between 8 and 30 characters long."; return false; }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) { passwordError.textContent = "ERROR: Password must include at least one uppercase letter, one lowercase letter, and one digit."; return false; }
    if (userID.length > 0 && password.toLowerCase().includes(userID)) { passwordError.textContent = "ERROR: Password cannot contain your username."; return false; }
    checkFormValidity();
    return true;
}

// ── VALIDATE PASSWORD MATCH ──────────────────────────────
function validatePasswordMatch() {
    var password = document.getElementById("password").value;
    var reEnteredPassword = document.getElementById("re_password").value;
    var passwordMatchError = document.getElementById("passwordMatchError");
    passwordMatchError.textContent = "";
    if (reEnteredPassword.length === 0) return false;
    if (password !== reEnteredPassword) { passwordMatchError.textContent = "ERROR: Passwords do not match."; return false; }
    checkFormValidity();
    return true;
}

// ── VALIDATE FIRST NAME ──────────────────────────────────
function validateFirstName() {
    var firstName = document.getElementById("firstName").value;
    var firstNameError = document.getElementById("firstNameError");
    firstNameError.textContent = "";
    if (firstName.length === 0) return false;
    if (firstName.length < 1 || firstName.length > 30 || !/^[A-Za-z'-]+$/.test(firstName)) {
        firstNameError.textContent = "ERROR: Please enter a valid first name (letters, apostrophes, dashes, 1-30 chars).";
        return false;
    }
    checkFormValidity();
    return true;
}

// ── VALIDATE MIDDLE INITIAL ──────────────────────────────
function validateMiddleInitial() {
    var mi = document.getElementById("middleInitial").value;
    var miError = document.getElementById("middleInitialError");
    miError.textContent = "";
    if (mi && !/^[A-Za-z]$/.test(mi)) { miError.textContent = "ERROR: Middle initial must be a single letter."; return false; }
    checkFormValidity();
    return true;
}

// ── VALIDATE LAST NAME ───────────────────────────────────
function validateLastName() {
    var lastName = document.getElementById("lastName").value;
    var lastNameError = document.getElementById("lastNameError");
    lastNameError.textContent = "";
    if (lastName.length === 0) return false;
    if (!/^[A-Za-z' -]{1,30}$/.test(lastName)) { lastNameError.textContent = "ERROR: Please enter a valid last name (1-30 characters)."; return false; }
    checkFormValidity();
    return true;
}

// ── VALIDATE DOB ─────────────────────────────────────────
function dobValidation() {
    const month = document.getElementById("dobMonth").value;
    const day   = document.getElementById("dobDay").value;
    const year  = document.getElementById("dobYear").value;
    const error = document.getElementById("dobError");
    error.textContent = "";
    if (month === "" || day === "" || year === "") {
        if (month !== "" || day !== "" || year !== "") error.textContent = "ERROR: Please complete all date fields.";
        return false;
    }
    const monthNum = parseInt(month), dayNum = parseInt(day), yearNum = parseInt(year);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) { error.textContent = "ERROR: Month must be between 01 and 12."; return false; }
    if (isNaN(dayNum)   || dayNum   < 1 || dayNum   > 31) { error.textContent = "ERROR: Day must be between 01 and 31."; return false; }
    if (isNaN(yearNum)  || year.length !== 4)              { error.textContent = "ERROR: Year must be 4 digits."; return false; }
    const date    = new Date(yearNum, monthNum - 1, dayNum);
    const maxDate = new Date(); maxDate.setFullYear(maxDate.getFullYear() - 120);
    if (date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) { error.textContent = "ERROR: Invalid date."; return false; }
    if (date > new Date())  { error.textContent = "ERROR: Date cannot be in the future."; return false; }
    if (date < maxDate)     { error.textContent = "ERROR: Date cannot be more than 120 years ago."; return false; }
    checkFormValidity();
    return true;
}

// ── SSN ──────────────────────────────────────────────────
function formatSSN() {
    var inp = document.getElementById("ssn");
    var raw = inp.value.replace(/\D/g, "").slice(0, 9);
    inp.value = raw.length > 0 ? raw.slice(0,3) + (raw.length > 3 ? "-" + raw.slice(3,5) : "") + (raw.length > 5 ? "-" + raw.slice(5,9) : "") : "";
}
function validateSSN() {
    var inp = document.getElementById("ssn");
    var error = document.getElementById("ssnError");
    var valid = inp.value.replace(/\D/g, "").length === 9;
    error.textContent = valid ? "" : "ERROR: Enter exactly 9 digits for a valid SSN.";
    checkFormValidity();
    return valid;
}

// ── ADDRESS ──────────────────────────────────────────────
function validateAddress() {
    var val = document.getElementById("address1").value.trim();
    var error = document.getElementById("addressError");
    if (val.length === 0) return false;
    if (val.length < 2 || val.length > 30) { error.textContent = "ERROR: Address must be between 2 and 30 characters."; return false; }
    error.textContent = "";
    checkFormValidity();
    return true;
}
function validateAddress2() {
    var val = document.getElementById("address2").value.trim();
    var error = document.getElementById("address2Error");
    if (val.length > 0 && (val.length < 2 || val.length > 30)) { error.textContent = "ERROR: Address 2 must be between 2 and 30 characters."; return false; }
    error.textContent = "";
    checkFormValidity();
    return true;
}

// ── CITY ─────────────────────────────────────────────────
function validateCity() {
    var val = document.getElementById("city").value.trim();
    var error = document.getElementById("cityError");
    if (val.length === 0) return false;
    if (val.length < 2 || val.length > 30) { error.textContent = "ERROR: City must be between 2 and 30 characters."; return false; }
    error.textContent = "";
    checkFormValidity();
    return true;
}

// ── STATE ────────────────────────────────────────────────
function validateState() {
    var state = document.getElementById("state").value;
    var error = document.getElementById("stateError");
    if (state === "") { error.textContent = "ERROR: Please select a state."; return false; }
    error.textContent = "";
    checkFormValidity();
    return true;
}

// ── ZIP CODE (with API auto-fill) ────────────────────────
function validateZipCode() {
    var zip   = document.getElementById("zipCode").value.trim();
    var error = document.getElementById("zipCodeError");
    error.textContent = "";
    if (zip.length === 0) return false;
    if (!/^\d{5}$/.test(zip)) { error.textContent = "ERROR: Please enter a valid 5-digit Zip Code."; return false; }
    // Auto-fill city & state from ZIP API
    fetch(`https://api.zippopotam.us/us/${zip}`)
        .then(r => { if (r.ok) return r.json(); })
        .then(data => {
            if (data) {
                document.getElementById("city").value  = data.places[0]['place name'];
                document.getElementById("state").value = data.places[0]['state abbreviation'];
            }
        })
        .catch(() => {});
    checkFormValidity();
    return true;
}

// ── EMAIL ────────────────────────────────────────────────
function validateEmail() {
    var email = document.getElementById("email").value;
    var error = document.getElementById("emailError");
    error.textContent = "";
    if (email.length === 0) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { error.textContent = "ERROR: Please enter a valid email address (name@domain.tld)."; return false; }
    checkFormValidity();
    return true;
}

// ── PHONE ────────────────────────────────────────────────
function formatPhoneNumber() {
    var inp = document.getElementById("phoneNumber");
    var raw = inp.value.replace(/\D/g, "").slice(0, 10);
    inp.value = raw.length > 0 ? raw.slice(0,3) + (raw.length > 3 ? "-" + raw.slice(3,6) : "") + (raw.length > 6 ? "-" + raw.slice(6,10) : "") : "";
}
function validatePhoneNumber() {
    var inp = document.getElementById("phoneNumber");
    var error = document.getElementById("phoneError");
    var valid = inp.value.replace(/\D/g, "").length === 10;
    error.textContent = valid ? "" : "ERROR: Please enter a valid 10-digit phone number.";
    checkFormValidity();
    return valid;
}

// ── RADIO GROUPS ─────────────────────────────────────────
function validateGender() {
    var v = document.querySelector('input[name="msex"]:checked');
    var e = document.getElementById("genderError");
    if (!v) { e.textContent = "ERROR: Please select a gender."; return false; }
    e.textContent = ""; checkFormValidity(); return true;
}
function validateMaritalStatus() {
    var v = document.querySelector('input[name="marital_status"]:checked');
    var e = document.getElementById("maritalError");
    if (!v) { e.textContent = "ERROR: Please select your marital status."; return false; }
    e.textContent = ""; checkFormValidity(); return true;
}
function validateInsurance() {
    var v = document.querySelector('input[name="insurance"]:checked');
    var e = document.getElementById("insuranceError");
    if (!v) { e.textContent = "ERROR: Please select if you have insurance."; return false; }
    e.textContent = ""; checkFormValidity(); return true;
}

// ── DESCRIPTION ──────────────────────────────────────────
function validateDescription() {
    var val = document.getElementById("description").value;
    var error = document.getElementById("descriptionError");
    error.textContent = "";
    if (val.includes('"')) { error.textContent = 'ERROR: Please avoid using double quotes.'; return false; }
    checkFormValidity();
    return true;
}

// ── CHECK FORM VALIDITY ───────────────────────────────────
function checkFormValidity() {
    let isValid = true;
    var f = (id) => document.getElementById(id);
    if (!f("userID").value   || f("userID").value.length < 5)   isValid = false;
    if (!f("password").value || f("password").value.length < 8)  isValid = false;
    if (!f("re_password").value || f("password").value !== f("re_password").value) isValid = false;
    if (!f("firstName").value) isValid = false;
    if (!f("lastName").value)  isValid = false;
    if (!f("dobMonth").value || !f("dobDay").value || !f("dobYear").value) isValid = false;
    if (f("ssn").value.replace(/\D/g,"").length !== 9) isValid = false;
    if (!f("address1").value.trim() || f("address1").value.trim().length < 2) isValid = false;
    if (!f("city").value.trim()     || f("city").value.trim().length < 2)     isValid = false;
    if (!f("state").value)    isValid = false;
    if (f("zipCode").value.trim().length !== 5) isValid = false;
    if (!f("email").value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f("email").value)) isValid = false;
    if (f("phoneNumber").value.replace(/\D/g,"").length !== 10) isValid = false;
    if (!document.querySelector('input[name="msex"]:checked'))           isValid = false;
    if (!document.querySelector('input[name="marital_status"]:checked')) isValid = false;
    if (!document.querySelector('input[name="insurance"]:checked'))      isValid = false;

    document.querySelectorAll('.error-message').forEach(el => {
        if (el.textContent.trim() !== "") isValid = false;
    });

    var btn = document.getElementById("submitButton");
    if (btn) btn.style.display = isValid ? "inline-block" : "none";
    return isValid;
}

// ── VALIDATE ALL (Validate button) ───────────────────────
function validateForm() {
    let isValid = true;
    let msgs = [];
    if (!validateUserID())        { isValid = false; msgs.push("Username"); }
    if (!validatePassword())      { isValid = false; msgs.push("Password"); }
    if (!validatePasswordMatch()) { isValid = false; msgs.push("Password Match"); }
    if (!validateFirstName())     { isValid = false; msgs.push("First Name"); }
    if (!validateMiddleInitial()) { isValid = false; msgs.push("Middle Initial"); }
    if (!validateLastName())      { isValid = false; msgs.push("Last Name"); }
    if (!dobValidation())         { isValid = false; msgs.push("Date of Birth"); }
    if (!validateSSN())           { isValid = false; msgs.push("SSN"); }
    if (!validateAddress())       { isValid = false; msgs.push("Address 1"); }
    if (!validateAddress2())      { isValid = false; msgs.push("Address 2"); }
    if (!validateCity())          { isValid = false; msgs.push("City"); }
    if (!validateState())         { isValid = false; msgs.push("State"); }
    if (!validateZipCode())       { isValid = false; msgs.push("Zip Code"); }
    if (!validateEmail())         { isValid = false; msgs.push("Email"); }
    if (!validatePhoneNumber())   { isValid = false; msgs.push("Phone Number"); }
    if (!validateGender())        { isValid = false; msgs.push("Gender"); }
    if (!validateMaritalStatus()) { isValid = false; msgs.push("Marital Status"); }
    if (!validateInsurance())     { isValid = false; msgs.push("Insurance"); }
    if (!validateDescription())   { isValid = false; msgs.push("Description"); }

    var summary = document.getElementById("validationSummary");
    if (isValid) {
        document.getElementById("submitButton").style.display = "inline-block";
        summary.innerHTML = "<p style='color:green;font-weight:bold;margin-top:20px;'>✓ All fields are valid! You may now submit the form.</p>";
    } else {
        document.getElementById("submitButton").style.display = "none";
        summary.innerHTML = "<p style='color:red;font-weight:bold;margin-top:20px;'>✗ Please correct: " + msgs.join(", ") + "</p>";
    }
    return isValid;
}

// ── CLEAR ALL ERRORS ─────────────────────────────────────
function clearAllErrors() {
    ["userIDError","passwordError","passwordMatchError","firstNameError","middleInitialError",
     "lastNameError","dobError","ssnError","addressError","address2Error","cityError",
     "stateError","zipCodeError","emailError","phoneError","genderError","maritalError",
     "insuranceError","descriptionError"].forEach(id => {
        var el = document.getElementById(id); if (el) el.textContent = "";
    });
    var s = document.getElementById("validationSummary"); if (s) s.innerHTML = "";
    var r = document.getElementById("reviewArea");         if (r) r.innerHTML = "";
    var b = document.getElementById("submitButton");       if (b) b.style.display = "none";
}

/* End of file: homework4.js */
