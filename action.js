const multer = require('multer');
const getConnection = require('./config/getConnection');
require('dotenv').config();
//const dbconfig = require('./dbconfig.json');

exports.test = (req, res) => {
  console.log(req.body.id);
  //return res.send({ result: result, flag: true, check: true });
  /* getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `SELECT * FROM tempdata WHERE iduserdata=(?) limit 1;`,
      [req.body.id],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('result null error');
          return res.send({ result: result, flag: false, check: false });
        } else {
          console.log('there is userinfo');
          return res.send({ result: result, flag: true, check: true });
        }
      }
    );
  }); */
};

exports.postLoginCheck = (req, res) => {
  const compare = req.body.email;
  console.log(req.body.email);
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `SELECT * FROM userdata WHERE email='${compare}'limit 1;`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log('result null error');
          return res.send({ result: result, flag: false, check: false });
        } else {
          console.log('there is userinfo');
          return res.send({ result: result, flag: false, check: true });
        }
      }
    );
  });
};

exports.postRegister = (req, res) => {
  console.log(req.body);
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      'INSERT INTO userdata(name,email,keyword,photo,nationality,birth,gender) VALUES(?,?,?,?,?,?,?);',
      [
        req.body.name,
        req.body.email,
        JSON.stringify(req.body.keyword),
        'null',
        req.body.nationality,
        req.body.age,
        req.body.gender
      ],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('register failed');
          return res.send({ result: result, flag: false });
        } else {
          console.log('register success');
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

exports.getInfoData = (req, res) => {
  console.log(req.body.id);
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `select * from tempdata where name=(?);`,
      [req.body.id],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          console.log('info success');
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

/* exports.getInfoData = (req, res) => {
  var connection = mysql.createConnection({
    host: POOL_HOST,
    user: POOL_USER,
    password: POOL_PASSWORD,
    port: POOL_DATABASE
  });

  connection.connect(function (err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });

  connection.end();
}; */
