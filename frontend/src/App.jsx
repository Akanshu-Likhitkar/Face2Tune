
import React, { useState } from "react";
import FacialExpression from "./face/FacialExpression";
import Song from "./song/Song";

const App = () => {
  const [detectedMood, setDetectedMood] = useState(null);

  return (
    <>
      <FacialExpression onMoodDetected={setDetectedMood} />
      <Song mood={detectedMood} />
    </>
  );
};

export default App;
