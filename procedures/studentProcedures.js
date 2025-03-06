const sql = require('mysql2');
const connection = require('../connection');

const registerRequest = async (
  firstName,
  lastName,
  email,
  address,
  faculty,
  password,
  type
) => {
  // make sure that any items are correctly URL encoded in the connection string
  return new Promise((resolve,reject)=>{
    const student = [firstName,lastName,password,faculty,parseInt(type),email,address];
    const query = `CALL RegistrationRequest(?,?,?,?,?,?,?)`;
    connection.execute(query,student,(err,results)=>{
      if(err){
        console.error(err);
        if(err.code =='ER_SIGNAL_EXCEPTION'&&err.sqlMessage.includes('already'))
          return reject(new Error('Email already in use.'));
      }
      return resolve();
  })
  });
};

const viewMyProfile = async (
  studentId
) => {
  return new Promise((resolve,reject)=>{
    const student = [studentId];
    const query = 'CALL viewStudentProfile(?)';
    connection.execute(query,student,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result[0]);
    })
  })
};

const updateProfile = async (
  studentId,
  firstName,
  lastName,
  email,
  address
) => {
  return new Promise((resolve,reject)=>{
    const updateStudent = [studentId,firstName,lastName,email,address];
    const query = 'CALL editStudentProfile(?,?,?,?,?)';
    connection.execute(query,updateStudent,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  });
};

const viewAllMyTheses = async (
  studentId
) => {
  return new Promise((resolve,reject)=>{
    const id = [studentId];
    const query = 'CALL viewAllMyTheses(?)';
    connection.execute(query,id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
};

const viewCoursesGrades = async (
  studentId
) => {
  return new Promise((resolve,reject)=>{
    const id = [studentId];
    const query = 'CALL ViewCoursesGrades(?)';
    connection.execute(query,id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
};
const viewMyReports = async (
  studentId
) => {
  return new Promise((resolve,reject)=>{
    const id = [studentId];
    const query = 'CALL viewMyReports(?)';
    connection.execute(query,id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
};
const viewMyPublications = async (
  studentId
) => {
  return new Promise((resolve,reject)=>{
    const id = [studentId];
    const query = 'CALL viewMyPublications(?)';
    connection.execute(query,id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
const addPublication = async (
  title,
  publicationDate,
  host,
  place,
  isAccepted,
  studentId
) => {
  return new Promise((resolve,reject)=>{
    const publication = [title,publicationDate,host,place,isAccepted,studentId];
    const query = 'CALL addPublication(?,?,?,?,?,?)';
    connection.execute(query,publication,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    });
  })
};

const addProgressReport = async (
  thesisSerialNumber,
  progressReportDate
) => {
  return new Promise((resolve,reject)=>{
    const progress_report = [thesisSerialNumber,progressReportDate];
    const query = 'CALL AddProgressReport(?,?)';
    connection.execute(query,progress_report,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
};

const fillProgressReport = async (
  thesisSerialNumber,
  progressReportNumber,
  state,
  description
) => {
  return new Promise((resolve,reject)=>{
    const report_status = [thesisSerialNumber,progressReportNumber,state,description];
    const query = 'CALL fillProgressReport(?,?,?,?)';
    connection.execute(query,report_status,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
};

const linkPubThesis = async (
  publicationId,
  thesisSerialNumber
) => {
  return new Promise((resolve,reject)=>{
    const linkthesis = [publicationId,thesisSerialNumber];
    const query = 'CALL linkPubThesis(?,?)';
    connection.execute(query,linkthesis,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
};

const proposedthesis = async(id,title,cluster,field)=>{
  return new Promise((resolve,reject)=>{
    const thesis_info = [id,title,cluster,field]; 
    const query = 'CALL proposedthesis(?,?,?,?)';
    connection.execute(query,thesis_info,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      } 
      return resolve(result);
    })
  })
}
const createdthesis = async(id)=>{
    return new Promise((resolve,reject)=>{
      const student_id = [id];
      const query = 'CALL createdthesis(?)';
      connection.execute(query,student_id,(err,result)=>{
        if(err){
          console.log(err);
          return reject(new Error(err));
        }
        return resolve(result[0]);
      })
    })
}
const supervisorlist = async()=>{
  return new Promise((resolve,reject)=>{
    const query = 'CALL AdminListSup()';
    connection.execute(query,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
const storethesis = async(id,thesis_id,supervisor_id)=>{
  return new Promise((resolve,reject)=>{
    const thesis_request_info = [id,thesis_id,supervisor_id];
    const query = 'CALL sendThesisRequest(?,?,?)';
    connection.execute(query,thesis_request_info,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
const viewThesisRequest = async(id)=>{
  return new Promise((resolve,reject)=>{
    const stud_id = [id];
    const query = 'CALL viewThesisRequest(?)';
    connection.execute(query,stud_id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
module.exports = {
  registerRequest,
  viewMyProfile,
  updateProfile,
  viewAllMyTheses,
  viewCoursesGrades,
  addProgressReport,
  fillProgressReport,
  addPublication,
  linkPubThesis,
  viewMyReports,
  viewMyPublications,
  proposedthesis,
  createdthesis,
  supervisorlist,
  storethesis,
  viewThesisRequest,
};
