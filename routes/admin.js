const express = require('express');
const router = express.Router();
const adminProcedures = require('../procedures/adminProcedures');
const mobileProcedures = require('../procedures/mobileProcedures');
const toast = require('../utilities/toast');
const { authUser, authRole, ROLE } = require('../utilities/auth');
const jwt = require('jsonwebtoken');
const secretPassword = require('../secret_password');
// get admin dashboard
router.get('/', authUser, authRole([ROLE.ADMIN]), function (req, res, next) {
  res.render('admin/adminDashboard');
});
// get admin profile
router.get('/profile', authUser, authRole([ROLE.ADMIN]), (req, res) => {
  const id = req.session.userId;
  adminProcedures.adminViewProfile(id).then(response => {
    const profile = response[0];
    mobileProcedures.viewMobileNumber(id).then(response=>{
          res.render('admin/adminProfile', {
            admin: profile,
            mobiles:response
          }) 
        })
  });
});
// get all students
router.get('/students',authUser,authRole([ROLE.ADMIN]),async (req,res)=>{
  const approvedStudents = await adminProcedures.listStudents();
  const unapprovedStudents = await adminProcedures.listUnapprovedStudents();
  res.render('admin/students',{
    approvedStudents,
    unapprovedStudents
  });
});
// get all supervisor
router.get(
  '/supervisors',
  authUser,
  authRole([ROLE.ADMIN]),
  function (req, res) {
    adminProcedures
      .listSupervisors()
      .then(response => {
        res.render('admin/supervisors', { supervisors: response});
      })
      .catch(err => {
        res.redirect('/');
      });
  }
);
// get all examiner
router.get('/examiners',authUser,authRole([ROLE.ADMIN]),async (req,res)=>{
  const unapprovedExaminers = await adminProcedures.listUnapprovedExaminers();
  const approvedExaminers = await adminProcedures.listexaminers();
  res.render('admin/examiners',{
    unapprovedExaminers,
    approvedExaminers
  });
})
// get theses and its count
router.get('/theses', authUser, authRole([ROLE.ADMIN]), async function (req, res) {
  const ongoing = await adminProcedures.ongoingtheses();
  const pending = await adminProcedures.pendingtheses();
  const examiners = await adminProcedures.listexaminers();
  res.render('admin/theses',{
    ongoingtheses:ongoing,
    pendingtheses:pending,
    examiners
  })
});
router.post('/addSupervisor', function (req, res) {
  const {first_name,last_name,password,faculty,email,address,cluster} = req.body;
  const encrypted_password = jwt.sign(password,secretPassword);
  adminProcedures.addSupervisor(
    first_name,
    last_name,
    encrypted_password,
    faculty,
    email,
    address,
    cluster
  ).then(()=> {
    toast.showToast(req, 'success', 'Supervisor Added Successfully.');
    res.redirect('/admin/supervisors');
  }).catch(err => {
    toast.showToast(req, 'error', 'Email already in use.');
    res.redirect('back');
  }
  )
});
router.post('/addExaminer', function (req, res) {
  const {first_name,last_name,field,cluster,email,password} = req.body;
  const encrypted_password = jwt.sign(password,secretPassword);
  adminProcedures.addExaminer(
    first_name,
    last_name,
    field,
    cluster,
    email,
    encrypted_password
  ).then(()=> {
    toast.showToast(req, 'success', 'Examiner Added Successfully.');
    res.redirect('/admin/examiners');
  }).catch(err => {
    toast.showToast(req, 'error', 'Email already in use.');
    res.redirect('back');
  }
  )
});
router.post('/updatethesis/:thesisid',function(req,res){
  const thesisid = req.params.thesisid;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const field = req.body.field;
  adminProcedures.updatethesis(thesisid,start_date,end_date,field).then(()=>{
    toast.showToast(req,'success','Thesis updated successfully.');
    res.redirect('/admin/theses');
  })
  .catch(err=>{
    console.log(err);
    toast.showToast(req,'error','Cannot updated Thesis.');
    res.redirect('/admin/theses');
  });
})
router.post('/:id/:role/delete',function(req,res){
  const id = req.params.id;
  const role = req.params.role;
  adminProcedures.deleteuser(id).then(()=>{
    toast.showToast(req,'success','Deleted Successfully.');
    res.redirect('/admin/'+role);
  })
  .catch(err=>{
    toast.showToast(req,'error','Cannot delete '+role);
    res.redirect('/admin/'+role);
  })
})
router.post('/deletethesis/:id',function(req,res){
  const id = req.params.id;
  adminProcedures.deletethesis(id).then(()=>{
    toast.showToast(req,'success','Deleted Successfully.');
    res.redirect('/admin/theses');
  })
  .catch(err=>{
    toast.showToast(req,'error','Cannot delete thesis.');
    res.redirect('/admin/theses');
  })
})
router.post('/deletependingthesis/:id',function(req,res){
  const id = req.params.id;
  adminProcedures.deletependingthesis(id).then(()=>{
    toast.showToast(req,'success','Deleted Successfully.');
    res.redirect('/admin/theses');
  })
  .catch(err=>{
    toast.showToast(req,'error','Cannot delete thesis.');
    res.redirect('/admin/theses');
  })
})
router.post('/approved/:studentid',(req,res)=>{ 
  const id = req.params.studentid;
  adminProcedures.approvedStudent(id).then(()=>{
    toast.showToast(req,'success','Request Approved.');
    res.redirect('/admin/students')
  })
  .catch(err=>{
    toast.showToast(req,'error','Fail to Accept Request.');
    res.redirect('/admin/students');
  })
})
router.post('/approvedExaminer/:examinerid',(req,res)=>{
  const id = req.params.examinerid;
  adminProcedures.approvedExaminer(id).then(()=>{
    toast.showToast(req,'success','Request Approved.');
    res.redirect('/admin/examiners')
  })
  .catch(err=>{
    toast.showToast(req,'error','Fail to Accept Request.');
    res.redirect('/admin/examiners');
  })
})
router.post('/rejectExaminer/:examinerid',(req,res)=>{
  const id = req.params.examinerid;
  adminProcedures.rejectExaminer(id).then(()=>{
    toast.showToast(req,'success','Request Rejected.');
    res.redirect('/admin/examiners')
  })
  .catch(err=>{
    toast.showToast(req,'error','Failed to Reject Request.');
    res.redirect('/admin/examiners');
  })
})
router.post('/reject/:studentid',(req,res)=>{
  const id = req.params.studentid;
  adminProcedures.rejectStudent(id).then(()=>{
    toast.showToast(req,'success','Request Rejected.');
    res.redirect('/admin/students')
  })
  .catch(err=>{
    toast.showToast(req,'error','Failed to Reject Request.');
    res.redirect('/admin/students');
  })
})
router.post('/addDefense/:thesisId',(req,res)=>{
  const thesis_id = req.params.thesisId;
  const defense_date = req.body.date;
  const location = req.body.location;
  const examiner_id = req.body.examiner;
  adminProcedures.addDefense(thesis_id,defense_date,location,examiner_id).then(()=>{
    toast.showToast(req,'success','Defense info successfully added.');
    res.redirect('/admin/theses')
  })
 .catch(err=>{
  toast.showToast(req,'error','Failed to add Defense.');
  res.redirect('/admin/theses');
 })
})
module.exports = router;
