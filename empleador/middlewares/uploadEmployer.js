const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear carpeta si no existe
const uploadDir = path.join(__dirname, '../../uploads/empleadores');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg"; // fuerza extensión
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

// Filtro compatible con emulador
const fileFilter = (req, file, cb) => {
  console.log("📸 Archivo recibido:");
  console.log(" - originalname:", file.originalname);
  console.log(" - mimetype:", file.mimetype);

  // Aceptar SI EL NOMBRE tiene una extensión de imagen
  const allowedExt = /\.(jpg|jpeg|png|gif)$/i;

  if (allowedExt.test(file.originalname)) {
    return cb(null, true);
  }

  // Aceptar aunque el mimeType sea raro pero contenga "image"
  if (file.mimetype.includes("image")) {
    return cb(null, true);
  }

  // Rechazar otros archivos
  return cb(new Error("Solo se permiten imágenes"), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
