const connection = require('../connection');

const ExaminerRegisterRequest = async (
  firstName,
  lastName,
  password,
  fieldOfWork,
  cluster,
  email
) => {
  // make sure that any items are correctly URL encoded in the connection string
  return new Promise((resolve,reject)=>{
    const student = [firstName,lastName,password,fieldOfWork,cluster,email];
    const query = `CALL ExaminerRegistrationRequest(?,?,?,?,?,?)`;
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

const examinerRegister = async (
  firstName,
  lastName,
  email,
  password,
  fieldOfWork,
  cluster
) => {
  // make sure that any items are correctly URL encoded in the connection string
  return new Promise((resolve,reject)=>{
    const examiner = [firstName,lastName,fieldOfWork,cluster,email,password];
    const query = 'CALL ExaminerRegister(?,?,?,?,?,?,?)';
    connection.execute(query,examiner,(err,result)=>{
      if(err){
        console.log(err);
        if(err.code == 'ER_SIGNAL_EXCEPTION' && err.sqlMessage == 'Email already exists')
          return reject(new Error("Email already in use."));
      }
      return resolve();
    })
  })
};
const updateProfile = async(
  id,
  first_name,
  last_name,
  email,
  fieldOfWork,
  type
)=>{
  return new Promise((resolve,reject)=>{
    const updateExaminer = [id,email,first_name,last_name,fieldOfWork,type];
    const query = 'CALL editExaminerProfile(?,?,?,?,?,?)';
    connection.execute(query,updateExaminer,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  });
}

const showExaminerTheses = async (
  examinerId
) =>{
  return new Promise((resolve,reject)=>{
    const id = [examinerId];
    const query = 'CALL ShowExaminerTheses(?)';
    connection.execute(query,id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  });
}

const showThesisSupervisors = async (
  thesisSerialNo
)=>{
  return new Promise((resolve,reject)=>{
    const serial_no = [thesisSerialNo];
    const query = 'CALL ShowThesisSupervisors(?)';
    connection.execute(query,serial_no,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  });
}

const showExaminerDefenses = async (
  examinerId
)=>{
  return new Promise((resolve,reject)=>{
    const id = [examinerId];
    const query = 'CALL ShowExaminerDefense(?)';
    connection.execute(query,id,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  });
}

const addGrade = async (
  thesisSerialNo,
  grade
) =>{
  return new Promise((resolve,reject)=>{
    const thesis_grade = [thesisSerialNo,grade];
    const query = 'CALL AddDefenseGrade(?,?)';
    connection.execute(query,thesis_grade,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  });
}

const addComment = async (
  id,
  thesisSerialNo,
  comment
) =>{
  return new Promise((resolve,reject)=>{
    const add_comment = [id,thesisSerialNo,comment];
    const query = 'CALL AddCommentsGrade(?,?,?)';
    connection.execute(query,add_comment,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result);
    })
  });
}

const searchForThesis = async (
  searchTerm
)=> {
  return new Promise((resolve,reject)=>{
    const search = [searchTerm];
    const query = 'CALL SearchForThesis(?)';
    connection.execute(query,search,(err,result)=>{
      if(err){
        console.log(err);
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  });
}

const showProfile = async(
  id
)=>{
  return new Promise((resolve,reject)=>{
    const examiner = [id];
    const query = 'CALL viewExaminerProfile(?)';
    connection.execute(query,examiner,(err,result)=>{
      if(err)
      {
        console.log(err);
        return reject();
      }
      return resolve(result[0]);
    })
  })
}
module.exports = {
  examinerRegister,
  showExaminerTheses,
  showExaminerDefenses,
  addGrade,
  addComment,
  searchForThesis,
  showThesisSupervisors,
  showProfile,
  updateProfile,
  ExaminerRegisterRequest
};