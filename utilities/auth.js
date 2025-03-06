const { StatusCodes } = require('http-status-codes');

const ROLE = {
  DOMESTIC_STUDENT: '0',
  SUPERVISOR: '1',
  EXAMINER: '2',
  ADMIN: '3',
  INTERNATIONAL_STUDENT: '4'
};

const authUser = function (req, res, next) {
  if (String(req.session.type)) {
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    res.redirect('/');
  }
};

const authRole = function (roles) {
  return (req, res, next) => {
    if (roles.includes(String(req.session.type))) {
      next();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).render('error', {
        title: '401 UNAUTHORIZED',
        message: 'Error 401 : UNAUTHORIZED'
      });
    }
  };
};

module.exports = { authUser, authRole, ROLE };
