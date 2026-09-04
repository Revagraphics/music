import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";


// =====================================
// CREATE UPLOAD DIRECTORIES
// =====================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioDir = path.join(__dirname, "..", "uploads", "audio");
const imageDir = path.join(__dirname, "..", "uploads", "images");

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, {
    recursive: true,
  });
}

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, {
    recursive: true,
  });
}


// =====================================
// STORAGE
// =====================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (file.fieldname === "audio") {
      cb(null, audioDir);
    }

    else if (file.fieldname === "coverImage") {
      cb(null, imageDir);
    }

    else {
      cb(new Error("Invalid upload field"));
    }
  },

  filename: (req, file, cb) => {

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

    const extension =
      path.extname(file.originalname);

    cb(
      null,
      `${uniqueName}${extension}`
    );
  },
});


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
  storage,
  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});


export default upload;