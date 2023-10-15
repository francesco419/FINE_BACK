const express = require('express');
const cors = require('cors');
//const ImageUploader = require('./functions/imageUploader');
//const static = require('serve-static');
require('dotenv').config();
//const bodyParser = require('body-parser');
//const upload = multer({ dest: "./images/" });
let actionApi = require('./action');
const app = express();
const { PORT } = process.env;

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

AWS.config.update({
  region: 'ap-northeast-2', //현재 리전
  accessKeyId: AWS_ACCESS_KEY_ID, //IAM 엑세스 키
  secretAccessKey: AWS_SECRET_ACCESS_KEY //IAM 시크릿 엑세스 키
});

const s3 = new AWS.S3();

const allowExtensions = ['.png', 'jpg', 'jpeg', 'bmp'];
//사용 가능한 이미지 확장자 설정

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'finedition-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      /* const uploadDirectory = req.query.directory; //업로드 할 경로 설정
      const extension = path.extname(file.originalname);
      console.log(extension);
      if (!allowExtensions.includes(extension)) {
        //extension확인을 위한 코드 - 확장자 필터링
        console.log('Wrong !!!!!!!!!!!!!!!!!!');
        return callback(new Error('wrong extension')); //에러 발생
      } */
      callback(null, `${Date.now()}_${file.originalname}`);
    },
    acl: 'public-read-write'
  })
});

/* const fileFilter = (req, file, cb) => {
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
}); */

app.set('port', PORT || 3030);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static('file'));
app.use(
  cors({
    origin: 'https://finedition.kr/',
    methods: ['GET', 'POST'],
    credentials: true
  })
);

app.post('/testimage', upload.array('file'), async (req, res) => {
  console.log(req.files);
  //res.json({ url: req.file });
});

app.post('/test', actionApi.test);
app.post('/logincheck', actionApi.postLoginCheck);
app.post('/register', actionApi.postRegister);
//app.post('/register', actionApi.postRegister);

app.post('/getinfo', actionApi.getInfoData);

app.listen(PORT, () => {
  console.log('listening on port', PORT);
});
