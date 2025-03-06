-- ADD MOBILE NUMBER
DELIMITER $$
CREATE PROCEDURE addMobile(
    IN id INT,
    IN mobile_number VARCHAR(20)
)
BEGIN
    -- Insert mobile number for the user
    IF EXISTS(SELECT 1 FROM mobile WHERE mobile.number = mobile_number) THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = "number already exists.";
    ELSE
    INSERT INTO MOBILE (id, number) VALUES (id, mobile_number);
    END IF;
END $$

-- view phone number
CREATE PROCEDURE viewMobile(IN id INT)
BEGIN
	SELECT* FROM mobile WHERE mobile.id = id;
END$$