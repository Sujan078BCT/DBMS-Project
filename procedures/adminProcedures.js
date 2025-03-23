const sql = require('mysql2');
const connection = require('../connection');
const adminViewProfile = async (
  adminId
) => {
  return new Promise((resolve,reject)=>{
    const admin = [adminId];
    const query = 'CALL AdminViewProfile(?)';
    connection.execute(query,admin,(err,result)=>{
      if(err)
      {
        return reject();
      }
      return resolve(result[0]);
    })
  })
}

const listSupervisors = async () => {
  return new Promise((resolve,reject)=>{
    const query = 'CALL AdminListSup()';
    connection.execute(query,(err,result)=>{
      if(err)
      {
        return reject();
      }
      return resolve(result[0]);
    })
  })
};

const listTheses = async () => {
  return new Promise((resolve,reject)=>{
    const query = 'CALL AdminViewAllTheses()';
    connection.execute(query,(err,result)=>{
      if(err)
      {
        return reject();
      }
      return resolve(result[0]);
    })
  })
};
const ongoingtheses = async()=>{
  return new Promise((resolve,reject)=>{
  const query = 'CALL ongoingtheses()';
  connection.execute(query,(err,result)=>{
    if(err){
      return reject(new Error(err));
    }
    return resolve(result[0]);
  })
  })
}
const pendingtheses = async()=>{
  return new Promise((resolve,reject)=>{
    const query = 'CALL pendingtheses()';
    connection.execute(query,(err,result)=>{
      if(err){ 
       return reject(new Error(err));
      }
      return resolve(result[0]);
    })
    })
}

const listStudents = async()=>{
  return new Promise((resolve,reject)=>{
    const query = 'CALL listStudents()';
    connection.execute(query,(err,results)=>{
      if(err){
        return reject(new Error(err));
      }
      return resolve(results[0]);
    })
  })
}

const listUnapprovedStudents = async()=>{
  return new Promise((resolve,reject)=>{
    const query = 'CALL unapprovedStudent()';
    connection.execute(query,(err,results)=>{
      if(err){
        return reject(new Error(err));
      }
      return resolve(results[0]);
    })
  })
}

const approvedStudent = async id=>{
  return new Promise((resolve,reject)=>{
    const query = `CALL StudentRegister(${id})`;
    connection.execute(query,(err,results)=>{
      if(err){
        return reject(new Error(err));
      }
      return resolve(results);
    })
  })
}

const rejectStudent = async id=>{
  return new Promise((resolve,reject)=>{
    const query = `CALL rejectStudent(${id})`;
    connection.execute(query,(err,results)=>{
      if(err){       
        return reject(new Error(err));
      }
      return resolve(results);
    })
  })
}
const listexaminers = async()=>{
  return new Promise((resolve,reject)=>{
    const query = 'CALL listexaminers()';
    connection.execute(query,(err,result)=>{
      if(err){       
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
const listUnapprovedExaminers = async()=>{
  return new Promise((resolve,reject)=>{
    const query = 'CALL listUnapprovedExaminers()';
    connection.execute(query,(err,result)=>{
      if(err){        
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
const approvedExaminer = async(id)=>{
  return new Promise((resolve,reject)=>{
    const query = `CALL ExternalExaminerRegister(${id})`;
    connection.execute(query,(err,result)=>{
      if(err){        
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
const rejectExaminer = async(id)=>{
  return new Promise((resolve,reject)=>{
    const query = `CALL rejectExaminer(${id})`;
    connection.execute(query,(err,result)=>{
      if(err){       
        return reject(new Error(err));
      }
      return resolve(result[0]);
    })
  })
}
const numOfOnGoingTheses = async () => {
  return new Promise((resolve,reject)=>{
    const query = 'CALL AdminViewOnGoingTheses(@count)';
    connection.execute(query,(err,result)=>{
      if(err)
      {     
        return reject();
      }
    const fetchquery = `SELECT @count AS count`;
    connection.query(fetchquery,(err,result)=>{
      if(err)
        return reject(new Error(err));
      return resolve(result[0]);  
    })
    })
  })
};

const updatethesis = async(thesisid,start_date,end_date,field)=>{
  return new Promise((resolve,reject)=>{
    const thesis_info = [thesisid,start_date,end_date,field];
    const query = 'CALL updatethesis(?,?,?,?)';
    connection.execute(query,thesis_info,(err,result)=>{
      if(err){        
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
}
const deletethesis = async id =>{
  return new Promise((resolve,reject)=>{
    const serial_number= [id];
    const query = 'CALL deletethesis(?)';
    connection.execute(query,serial_number,(err,result)=>{
      if(err){       
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
}
const deletependingthesis = async id =>{
  return new Promise((resolve,reject)=>{
    const serial_number= [id];
    const query = 'CALL deletependingthesis(?)';
    connection.execute(query,serial_number,(err,result)=>{
      if(err){        
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
}
const addDefense = async (thesis_id,defense_date,location,examiner_id)=>{
  return new Promise((resolve,reject)=>{
    const defense_info = [thesis_id,defense_date,location,examiner_id];
    const query = 'CALL addDefense(?,?,?,?)';
    connection.execute(query,defense_info,(err,result)=>{
      if(err){  
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
}
const deleteuser = async id =>{
  return new Promise((resolve,reject)=>{
    const student_id = [id];
    const query = 'CALL deleteuser(?)';
    connection.execute(query,student_id,(err,result)=>{
      if(err){
        return reject(new Error(err));
      }
      return resolve(result);
    })
  })
}
const addSupervisor = async (first_name,last_name,password,faculty,email,address,cluster)=>{
  return new Promise((resolve,reject)=>{
    const supervisor_info = [first_name,last_name,password,faculty,email,address,cluster];
    const query = 'CALL SupervisorRegister(?,?,?,?,?,?,?)';
    connection.execute(query,supervisor_info,(err,result)=>{
      if(err){
        if(err.code =='ER_SIGNAL_EXCEPTION'&&err.sqlMessage.includes('already'))
          return reject(new Error('Email already in use.'));
      }
      return resolve(result);
    })
  })
}
const addExaminer = async (first_name,last_name,field,cluster,email,password)=>{
  return new Promise((resolve,reject)=>{
    const supervisor_info = [first_name,last_name,field,cluster,email,password];
    const query = 'CALL InternalExaminerRegister(?,?,?,?,?,?)';
    connection.execute(query,supervisor_info,(err,result)=>{
      if(err){
        if(err.code =='ER_SIGNAL_EXCEPTION'&&err.sqlMessage.includes('already'))
          return reject(new Error('Email already in use.'));
      }
      return resolve(result);
    })
  })
}

module.exports = {
  listSupervisors,
  listTheses,
  ongoingtheses,
  pendingtheses,
  numOfOnGoingTheses,
  updatethesis,
  adminViewProfile,
  listStudents,
  listUnapprovedStudents,
  approvedStudent,
  rejectStudent,
  listexaminers,
  deletethesis,
  deletependingthesis,
  deleteuser,
  addDefense,
  listUnapprovedExaminers,
  approvedExaminer,
  rejectExaminer,
  addSupervisor,
  addExaminer
};
