const sql = require('mysql2');
const connection = require('../connection');

const userLogin = async (email, password) => {
  // make sure that any items are correctly URL encoded in the connection string
  return new Promise((resolve,reject)=>{
    const login = [email,password];
    const query = 'CALL userLogin(?,?,@success,@id)';
    connection.execute(query,login,(err,result)=>{
    if(err){
      return reject(new Error(err));
    }
    const fetchquery = `SELECT @success AS success,@id AS id`;
    connection.query(fetchquery,(err,result)=>{
      if(err)
        return reject(new Error(err));
      return resolve(result[0]);  
    })   
  })
  })
};

const userType = async id => {
  return new Promise((resolve,reject)=>{
    const query = `CALL TypeOfUser(${id},@userType)`;
    connection.execute(query,(err,result)=>{
      if(err)
        return reject(new Error(err));
    const fetchquery = 'SELECT @userType AS type';
    connection.query(fetchquery,(err,result)=>{
      if(err)
        return reject(new Error(err));
      return resolve(result[0]);
    })
    })
  })
};

const addMobile = async (id, mobile) => {
  return new Promise((resolve,reject)=>{
    const number = [id,mobile];
    const query = 'CALL addMobile(?,?)';
    connection.execute(query,number,(err,result)=>{
      if(err){
        if(err.code == 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('already'))
        return reject(new Error("Phone number already added."));
      }
      return resolve();
    })
  })
};
module.exports = {
  userLogin,
  userType,
  addMobile
};
