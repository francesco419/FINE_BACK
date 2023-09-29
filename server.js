const express = require('express');
const path = require('path');
const cors = require('cors');
//const static = require('serve-static');
const dotenv = require('dotenv');
const db = dotenv.config().parsed;
//const bodyParser = require('body-parser');
const multer = require('multer');
//const upload = multer({ dest: "./images/" });
let actionApi = require('./action');
const app = express();
const { PORT } = process.env;

const fileFilter = (req, file, cb) => {
  // 확장자 필터링
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true); // 해당 mimetype만 받겠다는 의미
  } else {
    // 다른 mimetype은 저장되지 않음
    req.fileValidationError = 'jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.';
    req.body = file;
    cb(null, false);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    //폴더위치 지정
    destination: (req, file, done) => {
      done(null, './images/');
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      // aaa.txt => aaa+&&+129371271654.txt
      const fileName = path.basename(file.originalname, ext) + Date.now() + ext;
      done(null, fileName);
    }
  }),
  fileFilter: fileFilter
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('images'));
/* app.use(
  cors({
    origin: 'https://finedition.kr/',
    methods: ['GET', 'POST'],
    credentails: true
  })
); */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTION');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTION'],
    credentails: true
  })
);

app.post('/test', actionApi.test);
app.post('/logincheck', actionApi.postLoginCheck);
app.post('/register', actionApi.postRegister);

app.get('/getinfo', actionApi.getInfoData);

app.listen(() => {
  console.log('listening on port', PORT);
});

/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../finedition/public/index.html'));
}); */
