const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    region: 'auto',
    apiVersion: '2006-03-01',
    signatureVersion: 'v4'
});

const encodeFileName = (fileName) => encodeURIComponent(fileName);
function generateRandomFilename(file) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'vndailynews_';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const fileExtension = file.originalname.split('.').pop(); // Lấy phần mở rộng của file
    return `${result}.${fileExtension}`;
}

const upload = multer({
    storage: multerS3({ // xử lý s3 storage để lưu trữ các tệp tin gửi lên server
        s3: s3,
        bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        metadata: function (_, file, cb) { // Lưu metadata với tên gốc của file
            const encodedFileName = encodeFileName(file.originalname);
            cb(null, { fieldName: encodedFileName });
        },
        key: function (_, file, cb) { // file name là một chuỗi ngẫu nhiên với 8 ký tự và có prefix là vndailynews sẽ được lưu trữ trong s3 storage
            const randomFilename = generateRandomFilename(file);
            cb(null, randomFilename);
        }
    }),
    fileFilter: function (req, file, cb) { //xác định loại file nào được phép uplaod lên server
        if (![
            'image/png', 'image/jpeg', 'image/gif', 'image/webp',
            'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/webm',
            'audio/mpeg'
        ].includes(file.mimetype)) {
            req.fileValidationError = 'Chỉ được phép upload file dạng PNG, JPG, GIF, WEBP!';
            return cb(null, false, new Error('Chỉ được phép upload file dạng PNG, JPG, GIF, HEIC, WEBP!'));
        }
        cb(null, true);
    },
    limits: { fieldSize: 250 * 1024 * 1024 }
})

module.exports = {
    upload,
    s3
}

