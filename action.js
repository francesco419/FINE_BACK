const multer = require('multer');
const getConnection = require('./config/getConnection');

exports.test = (req, res) => {
  console.log(req);
  res.send(err);
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
      'INSERT INTO userdata(name,email,keyword,photo,nationality,age,gender) VALUES(?,?,?,?,?,?,?);',
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
  console.log(req.query.id);
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `select * from info where contentid=(?);`,
      [req.query.id],
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
