const mysql = require('mysql');
const dbconfig = require('./dbconfig.json');
const { POOL_PASSWORD, POOL_HOST, POOL_USER, POOL_DATABASE } = process.env;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: POOL_HOST, //dbconfig.host,
  user: POOL_USER, //dbconfig.user,
  password: POOL_PASSWORD, //dbconfig.password,
  database: POOL_DATABASE, //dbconfig.database,
  debug: false,
  multipleStatements: true
});

function getConnection(callback) {
  //getConnection 실행함수, callback매개변수는 조건문 이후 실핼될 코드
  pool.getConnection((err, conn) => {
    if (err) {
      console.log('Connection Error to MySQL');
      return;
    }
    console.log('connection success');
    callback(err, conn); //코드를 매개변수로 받아 이후 실행코드 실행가능.
  });
}

module.exports = { getConnection }; //object로 반환
//참고 : https://stackoverflow.com/questions/57983418/db-getconnection-is-not-a-function
