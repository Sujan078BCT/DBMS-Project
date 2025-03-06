const express = require('express');
const router = express.Router();
const { userLogin, userType } = require('../procedures/userProcedures');
const { ROLE } = require('../utilities/auth');
const secretPassword = require('../secret_password');
const jwt = require('jsonwebtoken');
router.get('/', function (req, res, next) {
  routeUser(req, res);
});

router.post('/', function (req, res) {
  login(req, res, req.body.email, req.body.password);
});

const login = async (req,res,email, password) => {
  try {
    const response = await userLogin(email, password);
    if (!response.success) {
      const encrypted = jwt.sign(password, secretPassword);
      const secondResponse = await userLogin(email,encrypted);
      if (!secondResponse.success) {
        return res.render('login', { verify: 'no' });
      }
      req.session.userId = secondResponse.id;
    } else {
      req.session.userId = response.id;
    }
    const userTypeResponse = await userType(req.session.userId);
    req.session.type = userTypeResponse.type;
    routeUser(req, res);
  } catch (err) {
  }
}

function routeUser(req, res) {
  switch (String(req.session.type)) {
    case ROLE.DOMESTIC_STUDENT:
      res.redirect('/student');
      break;
    case ROLE.SUPERVISOR:
      res.redirect('/supervisor');
      break;
    case ROLE.EXAMINER:
      res.redirect('/examiner');
      break;
    case ROLE.ADMIN:
      res.redirect('/admin');
      break;
    case ROLE.INTERNATIONAL_STUDENT:
      res.redirect('/student');
      break;
    default:
      res.render('login');
  }
}

module.exports = router;
