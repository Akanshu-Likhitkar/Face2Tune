
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./FacialExpression.css";

export default function FacialExpression({ onMoodDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionInterval = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [currentExpression, setCurrentExpression] = useState("—");

 
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Model Load Error:", err);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam Error:", err);
      }
    };

    loadModels();
    startVideo();
  }, []);


  const startDetection = () => {
    if (!modelsLoaded) return;
    if (detecting) return;

    setDetecting(true);

    detectionInterval.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

    
      if (!video.videoWidth || !video.videoHeight) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!detections.length) {
        setCurrentExpression("No Face Detected");
        return;
      }

      const detection = detections[0];
      const expressions = detection.expressions;

    
      const maxExp = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      // Display labels (user-facing) and normalized keys (backend-facing)
      const displayMap = {
        happy: "Happy",
        sad: "Sad",
        angry: "Angry",
        neutral: "Neutral",
        surprised: "Surprised",
        fearful: "Fearful",
        disgusted: "Disgusted",
      };

      // Map detected expression to backend-expected mood keys
      const moodKeyMap = {
        happy: "happy",
        sad: "sad",
        angry: "angry",
        neutral: "neutral",
        surprised: "excited",
        fearful: "excited",
        disgusted: "excited",
      };

      const displayLabel = displayMap[maxExp] || "Calm";
      const moodKey = moodKeyMap[maxExp] || "neutral";

      setCurrentExpression(displayLabel);

      if (onMoodDetected) {
        onMoodDetected(moodKey);
      }
    }, 700); 
  };

  // cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    };
  }, []);


 
  const stopDetection = () => {
    clearInterval(detectionInterval.current);
    setDetecting(false);
  };

  return (
    <div className="fe-container">
      <div className="fe-video-wrapper">
        <video ref={videoRef} autoPlay muted className="fe-video" />
        <canvas ref={canvasRef} className="fe-canvas" />
      </div>

      <div className="fe-controls">
        <div className="fe-button-area">
          {!detecting ? (
            <button className="fe-btn start" onClick={startDetection}>
              Start Detection
            </button>
          ) : (
            <button className="fe-btn stop" onClick={stopDetection}>
              Stop Detection
            </button>
          )}
        </div>

        <div className="fe-expression-box">
          <h2>Current Expression:</h2>
          <p>{currentExpression}</p>
        </div>
      </div>
    </div>
  );
}
