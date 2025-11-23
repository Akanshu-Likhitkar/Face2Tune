const fs = require("fs");
const path = require("path");


// Use the songs DB located next to this file (backend/src/db/songs.db.json)
const dbPath = path.join(__dirname, "songs.db.json");


const initializeDB = () => {
  if (!fs.existsSync(dbPath)) {
    const initialData = { songs: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
};


const getAllSongs = () => {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    return data.songs || [];
  } catch (err) {
    console.error("❌ Error reading DB:", err);
    return [];
  }
};


const addSong = (songData) => {
  try {
   
    songData.mood = songData.mood === "calm" ? "neutral" : songData.mood;

    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    const newSong = {
      _id: Date.now().toString(),
      ...songData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.songs.push(newSong);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    return newSong;
  } catch (err) {
    console.error("❌ Error adding song:", err);
    return null;
  }
};

const getSongsByMood = (mood) => {
  try {
    const songs = getAllSongs();

  
    if (mood === "calm") {
      mood = "neutral";
    }

    return songs.filter((song) => song.mood === mood);
  } catch (err) {
    console.error("❌ Error fetching songs:", err);
    return [];
  }
};


const deleteSong = (id) => {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    data.songs = data.songs.filter((song) => song._id !== id);

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("❌ Error deleting song:", err);
    return false;
  }
};

module.exports = {
  initializeDB,
  addSong,
  getAllSongs,
  getSongsByMood,
  deleteSong,
};
