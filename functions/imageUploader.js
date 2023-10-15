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

const ImageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'finedition-bucket',
    key: (req, file, callback) => {
      const uploadDirectory = req.query.directory; //업로드 할 경로 설정
      const extension = path.extname(file.originalname);
      if (!allowExtensions.includes(extension)) {
        //extension확인을 위한 코드 - 확장자 필터링
        return callback(new Error('wrong extension')); //에러 발생
      }
      callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
    },
    acl: 'public-read-write'
  })
});

module.exports = { ImageUploader };
