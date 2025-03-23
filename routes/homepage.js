const express = require('express');
const router = express.Router();
const connection = require('../connection');

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
router.get(
    '/', async (req, res) => {
        const supervisors = await listSupervisors();
        const examiners = await listexaminers();
        res.render('homepage', {
          supervisors,
          examiners
        });
    }
  );


module.exports = router;
