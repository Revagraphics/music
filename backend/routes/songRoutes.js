import express from "express";
import {
  getSongs,
  getAdminSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/songController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/admin/all", adminAuth, getAdminSongs);
router.get("/:id", getSong);

router.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createSong
);
router.put("/:id", adminAuth, updateSong);
router.delete("/:id", adminAuth, deleteSong);

export default router;
