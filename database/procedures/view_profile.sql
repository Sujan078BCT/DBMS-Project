-- VIEW ADMIN PROFILE
DELIMITER $$
CREATE PROCEDURE AdminViewProfile(IN admin_id INT)
BEGIN
    SELECT email FROM USERS WHERE id = admin_id;
END$$


-- VIEW SUPERVISOR PROFILE
CREATE PROCEDURE SupViewProfile(
    IN supervisor_id INT
)
BEGIN
    SELECT SUPERVISOR.*,USERS.email FROM SUPERVISOR NATURAL JOIN  USERS
    WHERE SUPERVISOR.id = supervisor_id;
END $$

-- VIEW STUDENT PROFILE
CREATE PROCEDURE viewStudentProfile(
    IN studentId INT
)
BEGIN
    IF EXISTS (SELECT id FROM Domestic WHERE Domestic.id = studentId) THEN
        SELECT student.*,domestic.dom_id,users.email FROM 
        users NATURAL JOIN student NATURAL JOIN Domestic
        WHERE student.id = studentId;
    ELSE
    SELECT student.*,users.email FROM 
    users NATURAL JOIN student NATURAL JOIN International
    WHERE student.id = studentId;
    END IF;
END $$

-- VIEW EXAMINER PROFILE
CREATE PROCEDURE viewExaminerProfile(
    IN examiner_id INT
)
BEGIN
    SELECT users.email,examiner.* FROM 
    users NATURAL JOIN examiner
    WHERE examiner.id = examiner_Id;
END $$
