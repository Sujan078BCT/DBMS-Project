CREATE DATABASE IF NOT EXISTS pg_database;
USE pg_database;
-- Create Users Table
CREATE TABLE USERS
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE
);

-- Create Admin Table
CREATE TABLE ADMIN
(
    id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Create Student Table
CREATE TABLE STUDENT
(
    id INT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    faculty VARCHAR(20) NOT NULL,
    gpa DECIMAL(3, 2) CHECK (
        gpa >= 0.7
            AND gpa <= 5
    ),
    address VARCHAR(50) NOT NULL,
    FOREIGN KEY (id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE unaccepted_student(
    id INT PRIMARY KEY AUTO_INCREMENT,
	first_name VARCHAR(20),
	last_name VARCHAR(20),
    email VARCHAR(50),
    faculty VARCHAR(20),
    address VARCHAR(50),
    type VARCHAR(20),
    password VARCHAR(100)
);
-- Create Mobile Table
CREATE TABLE MOBILE
(
    id INT,
    number VARCHAR(20) NOT NULL,
    PRIMARY KEY (id, number),
    FOREIGN KEY (id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Domestic Table
CREATE TABLE DOMESTIC
(
    id INT PRIMARY KEY,
    dom_id VARCHAR(10),
    FOREIGN KEY (id) REFERENCES STUDENT(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Create International Table
CREATE TABLE International
(
    id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES STUDENT(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Supervisor Table
CREATE TABLE SUPERVISOR
(
    id INT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20),
    faculty VARCHAR(20) NOT NULL,
    address VARCHAR(50),
    cluster tinyInt NOT NULL, -- added column
    FOREIGN KEY (id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Course Table
CREATE TABLE COURSE
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    code VARCHAR(10) NOT NULL,
    credit_hours INT NOT NULL,
    fees DECIMAL(8, 2) NOT NULL
);

-- create table taken_by
CREATE TABLE TAKEN_BY
(
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    marks Decimal(5, 2) CHECK (
        marks >= 0.0
            AND marks <= 100.0
    ),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES International(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES COURSE(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Create Thesis Table
CREATE TABLE THESIS (
    serial_number INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    start_date DATETIME,
    end_date DATETIME,
    duration VARCHAR(40) AS (CONCAT((TIMESTAMPDIFF(YEAR,start_date,end_date)),' years ',(TIMESTAMPDIFF(MONTH,start_date,end_date))%12,' months')) VIRTUAL,
    marks DECIMAL(5, 2) CHECK (marks >= 0.0 AND marks <= 100.0),
    field VARCHAR(50) NOT NULL,
    Presentation_date DATETIME,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES STUDENT(id) ON DELETE CASCADE ON UPDATE CASCADE,
);
-- create table supervised
CREATE TABLE SUPERVISED
(
    supervisor_id INT NOT NULL,
    thesis_serial_number INT NOT NULL,
    PRIMARY KEY (supervisor_id, thesis_serial_number),
    FOREIGN KEY (supervisor_id) REFERENCES SUPERVISOR(id) ON DELETE CASCADE ON UPDATE CASCADE,
    Foreign Key (thesis_serial_number) REFERENCES THESIS(serial_number) ON DELETE CASCADE ON UPDATE CASCADE
);

-- create table report
CREATE TABLE REPORT
(
    thesis_serial_number INT NOT NULL,
    state INT,
    report_date DATE NOT NULL,
    report_number INT NOT NULL,
    description VARCHAR(200),
    evaluation INT DEFAULT 0 CHECK (
        evaluation >= 0 AND evaluation <= 100
    ),
    supervisor_id int,
    PRIMARY KEY (thesis_serial_number, report_number),
    FOREIGN KEY (thesis_serial_number) REFERENCES THESIS(serial_number) ON DELETE CASCADE ON UPDATE cascade,
    FOREIGN KEY (supervisor_id) REFERENCES SUPERVISOR(id) 
);

DELIMITER $$
CREATE TRIGGER auto_increment_report_number
BEFORE INSERT ON REPORT
FOR EACH ROW
BEGIN
    DECLARE max_report_number INT; -- declare variable

    -- Find the maximum report_number for the given thesis_serial_number
    SELECT COALESCE(MAX(report_number), 0) -- coalesce function put 0 into max_report_number if no entry with that thesis serial number is found.
    INTO max_report_number
    FROM REPORT
    WHERE thesis_serial_number = NEW.thesis_serial_number;

    -- Set the new report_number
    SET NEW.report_number = max_report_number + 1;
END $$
DELIMITER ;
-- create table defense
CREATE TABLE DEFENSE
(
    thesis_serial_number INT NOT NULL,
    defense_date DATETIME NOT NULL,
    location VARCHAR(15) NOT NULL,
    grade DECIMAL(5, 2) CHECK (
        grade >= 0.0
            AND grade <= 100.0
    ),
    PRIMARY KEY (thesis_serial_number, defense_date),
    FOREIGN KEY (thesis_serial_number) REFERENCES THESIS(serial_number) ON DELETE CASCADE ON UPDATE CASCADE
);

-- create table examiner
CREATE TABLE EXAMINER
(
    id INT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    type TINYINT(1) NOT NULL,
    field_of_work VARCHAR(50) NOT NULL,
    cluster VARCHAR(50)
    FOREIGN KEY (id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- create table examined by
CREATE TABLE EXAMINED_BY
(
    examiner_id INT NOT NULL,
    thesis_serial_number INT NOT NULL,
    defense_date DATETIME NOT NULL,
    comments VARCHAR(300) ,
    PRIMARY KEY (examiner_id, thesis_serial_number, defense_date),
    FOREIGN KEY (examiner_id) REFERENCES EXAMINER(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (thesis_serial_number, defense_date) REFERENCES DEFENSE(thesis_serial_number, defense_date) ON DELETE CASCADE ON UPDATE CASCADE
);

-- create table publication
CREATE TABLE PUBLICATION
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    publication_date DATETIME NOT NULL,
    place VARCHAR(50) NOT NULL,
    host VARCHAR(50) NOT NULL,
    is_accepted TINYINT(1) NOT NULL
);
-- CREATE TABLE PUBLISHED_FOR
CREATE TABLE PUBLISHED_FOR
(
    publication_id INT NOT NULL,
    thesis_serial_number INT NOT NULL,
    PRIMARY KEY (publication_id, thesis_serial_number),
    FOREIGN KEY (publication_id) REFERENCES PUBLICATION(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (thesis_serial_number) REFERENCES THESIS(serial_number) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE STUDENT_ADD_PUBLICATION
(
    publication_id INT,
    student_id INT,
    PRIMARY KEY (publication_id, student_id),
    FOREIGN KEY(student_id) REFERENCES STUDENT(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(publication_id) REFERENCES PUBLICATION(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE proposed_thesis(
	id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
	title VARCHAR(50) UNIQUE,
    cluster VARCHAR(50),
    field VARCHAR(50),
    FOREIGN KEY(student_id) REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE thesis_request(
	student_id INT,
    supervisor_id INT,
    thesis_no INT,
    status VARCHAR(40),
    PRIMARY KEY(student_id,supervisor_id,thesis_no),
    FOREIGN KEY(student_id) REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(supervisor_id) REFERENCES supervisor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(thesis_no) REFERENCES proposed_thesis(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE defense_request(
	supervisor_id INT,
    thesis_id INT,
    status VARCHAR(50) NOT NULL,
    PRIMARY KEY(supervisor_id,thesis_id),
    FOREIGN KEY(supervisor_id) REFERENCES supervisor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(thesis_id) REFERENCES thesis(serial_number) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE unaccepted_examiner
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(50),
	password VARCHAR(100),
    field_of_work VARCHAR(50) NOT NULL,
    cluster VARCHAR(50),
);
