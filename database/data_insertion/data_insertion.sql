-- 1. user insertion
-- D. Admin
INSERT INTO users VALUES (1,'sijan123','sijan@gmail.com');
INSERT INTO admin VALUES(1);

-- Note Insert data through register or admin panel not by executing below procedure because it won't hashed and may create error
-- A. Student
-- domestic student
CALL RegistrationRequest('Sujan', 'Thapaliya', '078bct094', 'Computer', 1, 'sujanthapaliya2468@gmail.com', 'charaundi,Dhading');
CALL RegistrationRequest('Sakshyam', 'Luitel', '078bct073', 'computer', 1, 'sakshyam1234@gmail.com', 'Kathmandu');
CALL RegistrationRequest('Sijan', 'Joshi', '078bct087', 'Mechanical', 1, 'sijan2468@gmail.com', 'Kathmandu');
CALL RegistrationRequest('Maya', 'Bhandari', '078bct097', 'Civil', 1, 'mayabhandari9876@gmail.com', 'Butwal,Palpa');
CALL RegistrationRequest('Pooja', 'Shrestha', '078bct098', 'Environmental', 1, 'poojashrestha1234@gmail.com', 'Kathmandu');
-- international student
CALL RegistrationRequest('John', 'Doe', '078BEI093', 'Electrical', 0, 'johndoe@gmail.com', 'New York,USA');
CALL RegistrationRequest('Maria', 'Gonzalez', '078BEI074', 'Electrical', 0, 'mariagonzalez@gmail.com', 'Madrid,Spain');
CALL RegistrationRequest('Kumar', 'Patel', '078BEI075', 'Mechanical', 0, 'kumarpatel@gmail.com', 'London,UK');
CALL RegistrationRequest('Lin', 'Wang', '078BIL045', 'Civil', 0, 'linwang@gmail.com', 'Beijing,China');
CALL RegistrationRequest('Ayesha', 'Khan', '078BET035', 'Environmental', 0, 'ayeshakhan@gmail.com', 'Karachi,Pakistan');

-- B. Supervisor
CALL SupervisorRegister('Hari', 'Prasad', 'hari1234', 'Computer', 'hari@gmail.com', 'Charaundi,dhading', 'AIML');
CALL SupervisorRegister('Binod', 'Sharma', 'binod1234', 'Computer', 'binod@gmail.com', 'Chitwan', 'AIML');
CALL SupervisorRegister('Maya', 'Rai', 'maya1234', 'Computer', 'maya@gmail.com', 'kathmandu', 'AIML');

CALL SupervisorRegister('Sita', 'Shrestha', 'sita1234', 'Electrical', 'sita@gmail.com', 'kathmandu', 'EDMES');
CALL SupervisorRegister('Prakash', 'Pandit', 'prakash1234', 'Mechanical', 'prakash@gmail.com', 'pokhara', 'EDMES');
CALL SupervisorRegister('Raj', 'Tamang', 'raj1234', 'Electronics', 'raj@gmail.com', 'dang', 'EDMES');

CALL SupervisorRegister('Ram', 'Tamang', 'ram1234', 'Civil', 'ram@gmail.com', 'pokhara', 'BioEng');
CALL SupervisorRegister('Gita', 'Koirala', 'gita1234', 'Environmental', 'gita@gmail.com', 'biratnagar', 'BioEng');
CALL SupervisorRegister('Sunita', 'Rai', 'sunita1234', 'Environmental', 'sunita@gmail.com', 'kathmandu', 'BioEng');

CALL SupervisorRegister('Roshi', 'Nepal', 'roshi1234', 'Computer', 'roshi@gmail.com', 'itahari', 'Cyber System');
CALL SupervisorRegister('Suman', 'Thapa', 'suman1234', 'computer', 'suman@gmail.com', 'butwal', 'Cyber System');
CALL SupervisorRegister('Shyam', 'Rai', 'shyam1234', 'computer', 'shyam@gmail.com', 'kathmandu', 'Cyber System');

CALL SupervisorRegister('Nita', 'Bhandari', 'nita1234', 'Civil', 'nita@gmail.com', 'dang', 'Enviro Tech');
CALL SupervisorRegister('Talha', 'Rai', 'talha1234', 'Environmental', 'talha@gmail.com', 'dharan', 'Enviro Tech');
CALL SupervisorRegister('Manu', 'Shrestha', 'manu1234', 'Environmental', 'manu@gmail.com', 'nepalgunj', 'Enviro Tech');

-- C.Examiner
-- a. Internal
CALL InternalExaminerRegister('Yujal', 'Shrestha', 'Computer Science', 'AIML', 'yujal@gmail.com', '078BCT096');
CALL InternalExaminerRegister('Rita', 'Shrestha', 'Electrical Enginering', 'EDMES', 'rita.shrestha@gmail.com', 'rita5678');
CALL InternalExaminerRegister('Prakash', 'Poudel', 'Mechanical Engineering', 'EDMES', 'prakash.poudel@gmail.com', 'prakash91011');
CALL InternalExaminerRegister('Ayesha', 'Singh', 'Environmental Science', 'Enviro Tech', 'ayesha.khan@gmail.com', 'ayesha4321');
CALL InternalExaminerRegister('Raj', 'Gurung', 'Environmental Science', 'Enviro Tech', 'raj.gurung@gmail.com', 'raj1212');
CALL InternalExaminerRegister('Sangit', 'Jamarkatel', 'Cyber Security', 'Cyber System', 'sangit@gmail.com', 'sangit1234');

-- b.External
CALL ExaminerRegistrationRequest('Sakshyam', 'Shrestha', 'sakshyam1234', 'Computer Science', 'AIML', 'sakshyam12345@gmail.com');
CALL ExaminerRegistrationRequest('Gita', 'Bhandari', 'gita5678', 'Electrical', 'EDMES', 'gita123@gmail.com');
CALL ExaminerRegistrationRequest('Nabin', 'Poudel', 'nabin91011', 'Mechanical', 'EDMES', 'nabin123@gmail.com');
CALL ExaminerRegistrationRequest('Manish', 'Kadel', 'manisha4321', 'Environmental', 'BioEng', 'manisha123@gmail.com');
CALL ExaminerRegistrationRequest('Pratap', 'Gurung', 'pratap1212', 'Civil', 'Enviro Tech', 'pratap123@gmail.com');
CALL ExaminerRegistrationRequest('Bibek', 'Yadav', 'bibek1234', 'Cyber Security', 'Cyber System', 'bibek@gmail.com');

-- 2. Course
INSERT INTO COURSE (name, code, credit_hours, fees) VALUES
('Mathematics', 'L40061', 10, 4000.00), 
('Chemistry', 'L40091', 6, 6000.00),
('Engineering Mechanics', 'L400055', 4, 4000.00), 
('Thermodynamics', 'L40071', 4, 4000.00),
('Electrical Circuits', 'L40031', 6, 6000.00),
('Materials Science', 'L40051', 6, 6000.00);

-- 3. taken by
INSERT INTO taken_by VALUES 
(7, 6, 66), (8, 2, 65), (9, 1, 66), (9, 2, 44),
(10, 1, 18), (10, 6, 97), (11, 3, 58), (11, 1, 58),
(7, 5, 98), (8, 1, 47), (9, 3, 66), (11, 6, 62);


1. Artificial Intelligence and Machine Learning (AIML)
"Real-time Object Detection in Autonomous Vehicles"
Field: Computer Vision, Autonomous Systems

"Reinforcement Learning for Robot Navigation"
Field: Robotics, Machine Learning

"Sentiment Analysis of Social Media Data"
Field: Natural Language Processing, Social Media Analytics

"AI for Predictive Maintenance in Industry"
Field: Industrial AI, Predictive Analytics

"Personalized Health Monitoring Using AI"
Field: Health Informatics, AI in Healthcare

2. Educational Management and Development Systems (EDMES)
Field: Educational Technology, Data Analytics in Education
"AI-Based Personalized Learning Systems"
Field: Educational Technology, AI in Education

"Impact of Cloud-Based Learning on Education"
Field: Cloud Computing, Online Education

"Predicting Student Dropouts Using AI"
Field: Educational Data Mining, Machine Learning

"Data-Driven School Performance Improvement"
Field: Educational Data Analytics, School Management Systems

"Adaptive Assessment Systems in Education"
Field: Educational Technology, Assessment Systems

3. Bioengineering (BioEng)
Field: Bioengineering, Biotechnology, Biomedical Engineering
"Biodegradable Implants for Orthopedic Use"
Field: Biomedical Engineering, Materials Science

"Gene Editing for Genetic Disorders"
Field: Genetic Engineering, Molecular Biology

"Wearable Sensors for Chronic Disease Monitoring"
Field: Wearable Technology, Medical Devices

"Tissue Engineering for Organ Regeneration"
Field: Tissue Engineering, Regenerative Medicine

"Nanotechnology in Drug Delivery"
Field: Nanotechnology, Pharmaceutical Engineering

4. Cyber Systems
Field: Cybersecurity, Information Systems, Networking
"Cybersecurity Framework for Critical Infrastructure"
Field: Cybersecurity, Information Security

"Blockchain for Secure Digital Identity"
Field: Blockchain Technology, Cybersecurity

"AI-Based Network Intrusion Detection"
Field: Artificial Intelligence, Network Security

"Quantum Computing and Cybersecurity"
Field: Quantum Computing, Cryptography, Cybersecurity

"Cyber-Resilience in Smart Cities"
Field: Smart Cities, Cybersecurity, Urban Computing

5. Environmental Technology (Enviro Tech)
Field: Environmental Engineering, Sustainable Technologies
"IoT-Based Smart Waste Management"
Field: Internet of Things (IoT), Environmental Engineering

"Renewable Energy Integration in Smart Grids"
Field: Renewable Energy, Smart Grids, Electrical Engineering

"Geospatial Technology for Deforestation Monitoring"
Field: Geospatial Science, Environmental Monitoring

"Solar-Powered Water Purification"
Field: Renewable Energy, Water Treatment Technologies

"Carbon Capture and Storage Technologies"
Field: Environmental Engineering, Climate Change Mitigation