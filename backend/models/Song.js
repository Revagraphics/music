import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    album: {
      type: String,
      trim: true,
      default: "",
    },

    genre: {
      type: String,
      trim: true,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema);

export default Song;