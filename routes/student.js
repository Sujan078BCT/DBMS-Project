const express = require('express');
const router = express.Router();
const toast = require('../utilities/toast');
const studentProcedures = require('../procedures/studentProcedures');
const mobileProcedures = require('../procedures/mobileProcedures');
const { authUser, authRole, ROLE } = require('../utilities/auth');
//get  student dashboard
router.get(
  '/',authUser,
  authRole([ROLE.DOMESTIC_STUDENT, ROLE.INTERNATIONAL_STUDENT]),
  function (req, res) {
    const type = String(req.session.type);
    res.render('student/studentDashboard', { type: type });
  }
);
//get student profile 
router.get(
  '/profile',
  authUser,
  authRole([ROLE.DOMESTIC_STUDENT, ROLE.INTERNATIONAL_STUDENT]),
  (req, res) => {
    const id = req.session.userId;
    const type = req.session.type;
    studentProcedures.viewMyProfile(id).then(response => {
      const profile = response[0];
      mobileProcedures.viewMobileNumber(id).then(response=>{
        res.render('student/studentProfile', {
          student: profile,
          type: type,
          mobiles:response
        }) 
      })
    });
  }
);
/* Edit Student profile */
router.post('/profile', (req, res) => {
  const id = req.session.userId;
  const firstName = req.body.name.split(" ")[0];
  const lastName = req.body.name.split(" ")[1];
  const email = req.body.email;
  const address = req.body.address;
  studentProcedures.updateProfile(
    id,
    firstName,
    lastName,
    email,
    address
  ).then(() => {
    toast.showToast(req, 'success', 'Profile updated successfully');
    res.redirect('/student/profile');
  }).catch(err => {
    toast.showToast(req, 'error', 'Profile not updated please try again');
    res.redirect('/student/profile');
  })
});
// get student theses
router.get(
  '/theses',
  authUser,
  authRole([ROLE.DOMESTIC_STUDENT, ROLE.INTERNATIONAL_STUDENT]),
  (req, res) => {
    const id = req.session.userId;
    const type = req.session.type;
    studentProcedures.viewAllMyTheses(id).then(response => {
      const theses = response;
      studentProcedures.createdthesis(id).then(response=>{
      const created = response;
      studentProcedures.supervisorlist().then(response=>{
      const sup_info = response;
      studentProcedures.viewThesisRequest(id).then(response=>{
        res.render('student/studentTheses', {
          theses: theses,
          purposedtheses:created,
          theses_result:response,
          supervisors:sup_info,
          type: type,
          today: new Date() // it is passed because if end_date<today means that thesis is completed and no need to add progress report
        });
      })
      })
      })
    });
  }
);
// get student courses
router.get(
  '/courses',
  authUser,
  authRole([ROLE.INTERNATIONAL_STUDENT]),
  (req, res) => {
    const id = req.session.userId;
    const type = req.session.type;
    studentProcedures.viewCoursesGrades(id).then(response => {
      const courses = response;
      res.render('student/studentCourses', { courses: courses, type: type });
    });
  }
);
//get student progress report
router.get(
  '/progressReports',
  authUser,
  authRole([ROLE.DOMESTIC_STUDENT, ROLE.INTERNATIONAL_STUDENT]),
  (req, res) => {
    const id = req.session.userId;
    const type = req.session.type;
    studentProcedures.viewMyReports(id).then(response => {
      const reports = response;
      res.render('student/studentReports', {
        reports: reports,
        type: type // to include student dashboard
      });
    });
  }
);
// get student publications
router.get(
  '/publications',
  authUser,
  authRole([ROLE.DOMESTIC_STUDENT, ROLE.INTERNATIONAL_STUDENT]),
  (req, res) => {
    const id = req.session.userId;
    const type = req.session.type;
    studentProcedures.viewMyPublications(id).then(response => {
      const publications = response;
      studentProcedures.viewAllMyTheses(id).then(response => {
        const theses = response;
        res.render('student/studentPublications', {
          publications: publications,
          type: type,
          theses: theses,
        });
      });
    });
  }
);

/* Add Publication to a certain thesis */
router.post('/publications', (req, res) => {
  const title = req.body.title;
  const date = req.body.date;
  const host = req.body.host;
  const place = req.body.place;
  const status = req.body.status;
  const id = req.session.userId;
  studentProcedures
    .addPublication(title, date, host, place, status, id)
    .then(()=> {
      toast.showToast(req, 'success', 'Publication added successfully');
      res.redirect('/student/publications');
    })
    .catch(err => {
      toast.showToast(req, 'error', 'Cannot add publication');
      res.redirect('/student/publications');
    });
});

// Add progress Report
router.post('/:thesisSerialNumber/report', (req, res) => {
  const date = req.body.date;
  const thesisSerialNumber = req.params.thesisSerialNumber;
  studentProcedures
    .addProgressReport(thesisSerialNumber, date)
    .then(()=> {
      toast.showToast(req, 'success', 'Progress Report added successfully');
      res.redirect('/student/theses');
    })
    .catch(err => {
      toast.showToast(req, 'error', 'Cannot add Progress Report');
      res.redirect('/student/theses');
    });
});

/* Fill Progress Report */
router.post('/:thesisSerialNumber/:reportNumber/report', (req, res) => {
  const state = req.body.state;
  const description = req.body.description;
  const thesisSerialNumber = req.params.thesisSerialNumber;
  const reportNumber = req.params.reportNumber;
  studentProcedures
    .fillProgressReport(thesisSerialNumber, reportNumber, state, description)
    .then(() => {
      toast.showToast(req, 'success', 'Progress Report filled successfully');
      res.redirect('/student/progressReports');
    })
    .catch(err => {
      toast.showToast(req, 'error', 'Cannot fill report');
      res.redirect('/student/progressReports');
    });
});

/* Link Publication to a specific thesis */
router.post('/linkPublication', (req, res) => {
  const publicationId = req.body.publication_id;
  const thesisSerialNumber = req.body.thesis_serial_number;
  studentProcedures
    .linkPubThesis(publicationId, thesisSerialNumber)
    .then(()=> {
      toast.showToast(req, 'success', 'Publication linked successfully');
      res.redirect('/student/publications'); 
    })
    .catch(err => {
      toast.showToast(req, 'error', 'Publication already linked to thesis.');
      res.redirect('/student/publications');
    });
});

router.post('/createthesis',(req,res)=>{
  const id = req.session.userId;
  const title = req.body.title;
  const cluster = req.body.cluster;
  const field = req.body.field;
  studentProcedures.proposedthesis(id,title,cluster,field).then(()=>{
    toast.showToast(req,'success','Thesis created successfully.');
    res.redirect('/student/theses');
  })
  .catch(err=>{
    toast.showToast(req,'error','Thesis Title in Use.');
    res.redirect('/student/theses');
  })
})
router.post('/theses/:id',(req,res)=>{
  const thesis_id = req.params.id;
  const supervisor_id = req.body.supervisor_id;
  const id = req.session.userId;
  studentProcedures.storethesis(id,thesis_id,supervisor_id).then(()=>{
    toast.showToast(req,'success','Approval request send.');
    res.redirect('/student/theses');
  })
  .catch(err=>{
    toast.showToast(req,'error','Request either Rejected Or Pending.');
    res.redirect('/student/theses');
  })
})
module.exports = router;
