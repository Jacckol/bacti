const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/empleadores",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `record_policial_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

module.exports = multer({ storage, fileFilter });
