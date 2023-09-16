const db = require('./DB_core');

function getLastTenMarksEmployee(employee){
    return new Promise((resolve, reject) => {      
      try {                  
        const data = db.query_noParams(`SELECT ID, Time_mark, Type FROM attendance WHERE Employee = ${employee} ORDER BY Time_mark DESC LIMIT 10`);
        data.statusCode = 200;
        resolve(data);
          
      } catch (err) {
        console.error(err);
        let response = { message: 'Error interno del servidor.', statusCode: 500 };
        reject(response);
      }
    });
  }

  function getMarksFromEmployee(employee){
    return new Promise((resolve, reject) => {      
      try {                  
        const data = db.query_noParams(`SELECT ID, Time_mark, Type FROM attendance WHERE Employee = ${employee} ORDER BY Time_mark DESC LIMIT 10`);
        data.statusCode = 200;
        resolve(data);
          
      } catch (err) {
        console.error(err);
        let response = { message: 'Error interno del servidor.', statusCode: 500 };
        reject(response);
      }
    });
  }

  function insertNewTime(employee, time_mark, type){
    return new Promise((resolve, reject) => {
      try {                  
        const data = db.run_noParams(`INSERT INTO attendance (Employee, Time_mark, Type) VALUES ('${employee}', '${time_mark}', '${type}')`);
        data.statusCode = 200;
        resolve(data);
          
      } catch (err) {
        console.error(err);
        let response = { message: 'Error interno del servidor.', statusCode: 500 };
        reject(response);
      }
    });
  }

function getWorkedTime(employee, yearMonth){
  return new Promise((resolve, reject) => {      
    try {
      const data = db.query_noParams(`SELECT time_mark, type FROM attendance WHERE employee = '${employee}' AND Time_mark BETWEEN '${yearMonth}-01 00:00:00' AND '${yearMonth}-31 23:59:59'`);
      data.statusCode = 200;
      resolve(data);
        
    } catch (err) {
      console.error(err);
      let response = { message: 'Error interno del servidor.', statusCode: 500 };
      reject(response);
    }
  });
}

function getWorkedTimeToday(employee, yearMonthDay){
  return new Promise((resolve, reject) => {      
    try {
      const data = db.query_noParams(`SELECT time_mark, type FROM attendance WHERE employee = '${employee}' AND Time_mark LIKE '${yearMonthDay}%'`);
      data.statusCode = 200;      
      resolve(data);
        
    } catch (err) {
      console.error(err);
      let response = { message: 'Error interno del servidor.', statusCode: 500 };
      reject(response);
    }
  });
}

function getAllTimeWorkedTime(employee){
  return new Promise((resolve, reject) => {      
    try {
      console.log("getAllTimeWorkedTime");
      const data = db.query_noParams( `SELECT time_worked FROM total_worked WHERE employee = '${employee}'`);
      data.statusCode = 200;
      resolve(data);
        
    } catch (err) {
      console.error(err);
      let response = { message: 'Error interno del servidor.', statusCode: 500 };
      reject(response);
    }
  });
}

  module.exports = {
    getLastTenMarksEmployee,
    getMarksFromEmployee,
    getWorkedTime,
    getWorkedTimeToday,
    getAllTimeWorkedTime,
    insertNewTime
  }