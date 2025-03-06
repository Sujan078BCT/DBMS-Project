const express = require('express');
const router = express.Router();
const toast = require('../utilities/toast');
const supervisorProcedures = require('../procedures/supervisorProcedures');
const mobileProcedures = require('../procedures/mobileProcedures');
const { authUser, authRole, ROLE } = require('../utilities/auth');

// get supervisor dashboard when clicked on itself
router.get('/', authUser, authRole([ROLE.SUPERVISOR]), function (req, res) {
  res.render('supervisor/supervisorDashboard');
});
// get supervisor profile
router.get('/profile', authUser, authRole([ROLE.SUPERVISOR]), (req, res) => {
  const id = req.session.userId;
  supervisorProcedures.viewSupervisorProfile(id).then(response => {
    const profile = response[0];
    mobileProcedures.viewMobileNumber(id).then(response=>{
      res.render('supervisor/supervisorProfile', {
        supervisor: profile,
        mobiles:response
      }) 
    })
  }).catch(err => {
    res.redirect('/supervisor');
  });
});
// supervisor to get supervised student name,id and duration of supervison
router.get(
  '/students',
  authUser,
  authRole([ROLE.SUPERVISOR]),
  function (req, res) {
    const supervisorId = req.session.userId;
    supervisorProcedures.supervisorViewStudents(supervisorId).then(response => {
      res.render('supervisor/students', {
        students: response
      });
    });
  }
);
// get all theses supervised and all examiner
router.get(
  '/theses',
  authUser,
  authRole([ROLE.SUPERVISOR]),
  function (req, res) {
    const supervisorId = req.session.userId;
    supervisorProcedures.supervisorViewThesis(supervisorId).then(response => {
      supervisorProcedures.viewUnapprovedThesis(supervisorId).then(
        response3=>{
          console.log(response3);
          supervisorProcedures.viewExaminer().then(response2 => {
            res.render('supervisor/theses', {
              theses: response,
              examiner: response2,
              unapprovedThesis: response3
            });
          });
        }
      )
    });
  }
);
// get all student name and progress report prepared by them
router.get(
  '/reports',
  authUser,
  authRole([ROLE.SUPERVISOR]),
  function (req, res) {
    const supervisorId = req.session.userId;
    supervisorProcedures
      .supervisorViewAllStudentsReports(supervisorId)
      .then(response => {
        res.render('supervisor/reports', {
          reports: response,
        });
      });
  }
);

router.post('/students', function (req, res) {
  const studentId = req.body.view.split('(')[0].toString();
  const thesisId = req.body.view.split('(')[1].toString();
  console.log(studentId,thesisId);
  supervisorProcedures
    .supervisorViewStudentPublications(studentId,thesisId)
    .then(response => {
      res.render('supervisor/supervisorPublication', {
        publications: response
      });
    });
});

router.post('/reports/:thesisId', function (req, res) {
  const thesisId = req.params.thesisId;
  const supervisorId = req.session.userId;
  const grade = req.body.grade;
  const reportNo = req.body.report_number;
  console.log(thesisId,supervisorId,reportNo,grade);
  supervisorProcedures
    .supervisorEvaluateReport(supervisorId, thesisId, reportNo, grade)
    .then(()=> {
      toast.showToast(req, 'success', 'Report evaluated successfully');
      res.redirect('/supervisor/reports');
    })
    .catch(err => {
      toast.showToast(req, 'error', err);
      res.redirect('/supervisor/reports');
    });
});

router.post('/approvedthesis/:id',(req,res)=>{
  const thesisId = req.params.id;
  const supervisorId = req.session.userId;
  supervisorProcedures
    .approvedThesis(supervisorId,thesisId)
    .then(()=> {
      toast.showToast(req, 'success', 'Thesis Approved successfully.');
      res.redirect('/supervisor/theses');
    })
    .catch(err => {
      toast.showToast(req, 'error','Thesis cannot be approved.');
      res.redirect('/supervisor/theses');
    });
})
router.post('/rejectThesis/:id',(req,res)=>{
  const thesisId = req.params.id;
  const supervisorId = req.session.userId;
  supervisorProcedures
    .rejectThesis(supervisorId,thesisId)
    .then(()=> {
      toast.showToast(req, 'success', 'Thesis Rejected successfully.');
      res.redirect('/supervisor/theses');
    })
    .catch(err => {
      toast.showToast(req, 'error','Thesis cannot be Reject.');
      res.redirect('/supervisor/theses');
    });
})
router.post('/updatethesis/:id',(req,res)=>{
    const thesisid = req.params.id;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const cluster = req.body.cluster;
    const field = req.body.field; 
    let presentation_date = req.body.presentation_date;
    if(presentation_date=='')
      presentation_date=null;
    supervisorProcedures.updatethesis(thesisid,start_date,end_date,cluster,field,presentation_date).then(()=>{
      toast.showToast(req,'success','Thesis updated successfully.');
      res.redirect('/supervisor/theses');
    })
    .catch(err=>{
      toast.showToast(req,'error','Cannot updated Thesis.');
      res.redirect('/supervisor/theses');
    });
})
router.post('/defenserequest/:id',(req,res)=>{
  const thesisId = req.params.id;
  const supervisorId = req.session.userId;
  supervisorProcedures
    .defenserequest(supervisorId,thesisId)
    .then(()=> {
      toast.showToast(req, 'success', 'Defense Request Send successfully.');
      res.redirect('/supervisor/theses');
    })
    .catch(err => {
      toast.showToast(req, 'error','Defense Request Already Send.');
      res.redirect('/supervisor/theses');
    });
})
module.exports = router;
