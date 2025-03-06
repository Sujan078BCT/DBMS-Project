const express = require('express');
const router = express.Router();
const studentProcedures = require('../procedures/studentProcedures');
const supervisorProcedures = require('../procedures/supervisorProcedures');
const examinerProcedures = require('../procedures/examinerProcedures');
const toast = require('../utilities/toast');
const jwt = require('jsonwebtoken');
const secretPassword = require('../secret_password');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register');
});

/*student Registration*/
router.post('/student', function (req, res) {
  const {firstName,lastName,password,faculty,type,email,address} = req.body;
  const encrypted_password = jwt.sign(password,secretPassword);
  studentProcedures.registerRequest(
    firstName,
    lastName,
    email,
    address,
    faculty,
    encrypted_password,
    type
  ).then(()=> {
    toast.showToast(req, 'success', 'Registration Request Send.')
    res.redirect('/');
  }).catch(err => {
    toast.showToast(req, 'error', 'Email already in use.');
    res.redirect('back');
  }
  )
});
/* Examiner Registration*/
router.post('/examiner', function (req, res) {
  const {firstName,lastName,password,fieldOfWork,cluster,email} = req.body; 
  const encrypted_password = jwt.sign(password,secretPassword);
  examinerProcedures.ExaminerRegisterRequest(
    firstName,
    lastName,
    encrypted_password,
    fieldOfWork,
    cluster,
    email
  ).then(()=> {
    toast.showToast(req, 'success', 'Registration Request Send.')
    res.redirect('/');
  }).catch(err => {
    toast.showToast(req, 'error', 'Email already in use.');
    res.redirect('back');
  }
  )
});
module.exports = router;
