const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const router = express.Router();

const localDb = require("../db/localDb");
localDb.initializeDB();

let SongModel = null;
try {
  SongModel = require("../models/songs.model");
} catch (err) {
  console.log("⚠️ MongoDB model not available. Using local DB + mock data.");
}

const upload = multer({ storage: multer.memoryStorage() });


router.use((req, res, next) => {
  if (req.query && req.query.mood === "calm") req.query.mood = "neutral";
  if (req.body && req.body.mood === "calm") req.body.mood = "neutral";
  next();
});


router.get("/songs", async (req, res) => {
  try {
    const { mood } = req.query || {};

    let songs = mood ? localDb.getSongsByMood(mood) : localDb.getAllSongs();

    if (songs?.length > 0) {
      return res.status(200).json({
        message: `✅ ${songs.length} songs found (Local DB)`,
        songs,
      });
    }

    if (SongModel) {
      try {
        songs = mood
          ? await SongModel.find({ mood })
          : await SongModel.find();

        if (songs?.length > 0) {
          return res.status(200).json({
            message: `✅ ${songs.length} songs found (MongoDB)`,
            songs,
          });
        }
      } catch (err) {
        console.log("⚠️ MongoDB error:", err.message);
      }
    }

    // No songs found in Local DB or MongoDB.
    // Return an empty list with a clear message instead of using mock data.
    return res.status(200).json({
      message: `⚠️ No songs found`,
      songs: [],
    });

  } catch (error) {
    console.error("❌ Error fetching songs:", error);
    res.status(500).json({ error: error.message });
  }
});


router.post("/songs", upload.single("audio"), async (req, res) => {
  try {
    const { title, artist, mood } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const uploaded = await uploadFile(req.file);

    let songData = {
      title,
      artist,
      mood: mood === "calm" ? "neutral" : mood, 
      audio: uploaded.url,
    };

    let song;


    try {
      song = localDb.addSong(songData);
      console.log("✅ Saved to Local DB:", song);
    } catch (err) {
      console.log("⚠️ Local DB save failed:", err.message);
    }

    if (!song && SongModel) {
      try {
        song = await SongModel.create(songData);
        console.log("✅ Saved to MongoDB:", song);
      } catch (err) {
        console.log("⚠️ MongoDB save failed:", err.message);
      }
    }

    if (song) {
      return res.status(201).json({
        message: "✅ Song created successfully",
        song,
      });
    }

    return res.status(201).json({
      message: "⚠️ Audio uploaded but metadata not saved",
      audio_url: uploaded.url,
    });

  } catch (error) {
    console.error("❌ Song Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
