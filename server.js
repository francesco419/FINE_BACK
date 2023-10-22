const express = require('express');
const cors = require('cors');
//const ImageUploader = require('./functions/imageUploader');
//const static = require('serve-static');
require('dotenv').config();
//const bodyParser = require('body-parser');
//const upload = multer({ dest: "./images/" });
let actionApi = require('./action');
const app = express();
const { PORT, BUCKET } = process.env;

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
    bucket: BUCKET,
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

app.set('port', PORT || 3030);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static('file'));
app.use(
  cors({
    origin: 'http://localhost:3000', //'https://finedition.kr',
    methods: ['GET', 'POST', 'UPDATE', 'PUT'],
    credentials: true
  })
);

app.put('/updateuser', upload.array('file'), actionApi.updateUser);

app.post('/test', actionApi.test);
app.post('/logincheck', actionApi.postLoginCheck);
app.post('/register', actionApi.postRegister);
//app.update('/updateuser', actionApi.updateUser);

app.put('/update/keyword', actionApi.updateKeyword);

app.post('/postlikeadd', actionApi.postLikeAdd);
app.post('/postlikedel', actionApi.postLikeDel);
app.get('/getlike', actionApi.getLike);

app.get('/getlikebookmark', actionApi.getLikeBookmark);
app.get('/checklikebookmark', actionApi.checklikebookmark);

app.post('/postbookmarkadd', actionApi.postBookmarkAdd);
app.post('/postbookmarkdel', actionApi.postBookmarkDel);
app.post('/getbookmark', actionApi.getBookmark);

app.get('/gettravel', actionApi.getTravel);
app.post('/posttravel', actionApi.postTravel);

app.get('/getinfo', actionApi.getInfoData);

app.listen(PORT, () => {
  console.log('listening on port', PORT);
});
