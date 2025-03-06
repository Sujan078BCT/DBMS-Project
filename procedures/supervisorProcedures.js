const sql = require('mysql2');
const connection = require('../connection');
const supervisorRegister = async (
  firstName,
  lastName,
  email,
  faculty,
  password
) => {
  // make sure that any items are correctly URL encoded in the connection string
  return new Promise((resolve,reject)=>{
    const supervisor = [firstName,lastName,password,faculty,email];
    const query = 'CALL SupervisorRegister(?,?,?,?,?)';
    connection.execute(query,supervisor,(err,result)=>{
      if(err){
        console.log(err);
        if(err.code =='ER_SIGNAL_EXCEPTION' && err.sqlMessage=='Email already exists')
          return reject(new Error("Email already in use."));
      }
      return resolve();
    })
  })
};

const viewSupervisorProfile = async (
  supervisorId
) => {
  return new Promise((resolve,reject)=>{
    const supervisor = [supervisorId];
    const query = 'CALL SupViewProfile(?)';
    connection.execute(query,supervisor,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      console.log(result);
      return resolve(result[0]);
    })
  })
};

const supervisorViewStudents = async supervisorId => {
  return new Promise((resolve,reject)=>{
    const id = [supervisorId];
    const query = 'CALL ViewSupStudentsYears(?)';
    connection.execute(query,id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}; 
// get all theses examined
const supervisorViewThesis = async supervisorId => {
  return new Promise((resolve,reject)=>{
    const supervisor = [supervisorId];
    const query = 'CALL viewSupThesis(?)';
    connection.execute(query,supervisor,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result[0]);
    })
  })
};
const viewUnapprovedThesis = async supervisorId =>{
  return new Promise((resolve,reject)=>{
    const supervisor = [supervisorId];
    const query = 'CALL thesisRequestInfo(?)';
    connection.execute(query,supervisor,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result[0]);
    })
  })
}
const approvedThesis = async (supervisorId,thesisId)=>{
  return new Promise((resolve,reject)=>{
    const data = [supervisorId,thesisId];
    const query = 'CALL ApprovedThesis(?,?)';
    connection.execute(query,data,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result);
    })
  })
}
const rejectThesis = async (supervisorId,thesisId)=>{
  return new Promise((resolve,reject)=>{
    const data = [supervisorId,thesisId];
    const query = 'CALL RejectThesis(?,?)';
    connection.execute(query,data,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result);
    })
  })
}
// view all examiner
const viewExaminer = async () => {
  return new Promise((resolve,reject)=>{
    const query = 'CALL ViewExaminer()';
    connection.execute(query,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
  })
})
};
// view student name and progress report of them
const supervisorViewAllStudentsReports = async supervisorId => {
  return new Promise((resolve,reject)=>{
    const supervisor = [supervisorId];
    const query = 'CALL viewAllStudentsReports(?)';
    connection.execute(query,supervisor,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result[0]);
    })
  })
};

const supervisorViewStudentPublications = async (studentId,thesisId) => {
  return new Promise((resolve,reject)=>{
    const id = [studentId,thesisId];
    const query = 'CALL ViewAStudentPublications(?,?)';
    connection.execute(query,id,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result[0]);
    })
  })
};

const isDomestic = async thesisId => {
  return new Promise((resolve,reject)=>{
    const id = [thesisId];
    const query = 'CALL is_Domestic(?)';
    connection.execute(query,id,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result[0]);
    })
  })
};

const supervisorAddDefenseDomestic = async (thesisId, location, date) => {
  return new Promise((resolve,reject)=>{
    const data = [thesisId,location,date];
    const query = 'CALL AddDefenseDomestic(?,?,?)';
    connection.execute(query,data,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result);
    })
  })
};

const supervisorAddDefenseInternational = async (thesisId, location, date) => {
  return new Promise((resolve,reject)=>{
    const data = [thesisId,location,date];
    const query = 'CALL AddDefenseInternational(?,?,?)';
    connection.execute(query,data,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result);
    })
  })
};

const supervisorCancelThesis = async thesisId => {
  return new Promise((resolve,reject)=>{
    const id = [thesisId];
    const query = 'CALL CancelThesis(?)';
    connection.execute(query,id,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result);
    })
  })
};

const supervisorAddExaminer = async (
  defenseDate,
  examinerName,
  isNational,
  fieldOfWork,
  thesisSerialNo
) => {
  return new Promise((resolve,reject)=>{
    const examiner = [defenseDate,examinerName,isNational,fieldOfWork,thesisSerialNo];
    const query = 'CALL AddExaminer(?,?,?,?,?)';
    connection.execute(query,examiner,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result);
    })
  })
};

const supervisorEvaluateReport = async (
  supervisorId,
  thesisId,
  reportNo,
  grade
) => {
  return new Promise((resolve,reject)=>{
    const eval_report = [supervisorId,thesisId,reportNo,grade];
    const query = 'CALL EvaluateProgressReport(?,?,?,?)';
    connection.execute(query,eval_report,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result);
    })
  })
};
const updatethesis = async(thesisid,start_date,end_date,cluster,field,presentation_date)=>{
  return new Promise((resolve,reject)=>{
    const thesis_info = [thesisid,start_date,end_date,cluster,field,presentation_date];
    const query = 'CALL supUpdatethesis(?,?,?,?,?,?)';
    connection.execute(query,thesis_info,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
}
const defenserequest = async(supervisorId,thesisId)=>{
  return new Promise((resolve,reject)=>{
    const thesis_info = [supervisorId,thesisId];
    const query = 'CALL sendDefenseRequest(?,?)';
    connection.execute(query,thesis_info,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
}
module.exports = {
  supervisorRegister,
  supervisorViewStudents,
  supervisorViewStudentPublications,
  supervisorViewThesis,
  isDomestic,
  supervisorAddDefenseDomestic,
  supervisorAddDefenseInternational,
  viewExaminer,
  supervisorCancelThesis,
  supervisorAddExaminer,
  supervisorViewAllStudentsReports,
  supervisorEvaluateReport,
  viewSupervisorProfile,
  viewUnapprovedThesis,
  approvedThesis,
  rejectThesis,
  updatethesis,
  defenserequest
};
