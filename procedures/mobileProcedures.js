const connection = require('../connection');
const viewMobileNumber = async (
    Id
  ) => {
    return new Promise((resolve,reject)=>{
      const info = [Id];
      const query = 'CALL viewMobile(?)';
      connection.execute(query,info,(err,result)=>{
        if(err)
        {
          console.log(err);
          return reject();
        }
        return resolve(result[0]);
      })
    })
  };
  
  module.exports = {viewMobileNumber};