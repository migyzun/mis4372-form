-- ============================================================
-- Program Name: schema.sql
-- Name: Jose Miguel Zuniga
-- Date Created: 09/23/2025
-- Date Last Edited: 05/11/2026
-- Version: 2.0
-- Description: Creates the patient_db database and patients table
--              for the Divine Heaven Clinic patient registration form.
-- Changes:
-- 2.0 | Added all form fields: conditions, pain level, marital, insurance
-- ============================================================

CREATE DATABASE IF NOT EXISTS patient_db;
USE patient_db;

CREATE TABLE IF NOT EXISTS patients (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    userID          VARCHAR(20)  NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    firstName       VARCHAR(30)  NOT NULL,
    middleInitial   CHAR(1)      DEFAULT NULL,
    lastName        VARCHAR(30)  NOT NULL,
    dob             DATE         NOT NULL,
    ssn             VARCHAR(11)  NOT NULL UNIQUE,
    address1        VARCHAR(30)  NOT NULL,
    address2        VARCHAR(30)  DEFAULT NULL,
    city            VARCHAR(30)  NOT NULL,
    state           CHAR(2)      NOT NULL,
    zipCode         CHAR(5)      NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    phoneNumber     VARCHAR(14)  NOT NULL,
    gender          ENUM('Male','Female','Other') NOT NULL,
    marital_status  ENUM('Single','Married','Divorced') NOT NULL,
    insurance       ENUM('Yes','No','Unsure') NOT NULL,
    description     TEXT         DEFAULT NULL,
    medicalConditions VARCHAR(255) DEFAULT NULL,
    painLevel       TINYINT UNSIGNED DEFAULT 0,
    date_created    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- End of file: schema.sql
-- ============================================================
