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
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `SELECT * FROM userdata WHERE useremail='${compare}'limit 1;`,
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
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      'INSERT INTO userdata(username,useremail,userkeyword,userImage,usernation,userbirth,usergender) VALUES(?,?,?,?,?,?,?);',
      [
        req.body.username,
        req.body.useremail,
        JSON.stringify(req.body.keyword),
        'null',
        req.body.usernation,
        req.body.userbirth,
        req.body.usergender
      ],
      (err, result) => {
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
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `select * from userdata where userid=(?);`,
      [req.query.userid],
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

/**----------------keyword update -------------------*/

exports.updateKeyword = (req, res) => {
  console.log(req.body);
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `update userdata set userkeyword=(?) where userid=(?);`,
      [JSON.stringify(req.body.userkeyword), req.body.userid],
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

/**----------------update userdata -------------------*/

exports.updateUser = (req, res) => {
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `update userdata set username=(?), userImage=(?), usernation=(?), usergender=(?),userbirth=(?) where userid=(?);`,
      [
        req.body.username,
        req.files[0].location,
        req.body.usernation,
        req.body.usergender,
        req.body.userbirth,
        req.body.userid
      ],
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

/**----------------like -------------------*/
exports.postLikeAdd = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `INSERT INTO likedata(userid,likenum) VALUES(?,?);`,
      [req.body.userid, req.body.dataId],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

exports.getLike = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `select likenum from likedata where userid=(?);select bookmarknum from bookmarkdata where userid=(?);`,
      [req.query.userid, req.query.userid],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

exports.getLikeBookmark = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `select likenum from likedata where userid=(?);select bookmarknum from bookmarkdata where userid=(?);`,
      [req.query.userid, req.query.userid],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

exports.checklikebookmark = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `select * from likedata where userid=(?) and likenum=(?);select * from bookmarkdata where userid=(?) and bookmarknum=(?);`,
      [req.query.userid, req.query.dataid, req.query.userid, req.query.dataid],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

exports.postLikeDel = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `delete from likedata where userid=(?) and likenum=(?);`,
      [req.body.userid, req.body.dataId],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

/**----------------bookmark -------------------*/

exports.postBookmarkAdd = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `INSERT INTO bookmarkdata(userid,bookmarknum) VALUES(?,?);`,
      [req.body.userid, req.body.dataId],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};
exports.getBookmark = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `select bookmarknum from bookmarkdata where userid=(?)`,
      [req.query.userid],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

exports.postBookmarkDel = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `delete from bookmarkdata where userid=(?) and bookmarknum=(?);`,
      [req.body.userid, req.body.dataId],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

/**----------------travel -------------------*/

exports.getTravel = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `SELECT * FROM traveldata where userid=(?) order by modifyDate DESC limit 1;`,
      [req.query.userid],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('travel GET failed');
          return res.send({ result: result, flag: false });
        } else {
          console.log('travel GET success');
          return res.send({ result: result, flag: true });
        }
      }
    );
  });
};

exports.postTravel = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `insert into traveldata(userid,startDate,endDate,reason,modifyDate) values(?,?,?,?,?);`,
      [
        req.body.userid,
        req.body.start,
        req.body.end,
        req.body.reason,
        req.body.modify
      ],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('info failed');
          return res.send({ result: result, flag: false });
        } else {
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
