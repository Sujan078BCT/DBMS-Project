DELIMITER $$
-- create a new thesis 
CREATE PROCEDURE proposedthesis( 
	IN s_id INT,
    IN t_title VARCHAR(50),
    IN t_cluster VARCHAR(50),
    IN t_field VARCHAR(50)
)
BEGIN 
    IF EXISTS(SELECT 1 FROM proposed_thesis
        WHERE proposed_thesis.title = t_title
        UNION 
        SELECT 1 FROM thesis WHERE thesis.title = t_title
) THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Thesis already used.';
ELSE
	INSERT INTO proposed_thesis (student_id,title,cluster,field) VALUES(s_id,t_title,t_cluster,t_field);
END IF;
END $$

-- view created thesis information
CREATE PROCEDURE createdthesis(
	IN s_id INT
)
BEGIN
	SELECT* FROM proposed_thesis WHERE student_id = s_id;
END $$

-- send thesis request to supervisor for newly created thesis
CREATE PROCEDURE sendThesisRequest(
	IN id INT,
    IN thes_id INT,
    IN sup_id INT
)
BEGIN
	INSERT INTO thesis_request (student_id,thesis_no,supervisor_id,status) VALUES (id,thes_id,sup_id,'Pending');
END $$

-- View all theses of a student being supervised
CREATE PROCEDURE viewAllMyTheses(
    IN studentID INT
)
BEGIN
    select thesis.*,supervisor.first_name,supervisor.last_name,defense.defense_date,defense.location,examiner.first_name as E_firstname ,examiner.last_name as E_lastname from supervisor inner join supervised
    on supervisor.id = supervised.supervisor_id inner join thesis
    on thesis.serial_number = supervised.thesis_serial_number
    LEFT JOIN examined_by ON thesis.serial_number = examined_by.thesis_serial_number
	LEFT JOIN DEFENSE ON defense.thesis_serial_number = thesis.serial_number
    LEFT JOIN examiner ON examined_by.examiner_id = examiner.id
    WHERE student_id = studentID;
END $$

-- View courses and grades for a International student
CREATE PROCEDURE ViewCoursesGrades(
    IN studentID INT
)
BEGIN
    SELECT *
    FROM TAKEN_BY AS TB
    INNER JOIN COURSE AS C ON TB.course_id = C.id
    WHERE TB.student_id = studentID;
END $$

-- view reports
CREATE PROCEDURE viewMyReports(
    IN studentId INT
    )
BEGIN
    SELECT * FROM REPORT
    INNER JOIN THESIS 
    ON REPORT.thesis_serial_number = THESIS.serial_number
    WHERE THESIS.student_id = studentId;
END$$

-- view my publications
CREATE PROCEDURE viewMyPublications(
    IN studentId INT
    )
BEGIN
    SELECT * FROM PUBLICATION AS P
    INNER JOIN STUDENT_ADD_PUBLICATION AS SP
    ON P.id = SP.publication_id
    WHERE SP.student_id = studentId;
END$$

-- Add publication
CREATE PROCEDURE addPublication(
    IN title VARCHAR(50),
    IN pubDate DATETIME,
    IN host VARCHAR(50),
    IN place VARCHAR(50),
    IN accepted BOOLEAN,
    IN studentId INT
)
BEGIN
    INSERT INTO PUBLICATION (title, publication_date, place, host, is_accepted)
    VALUES (title, pubDate, place, host, accepted);

    INSERT INTO STUDENT_ADD_PUBLICATION (publication_id, student_id)
    VALUES (LAST_INSERT_ID(), studentId);
END $$

-- fill progress report
CREATE PROCEDURE FillProgressReport(
    IN thesisSerialNo INT,
    IN progressReportNo INT,
    IN state INT,
    IN description VARCHAR(200)
)
BEGIN
    UPDATE REPORT
    SET report.state = state, report.description = description
    WHERE report.thesis_serial_number = thesisSerialNo
      AND report.report_number = progressReportNo;
END $$

-- Add progress reports for thesis
CREATE PROCEDURE AddProgressReport(
    IN thesisSerialNo INT,
    IN progressReportDate DATE
)
BEGIN 
    INSERT INTO REPORT (thesis_serial_number, report_date)
    VALUES (thesisSerialNo, progressReportDate);
END $$

-- Link publication to thesis
CREATE PROCEDURE linkPubThesis(
    IN pubID INT,
    IN thesisSerialNo INT
)
BEGIN
    INSERT INTO PUBLISHED_FOR (publication_id, thesis_serial_number)
    VALUES (pubID, thesisSerialNo);
END $$


