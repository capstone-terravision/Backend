// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'images');
//   },

//   filename: function (req: any, file: any, cb: any) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const fileFilter = (req: any, file: any, cb: any) => {
//   if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
//   }
// };
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// export default upload;

import { Storage } from '@google-cloud/storage';
import multer from 'multer';

// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

const storageConfig = multer.memoryStorage();
const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storageBucket = process.env.GOOGLE_STORAGE_BUCKET as string;
const storage = new Storage();
const bucket = storage.bucket(storageBucket);
export { upload, storage, bucket };
