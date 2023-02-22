const fs = require('fs');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images'),
  filename: (req, file, cb) => cb(null, `${uuid.v4()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const correctPath = path.join(__dirname, '../', filePath);
    fs.unlink(correctPath, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve('File deleted');
    })
  });
};

module.exports = {
  fileStorage,
  fileFilter,
  deleteFile,
};