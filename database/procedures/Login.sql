-- 2.USER LOGIN
DELIMITER $$
CREATE PROCEDURE userLogin(
    IN email VARCHAR(50),
    IN password VARCHAR(20),
    OUT success BIT,
    OUT id INT
)
BEGIN
    -- Check if the user exists with the given email and password
    IF EXISTS (
        SELECT 1 FROM USERS WHERE USERS.email = email AND USERS.password = password
    ) THEN
        -- Retrieve the user ID
        SELECT USERS.id INTO id
        FROM USERS
        WHERE USERS.email = email;

        SET success = 1; -- Login successful
    ELSE
        SET success = 0; -- Login failed
    END IF;
END $$


CREATE PROCEDURE TypeOFUser(
    IN id INT,
    OUT userType INT 
)
BEGIN
    -- Determine the type of user based on their ID
    IF EXISTS (SELECT 1 FROM Domestic WHERE Domestic.id = id) THEN
        SET userType = 0; -- Domestic
    ELSEIF EXISTS (SELECT 1 FROM International WHERE International.id = id) THEN
        SET userType = 4; -- International
    ELSEIF EXISTS (SELECT 1 FROM Supervisor WHERE Supervisor.id = id) THEN
        SET userType = 1; -- SUPERVISOR
    ELSEIF EXISTS (SELECT 1 FROM Examiner WHERE Examiner.id = id) THEN
        SET userType = 2; -- EXAMINER
    ELSEIF EXISTS (SELECT 1 FROM Admin WHERE Admin.id = id) THEN
        SET userType = 3; -- ADMIN
    ELSE
        SET userType = -1; -- Undefined type
    END IF;
END $$
