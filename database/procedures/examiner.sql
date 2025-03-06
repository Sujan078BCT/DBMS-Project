-- Show examiner theses
DELIMITER $$
CREATE PROCEDURE ShowExaminerTheses(
    IN examiner_id INT
)
BEGIN
    SELECT DISTINCT 
        T.serial_number, T.title, CONCAT(St.first_name, ' ', St.last_name) AS student_name
    FROM 
    EXAMINED_BY AS Ex
    INNER JOIN THESIS AS T ON Ex.thesis_serial_number = T.serial_number
    INNER JOIN STUDENT AS St ON T.student_id = St.id
    WHERE 
        Ex.examiner_id = examiner_id;
END $$
-- show thesis supervisors
CREATE PROCEDURE ShowThesisSupervisors(
    IN thesis_serial_number INT
)
BEGIN
    SELECT CONCAT(Sup.first_name, ' ', Sup.last_name) AS supervisor_name
    FROM SUPERVISED AS SV
    INNER JOIN Supervisor AS Sup ON SV.supervisor_id = Sup.id
    WHERE SV.thesis_serial_number = thesis_serial_number;
END $$

-- Show examiner defenses
CREATE PROCEDURE ShowExaminerDefense(
    IN examiner_id INT
)
BEGIN
    SELECT 
        D.defense_date, D.thesis_serial_number, D.location, D.grade, 
        T.title, Ex.comments,S.first_name,S.last_name
    FROM 
    EXAMINED_BY AS Ex
    INNER JOIN DEFENSE AS D ON Ex.thesis_serial_number = D.thesis_serial_number 
        AND Ex.defense_date = D.defense_date
    INNER JOIN THESIS AS T ON D.thesis_serial_number = T.serial_number
    INNER JOIN student AS S ON T.student_id = S.id
    WHERE 
        Ex.examiner_id = examiner_id;
END $$

-- Add a grade to thesis
CREATE PROCEDURE AddDefenseGrade(
    IN ThesisSerialNo INT,
    IN grade DECIMAL(5, 2)
)
BEGIN
    UPDATE DEFENSE
    SET defense.grade = grade
    WHERE defense.thesis_serial_number = ThesisSerialNo;
END $$

-- add comments for defense
CREATE PROCEDURE AddCommentsGrade(
    IN examiner_id INT,
    IN ThesisSerialNo INT,
    IN comments VARCHAR(300)
)
BEGIN
    UPDATE EXAMINED_BY AS EX
    SET Ex.comments = comments
    WHERE Ex.thesis_serial_number = ThesisSerialNo 
      AND Ex.examiner_id = examiner_id;
END $$

-- Search for a thesis
CREATE PROCEDURE SearchForThesis(
    IN keyword VARCHAR(50)
)
BEGIN
    SELECT T.*
    FROM THESIS T
    WHERE T.title LIKE CONCAT('%', keyword, '%');
END $$
