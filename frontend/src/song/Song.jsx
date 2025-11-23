import React, { useState, useEffect, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import "./Song.css";

const Song = ({ mood }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setLoading(true);
        let url = "http://localhost:3000/songs";
        if (mood) url += `?mood=${mood}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch songs");

        const data = await response.json();
        setSongs(data.songs || data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [mood]);

  const handlePlayPause = (index) => {
    if (playingIndex === index) {
      audioRef.current.pause();
      setPlayingIndex(null);
    } else {
      audioRef.current.src = songs[index].audio;
      audioRef.current.play();
      setPlayingIndex(index);
    }
  };

  return (
    <div className="song-container">
      <h2 className="song-title">🎧 Your Mood Playlist</h2>

      {mood && (
        <p className="mood-tag">
          Based on your mood: <strong>{mood.toUpperCase()}</strong>
        </p>
      )}

      {loading && <p className="loading-text">🎵 Loading songs...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && songs.length === 0 && (
        <p className="no-songs">No songs found 😢</p>
      )}

      
      <audio ref={audioRef} style={{ display: "none" }} />

      {songs.map((song, index) => (
        <div
          key={index}
          onClick={() => handlePlayPause(index)}
          className={`song-card ${
            playingIndex === index ? "active-song" : ""
          }`}
        >
          <div className="song-info">
            <h3 className="song-name">{song.title}</h3>
            <p className="song-artist">{song.artist}</p>
          </div>

          <div className="song-icon">
            {playingIndex === index ? (
              <i className="ri-pause-circle-fill"></i>
            ) : (
              <i className="ri-play-circle-fill"></i>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Song;
