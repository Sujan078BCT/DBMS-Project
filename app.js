const express = require('express');
const path = require('path')
const { StatusCodes } = require('http-status-codes');
const cookieParser = require('cookie-parser');
//const logger = require('morgan');
const session = require('express-session');
const moment = require('moment');

const connection = require('./connection');
const checkConnection = (err)=>{
  if(err)
    console.error("Failed to connect to database.");
  else
    console.log("Connected to Database.");
}
connection.connect(checkConnection);

// routes
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const adminRoute = require('./routes/admin');
const studentRoute = require('./routes/student');
const supervisorRoute = require('./routes/supervisor');
const examinerRoute = require('./routes/examiner');
const logoutRoute = require('./routes/logout');
const addMobileRoute = require('./routes/addMobile')
const homepageRoute = require('./routes/homepage')

const app = express();

// view engine setup
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
);
app.set('view engine', 'ejs');
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname + 'public')));

app.use('/',homepageRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute);
app.use('/addMobile',addMobileRoute)
app.use('/admin', adminRoute);
app.use('/student', studentRoute);
app.use('/supervisor', supervisorRoute);
app.use('/examiner', examinerRoute);




app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).render('error', {
    title: '404 NOT FOUND',
    message: 'Error 404 : Page Not Found'
  });

});

app.locals = {
  app: app,
  toastState: '',
  toastMessage: '',
  moment: moment
};

const port = process.env.PORT || 3000;
app.listen(
  port,
  () => {
    console.log(`Server started on port ${port}`);
  }
)

