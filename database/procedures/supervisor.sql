-- View all my students’ names and years spent in the thesis as well as thesis title
DELIMITER $$
CREATE PROCEDURE ViewSupStudentsYears(
    IN supervisor_id INT
)
BEGIN
    SELECT
        CONCAT(Student.first_name, ' ', Student.last_name) AS name,thesis.title,
        TIMESTAMPDIFF(YEAR, thesis.start_date, LEAST(COALESCE(thesis.end_date, CURDATE()), CURDATE())) AS years,
        TIMESTAMPDIFF(Month, thesis.start_date, LEAST(COALESCE(thesis.end_date, CURDATE()), CURDATE())) AS months,
        TIMESTAMPDIFF(Day, thesis.start_date, LEAST(COALESCE(thesis.end_date, CURDATE()), CURDATE())) AS days,
        Student.id AS student_id,
        thesis.serial_number As thesisId

    FROM
        SUPERVISOR INNER JOIN SUPERVISED  ON supervisor.id = supervised.supervisor_id
    INNER JOIN THESIS ON supervised.thesis_serial_number = thesis.serial_number
    INNER JOIN STUDENT ON thesis.student_id = student.id
    WHERE 
        supervisor.id = supervisor_id;
END $$

-- Get all theses supervised by a supervisor
CREATE PROCEDURE viewSupThesis(
    IN supervisor_id INT
)
BEGIN
    SELECT thesis.*,student.first_name,student.last_name,report.state
    FROM supervisor
    INNER JOIN supervised ON supervisor.id = supervised.supervisor_id
    INNER JOIN thesis ON supervised.thesis_serial_number = thesis.serial_number
    INNER JOIN student ON thesis.student_id = student.id
    LEFT JOIN report ON report.thesis_serial_number = thesis.serial_number
	WHERE supervisor.id = supervisor_id;
END $$

-- view thesis request send by student
CREATE PROCEDURE thesisRequestInfo(IN sup_Id INT)
BEGIN 
SELECT S.first_name,S.last_name,C.id AS thesis_id,C.cluster,C.field,C.title,C.status
FROM 
(SELECT * FROM proposed_thesis AS T 
	INNER JOIN
(SELECT supervisor_id,student_id AS stud_id,status,thesis_no FROM thesis_request  WHERE thesis_request.supervisor_id = sup_Id) AS R
	ON T.id = R.thesis_no AND T.student_id = stud_id
) AS C 
INNER JOIN student AS S ON S.id = C.student_id;
END $$

-- update thesis
CREATE PROCEDURE supUpdatethesis(
    IN thesis_id INT,
    IN start_date DATETIME,
    IN end_date DATETIME,
    IN cluster VARCHAR(40),
    IN field VARCHAR(50),
    IN presentation_date DATETIME
)
BEGIN
    UPDATE thesis AS T
    SET T.start_date = start_date,
    T.end_date = end_date,
    T.cluster = cluster,
    T.field = field,
    T.presentation_date =  presentation_date
    WHERE T.serial_number = thesis_id;
END $$ 

-- view thesis request send by student
CREATE PROCEDURE viewThesisRequest(IN stud_id INT)
BEGIN
	SELECT * FROM thesis_request WHERE student_id = stud_id;
END
-- View examiner information
CREATE PROCEDURE viewExaminer()
BEGIN
    SELECT * FROM EXAMINER;
END $$

-- approved thesis request sent by student
CREATE PROCEDURE ApprovedThesis(
	IN supervisorId INT,
    IN thesisId INT
)
BEGIN
    INSERT INTO thesis (title,field,cluster,student_id) SELECT title,field,cluster,student_id FROM proposed_thesis WHERE id = thesisId;
	DELETE FROM  proposed_thesis AS T WHERE T.id = thesisId;
    SET @id = last_insert_id();
    UPDATE thesis 
	SET start_date = NOW() 
	WHERE serial_number = @id;
    INSERT INTO supervised (supervisor_id,thesis_serial_number) VALUES (supervisorId,@id);
END $$

-- reject thesis request sent by student
CREATE PROCEDURE RejectThesis(
	IN supervisorId INT,
    IN thesisId INT
)
BEGIN
	UPDATE thesis_request AS R
    SET R.status = 'Rejected' WHERE R.supervisor_id = supervisorId AND R.thesis_no = thesisId;
END $$
-- View all students’ reports
CREATE PROCEDURE ViewAllStudentsReports(
    IN supervisor_id INT
)
BEGIN
    SELECT 
        R.*, T.title, CONCAT(S.first_name, ' ', S.last_name) AS student_name
    FROM 
    THESIS AS T
    INNER JOIN SUPERVISED AS SV ON T.serial_number = SV.thesis_serial_number
    INNER JOIN REPORT AS R ON T.serial_number = R.thesis_serial_number
    INNER JOIN STUDENT AS S ON T.student_id = S.id
    WHERE 
        SV.supervisor_id = supervisor_id;
END $$

-- check if domestic or not
CREATE PROCEDURE is_Domestic(
    IN thesisSerialNo INT,
    OUT output INT
)
BEGIN
    IF EXISTS (
        SELECT 1
        FROM THESIS AS T
        INNER JOIN Domestic AS D ON T.student_id = D.id
        WHERE T.serial_number = thesisSerialNo
    ) THEN
        SET output = 1;
    ELSE
        SET output = 0;
    END IF;
END $$

-- Find all publications related to a student
CREATE PROCEDURE ViewAStudentPublications(
    IN student_id INT,
    IN thesisId INT
)
BEGIN
    SELECT Pub.*, CONCAT(student.first_name,' ',student.last_name) AS student_name FROM Publication AS Pub
    INNER JOIN published_for AS pf ON Pub.id = pf.publication_id
    INNER JOIN thesis ON thesis.serial_number = pf.thesis_serial_number
    INNER JOIN student ON student.id = thesis.student_id
    WHERE pf.thesis_serial_number = thesisId AND student.id = student_id;
END $$

-- Evaluate a student’s progress report, and give evaluation value 0 to 100.
CREATE PROCEDURE EvaluateProgressReport(
    IN supervisor_id INT,
    IN thesis_serial_number INT,
    IN progress_report_no INT,
    IN evaluation_value INT
)
BEGIN
    UPDATE REPORT
    SET 
        report.evaluation = evaluation_value,
        report.supervisor_id = supervisor_id
    WHERE 
        report.thesis_serial_number = thesis_serial_number
        AND report.report_number = progress_report_no;
END $$

-- send defense request to admin
CREATE PROCEDURE sendDefenseRequest(
	IN supervisorId INT,
    IN thesisId INT
)
BEGIN
	INSERT INTO defense_request VALUES (supervisorId,thesisId,'Pending');
END$$



