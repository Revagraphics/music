import multer from "multer";


// =====================================
// FILE FILTER
// =====================================

const fileFilter = (req, file, cb) => {

  // Audio
  if (file.fieldname === "audio") {

    const allowedAudioTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/ogg",
    ];

    if (allowedAudioTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only audio files are allowed"),
      false
    );
  }


  // Cover image
  if (file.fieldname === "coverImage") {

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedImageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only JPG, PNG and WEBP images are allowed"),
      false
    );
  }


  cb(new Error("Invalid file field"), false);
};


// =====================================
// MULTER INSTANCE
// =====================================

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,

  limits: {
    files: 2,
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});


export default upload;