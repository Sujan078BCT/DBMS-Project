--1. USER REGISTRATION
DELIMITER $$
-- student request for registration
CREATE PROCEDURE RegistrationRequest(
    IN first_name VARCHAR(20),
    IN last_name VARCHAR(20),
    IN password VARCHAR(20),
    IN faculty VARCHAR(20),
    IN Domestic BIT, 
    IN email VARCHAR(50),
    IN address VARCHAR(50)
) 
BEGIN
IF EXISTS(SELECT 1 FROM unaccepted_student 
        WHERE unaccepted_student.email = email
        UNION 
        SELECT 1 FROM USERS WHERE USERS.email = email
) THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Email already used.';
ELSE 
INSERT INTO unaccepted_student (first_name,last_name,email,faculty,address,type,password) 
VALUES
(first_name,last_name,email,faculty,address,Domestic,password);
END IF;
END$$

-- a. student registration
CREATE PROCEDURE StudentRegister(
    IN id INT
)
BEGIN
        INSERT INTO USERS (password, email)
        SELECT password,email FROM unaccepted_student
        WHERE unaccepted_student.id = id;
        -- Get the last inserted ID from users
        SET @id = LAST_INSERT_ID();
        -- Insert into STUDENT table
        INSERT INTO STUDENT (id, first_name, last_name, faculty, address)
        SELECT @id, first_name, last_name, faculty, address
        FROM unaccepted_student WHERE unaccepted_student.id = id;

        SELECT unaccepted_student.type INTO @domestic FROM unaccepted_student WHERE unaccepted_student.id = id;
        IF @domestic = 1 THEN
            INSERT INTO Domestic(id)
            VALUES (@id);
        ELSE
            INSERT INTO International(id)
            VALUES (@id);
        END IF;
        DELETE FROM unaccepted_student WHERE unaccepted_student.id = id;
END $$

-- examiner request for registration to admin
CREATE PROCEDURE ExaminerRegistrationRequest(
    IN first_name VARCHAR(20),
    IN last_name VARCHAR(20),
    IN password VARCHAR(20),
	IN field_of_work VARCHAR(50),
	IN cluster VARCHAR(50),
    IN email VARCHAR(50)
) 
BEGIN
IF EXISTS(SELECT 1 FROM unaccepted_examiner
        WHERE unaccepted_examiner.email = email
        UNION 
        SELECT 1 FROM USERS WHERE USERS.email = email
) THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Email already used.';
ELSE 
INSERT INTO unaccepted_examiner(first_name,last_name,email,field_of_work,cluster,password) 
VALUES
(first_name,last_name,email,field_of_work,cluster,password);
END IF;
END$$
 
-- admin accept External Examiner Register 
CREATE PROCEDURE ExternalExaminerRegister(
    IN id INT
)
BEGIN
        INSERT INTO USERS (password, email)
        SELECT password,email FROM unaccepted_examiner
        WHERE unaccepted_examiner.id = id;
        -- Get the last inserted ID from users
        SET @id = LAST_INSERT_ID();
        -- Insert into examiner table
        INSERT INTO Examiner (id, first_name, last_name,field_of_work,cluster,type)
        SELECT @id, first_name, last_name,field_of_work,cluster, 0
        FROM unaccepted_examiner WHERE unaccepted_examiner.id = id;
        DELETE FROM unaccepted_examiner WHERE unaccepted_examiner.id = id;
END $$

-- register supervisor internally through admin
CREATE  PROCEDURE SupervisorRegister(
    IN first_name VARCHAR(20),
    IN last_name VARCHAR(20),
    IN password VARCHAR(20),
    IN faculty VARCHAR(20),
    IN email VARCHAR(50),
    In address VARCHAR(50)
)
BEGIN
    -- Check if the email already exists
    IF EXISTS (
        SELECT 1 FROM USERS WHERE USERS.email = email
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Email already exists';
    ELSE
        -- Insert into USERS table
        INSERT INTO USERS (password, email)
        VALUES (password, email);

        -- Get the last inserted ID
        SET @id = LAST_INSERT_ID();

        -- Insert into SUPERVISOR table
        INSERT INTO SUPERVISOR (id, first_name, last_name, faculty,address)
        VALUES (@id, first_name, last_name, faculty,address);
    END IF;
END

-- register supervisor internally through database
CREATE PROCEDURE InternalExaminerRegister(
    IN first_name VARCHAR(20),
    IN last_name VARCHAR(20),
    IN fieldOfWork VARCHAR(50),
    In cluster VARCHAR(50),
    IN email VARCHAR(50),
    IN password VARCHAR(50)
)
BEGIN
    -- Check if the email already exists
    IF EXISTS (
        SELECT 1 FROM USERS WHERE USERS.email = email
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Email already exists';
    ELSE
        -- Insert into USERS table
        INSERT INTO USERS (password, email)
        VALUES (password, email);

        -- Get the last inserted ID
        SET @id = LAST_INSERT_ID();

        -- Insert into EXAMINER table
        INSERT INTO EXAMINER (id, first_name,last_name,type, field_of_work,cluster)
        VALUES (@id, first_name,last_name,1, fieldOfWork,cluster);
    END IF;
END