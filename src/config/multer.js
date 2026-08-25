import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Solo se permiten imágenes JPG y PNG"));
    }

    cb(null, true);
  },
});

export default upload;
