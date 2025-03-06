DELIMITER $$
-- get all supervisor
CREATE PROCEDURE AdminListSup()
BEGIN
    SELECT * FROM SUPERVISOR;
END$$

-- get all unapproved student
CREATE PROCEDURE unapprovedStudent()
BEGIN
    SELECT * FROM unaccepted_student;
END $$

-- get all unapproved student
CREATE PROCEDURE unapprovedExaminer()
BEGIN
    SELECT * FROM unaccepted_examiner;
END $$

-- reject student registration request
CREATE PROCEDURE rejectStudent(
    IN id INT
)
BEGIN
DELETE FROM unaccepted_student WHERE unaccepted_student.id = id;
END$$

-- delete rejected Examiner
CREATE PROCEDURE rejectExaminer(IN id INT)
BEGIN
	DELETE FROM unaccepted_examiner WHERE unaccepted_examiner.id = id;
END$$

-- get all examiners
CREATE PROCEDURE listexaminers()
BEGIN
SELECT * FROM examiner;
END$$

-- get all student
CREATE PROCEDURE listStudents()
BEGIN
SELECT * FROM student;
END $$

-- delete any user either examiner, supervisor or student with that id
CREATE PROCEDURE deleteuser(
    IN id INT
)
BEGIN
DELETE FROM users WHERE users.id = id;
END $$

-- 3) c) View Theses all approved theses
CREATE PROCEDURE AdminViewAllTheses()
BEGIN
    SELECT * FROM THESIS;
END$$
 
-- view ongoing theses along wih defense status, student name, supervisor name and examiner name
CREATE PROCEDURE ongoingtheses()
BEGIN
        SELECT 
        T.*,
        DR.status AS defense_status,student.first_name AS S_firstname,student.last_name AS S_lastname,supervisor.first_name AS Sup_firstname,supervisor.last_name AS Sup_lastname,
		examiner.first_name AS E_firstname, examiner.last_name AS E_lastname,defense.location,defense.defense_date
        FROM thesis T
		LEFT JOIN defense_request AS  DR ON t.serial_number = dr.thesis_id
        LEFT JOIN student ON student.id = T.student_id
        LEFT JOIN supervised ON supervised.thesis_serial_number = T.serial_number
        LEFT JOIN supervisor ON supervisor.id = supervised.supervisor_id
        LEFT JOIN examined_by ON examined_by.thesis_serial_number = T.serial_number
        LEFT JOIN examiner ON examiner.id = examined_by.examiner_id
        LEFT JOIN defense ON defense.thesis_serial_number = examined_by.thesis_serial_number
		WHERE t.serial_number IN (SELECT thesis_serial_number FROM supervised);
END$$ 

-- view pending theses
CREATE PROCEDURE pendingtheses()
BEGIN
    SELECT * FROM proposed_thesis;
END$$

-- update thesis
CREATE PROCEDURE updatethesis(
    IN thesis_id INT,
    IN start_date DATETIME,
    IN end_date DATETIME,
    IN field VARCHAR(50),
)
BEGIN
    UPDATE thesis AS T
    SET T.start_date = start_date,
    T.end_date = end_date,
    T.field = field,
    WHERE T.serial_number = thesis_id;
END $$

-- delete thesis
CREATE PROCEDURE deletethesis(
    IN serial_number INT
)
BEGIN
    DELETE FROM thesis WHERE
    thesis.serial_number = serial_number;
END$$

-- delete pending thesis
CREATE PROCEDURE deletependingthesis(IN id INT)
BEGIN
	DELETE FROM proposed_thesis WHERE proposed_thesis.id = id;
END$$

-- admin add defense for thesis
CREATE PROCEDURE addDefense(
	IN thesis_id INT,
    IN date DATE,
    IN place VARCHAR(15),
    IN examiner_id INT)
BEGIN
	INSERT INTO defense(thesis_serial_number,defense_date,location) VALUES (thesis_id,date,place);
    INSERT INTO examined_by(examiner_id,thesis_serial_number,defense_date) VALUES (examiner_id,thesis_id,date);
    UPDATE defense_request
    SET status = 'Accepted'
    WHERE defense_request.thesis_id = thesis_id;
END$$
