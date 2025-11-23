const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'neutral', 'excited'],
      set: (value) => {
       
        if (value === "calm") return "neutral";
        return value;
      }
    },
  }
);

module.exports = mongoose.model('Song', songSchema);
