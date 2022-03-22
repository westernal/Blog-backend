const multer = require("multer");
const { v1: uuidv1 } = require("uuid");

const type = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/svg": "svg",
};

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads/images");
    },
    filename: (req, file, callback) => {
      const extension = type[file.mimetype];
      callback(null, uuidv1() + "." + extension);
    },
    fileFilter: (req, file, callback) => {
      const isValid = !!type[file.mimetype];
      let error = isValid ? null : new Error("Invalid Type.");
      callback(error, isValid);
    },
  }),
});

module.exports = fileUpload;
