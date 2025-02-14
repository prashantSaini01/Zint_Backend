// import { S3Client } from "@aws-sdk/client-s3";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import dotenv from "dotenv";

// dotenv.config();

// // ✅ AWS S3 Client using AWS SDK v3
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // ✅ Multer-S3 Configuration (REMOVE "acl: public-read")
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET_NAME,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `profile_pictures/${Date.now()}_${file.originalname}`);
//     },
//   }),
// });

// export default upload;



// Without AWS keys Code

// import { S3Client } from "@aws-sdk/client-s3";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import dotenv from "dotenv";

// dotenv.config();

// // ✅ AWS S3 Client using AWS SDK v3
// const s3 = new S3Client({
//   region: process.env.AWS_REGION || 'ap-south-1', // Fallback to your default region
// });

// // ✅ Multer-S3 Configuration
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET_NAME,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `profile_pictures/${Date.now()}_${file.originalname}`);
//     },
//   }),
// });

// export default upload;


import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import mime from "mime-types"; // ✅ Import mime-types
import dotenv from "dotenv";
 
dotenv.config();
 
// ✅ AWS S3 Client using AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
});
 
// ✅ Multer-S3 Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    contentType: (req, file, cb) => {

      const mimeType = mime.lookup(file.originalname) || "application/octet-stream"; // ✅ Detect MIME type
      console.log(mimeType);
      cb(null, mimeType);
    },
    key: (req, file, cb) => {
      cb(null, `profile_pictures/${Date.now()}_${file.originalname}`);
    },
  }),
});
 
export default upload;
