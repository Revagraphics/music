import Song from "../models/Song.js";
import { uploadAudio, uploadImage } from "../config/cloudinary.js";

const songFields = "title artist album genre coverImage audioUrl duration isPublished createdAt updatedAt";

export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select(songFields);

    return res.status(200).json({ success: true, count: songs.length, songs });
  } catch (error) {
    console.error("Get Songs Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch songs" });
  }
};

export const getAdminSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }).select(songFields);
    return res.json({ success: true, count: songs.length, songs });
  } catch (error) {
    console.error("Get Admin Songs Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch admin songs" });
  }
};

export const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    return res.status(200).json({ success: true, song });
  } catch (error) {
    console.error("Get Song Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch song" });
  }
};

export const createSong = async (req, res) => {
  try {
    const { title, artist, album, genre, coverImage, audioUrl: bodyAudioUrl } = req.body;
    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.coverImage?.[0];

    const [uploadedAudio, uploadedCover] = await Promise.all([
      audioFile ? uploadAudio(audioFile.buffer) : null,
      coverFile ? uploadImage(coverFile.buffer) : null,
    ]);
    const audioUrl = uploadedAudio?.secure_url || bodyAudioUrl;
    const uploadedCoverImage = uploadedCover?.secure_url || coverImage;

    if (!title || !artist || !audioUrl) {
      return res.status(400).json({
        success: false,
        message: "Title, artist and an audio file or URL are required",
      });
    }

    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      coverImage: uploadedCoverImage,
      audioUrl,
    });

    return res.status(201).json({ success: true, message: "Song added successfully", song });
  } catch (error) {
    console.error("Create Song Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create song" });
  }
};

export const updateSong = async (req, res) => {
  try {
    const editableFields = ["title", "artist", "album", "genre", "coverImage", "audioUrl", "isPublished"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => editableFields.includes(field))
    );

    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.coverImage?.[0];
    const [uploadedAudio, uploadedCover] = await Promise.all([
      audioFile ? uploadAudio(audioFile.buffer) : null,
      coverFile ? uploadImage(coverFile.buffer) : null,
    ]);

    if (uploadedAudio) updates.audioUrl = uploadedAudio.secure_url;
    if (uploadedCover) updates.coverImage = uploadedCover.secure_url;

    const song = await Song.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    return res.status(200).json({ success: true, message: "Song updated successfully", song });
  } catch (error) {
    console.error("Update Song Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update song" });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    return res.status(200).json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    console.error("Delete Song Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete song" });
  }
};
