-- Update student's profile
DELIMITER $$
CREATE PROCEDURE editStudentProfile(
    IN studentID INT,
    IN firstName VARCHAR(20),
    IN lastName VARCHAR(20),
    IN email VARCHAR(50),
    IN address VARCHAR(50)
)
BEGIN
    UPDATE STUDENT
    SET student.first_name = firstName,
        student.last_name = lastName,
        student.address = address
    WHERE student.id = studentID;

    UPDATE USERS
    SET users.email = email
    WHERE users.id = studentID;
END $$

-- Update examiner's profile
CREATE PROCEDURE editExaminerProfile(
    IN examiner_id INT,
    IN email VARCHAR(50),
    IN first_name VARCHAR(20),
    IN last_name VARCHAR(20),
    IN field_of_work VARCHAR(20),
    IN type BOOLEAN
)
BEGIN
    UPDATE EXAMINER
    SET examiner.first_name = first_name, examiner.last_name = last_name,examiner.field_of_work = field_of_work, examiner.type=type
    WHERE examiner.id = examiner_id;

    UPDATE USERS
    SET users.email = email
    WHERE users.id = examiner_id;
END $$
