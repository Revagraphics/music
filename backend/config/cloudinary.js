import dotenv from "dotenv";
import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const requiredCloudinaryEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingCloudinaryEnv = requiredCloudinaryEnv.filter(
  (key) => !process.env[key],
);

if (missingCloudinaryEnv.length > 0) {
  throw new Error(
    `Missing Cloudinary environment variables: ${missingCloudinaryEnv.join(", ")}`,
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadBuffer = (buffer, options) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    options,
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    },
  );

  Readable.from(buffer).pipe(uploadStream);
});

export const uploadAudio = (buffer) => uploadBuffer(buffer, {
  folder: "music/audio",
  resource_type: "video",
});

export const uploadImage = (buffer) => uploadBuffer(buffer, {
  folder: "music/images",
  resource_type: "image",
});