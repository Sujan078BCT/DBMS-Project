const express = require('express');
const router = express.Router();
const examinerProcedures = require('../procedures/examinerProcedures');
const mobileProcedures = require('../procedures/mobileProcedures');
const toast = require('../utilities/toast');
const { authUser, authRole, ROLE } = require('../utilities/auth');
// get examiner dashboard
router.get('/', authUser, authRole([ROLE.EXAMINER]), function (req, res, next) {
  res.render('examiner/examinerDashboard');
});
//get profile
router.get(
  '/profile',
  authUser,
  authRole([ROLE.EXAMINER]),
  function (req, res) {
    const id = req.session.userId;
    examinerProcedures.showProfile(id).then(response => {
      const profile = response[0];
      mobileProcedures.viewMobileNumber(id).then(response=>{
            res.render('examiner/examinerProfile', {
              examiner:profile,
              mobiles:response
            }) 
          })
    });
  }
);
// update profile
router.post('/profile', function (req, res) {
  const id = req.session.userId;
  const name = req.body.name;
  const first_name = name.split(' ')[0];
  const last_name = name.split(' ')[1];
  const email = req.body.email;
  const fieldOfWork = req.body.fieldOfWork;
  const type = req.body.type;
  examinerProcedures
    .updateProfile(id,first_name,last_name,email, fieldOfWork, type)
    .then(() => {
      toast.showToast(req, 'success', 'Profile updated successfully');
      res.redirect('/examiner/profile');
    })
    .catch(err => {
      toast.showToast(req, 'error', 'Profile not updated please try again');
      res.redirect('/examiner/profile');
    });
});
// get all theses and its supervisor
router.get(
  '/theses',
  authUser,
  authRole([ROLE.EXAMINER]),
 async function (req, res) { 
    const id = req.session.userId;
      // Get all theses
      try {
        const response = await examinerProcedures.showExaminerTheses(id);
        
        // For each thesis, fetch supervisors
        const supervisorsPromises = response.map(thesis => 
          examinerProcedures.showThesisSupervisors(thesis.serial_number)
        );
        
        // Wait for all supervisors data to be fetched
        const supervisors = await Promise.all(supervisorsPromises);
  
        // Render the view after all supervisors have been fetched
        res.render('examiner/examinerTheses', {
          Theses: response,
          supervisors: supervisors
        });
  
      } catch (error) {
        console.error('Error fetching theses or supervisors:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  );

router.get(
  '/defenses',
  authUser,
  authRole([ROLE.EXAMINER]),
  function (req, res) {
    const id = req.session.userId;
    examinerProcedures.showExaminerDefenses(id).then(response => {
      res.render('examiner/examinerDefenses', {
        Defenses: response
      });
    });
  }
);

router.get('/search', authUser, authRole([ROLE.EXAMINER]), function (req, res) {
  res.render('examiner/examinerSearch', { theses: [] });
});

router.post('/addGrade', function (req, res) {
  const thesisSerialNumber = req.body.thesis;
  const grade = req.body.grade;
  examinerProcedures
    .addGrade(thesisSerialNumber, grade)
    .then(() => {
      toast.showToast(req, 'success', 'Grade added successfully');
      res.redirect('back');
    })
    .catch(err => {
      toast.showToast(req, 'error', 'Grade not added Please try again');
      res.redirect('/examiner/defenses');
    });
});

router.post('/addComment', function (req, res) {
  const id = req.session.userId;
  const thesisSerialNumber = req.body.thesis;
  const comment = req.body.comment;
  examinerProcedures
    .addComment(id, thesisSerialNumber,comment)
    .then(()=> {
      toast.showToast(req, 'success', 'Comment added successfully');
      res.redirect('/examiner/defenses');
    })
    .catch(err => {
      toast.showToast(req, 'error', 'Grade not added Please try again');
      res.redirect('/examiner/defenses');
    });
});

router.post('/search', function (req, res) {
  const searchTerm = req.body.searchTerm.trim();
  if (searchTerm === '') {
    toast.showToast(req, 'error', 'Please add value to search for');
    res.redirect('/examiner/search');
  } else {
    examinerProcedures.searchForThesis(searchTerm).then(response => {
      response.forEach(thesis => {
        thesis.title = thesis.title.replace(
          new RegExp(searchTerm, 'gi'),
          `<span class="highlight">${searchTerm}</span>`
        );
        thesis.title = thesis.title.toLowerCase();
      });
      res.render('examiner/examinerSearch', {
        theses: response
      });
    });
  }
});

module.exports = router;
