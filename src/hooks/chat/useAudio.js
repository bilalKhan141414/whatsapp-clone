/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

export const useAudio = () => {
  const [startRecording, setStartRecording] = useState(false);
  const toggleRecording = async (e) => {
    setStartRecording(!startRecording);
  };

  const drawVisualizer = ({ analyser, visualizerRef }) => {
    requestAnimationFrame(drawVisualizer);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Updating the analyzer with the new
    // generated data visualization
    analyser.getByteFrequencyData(dataArray);
    const width = visualizerRef.width;
    const height = visualizerRef.height;
    const barWidth = 10;
    const canvasContext = visualizerRef.getContext("2d");
    canvasContext.clearRect(0, 0, width, height);
    let x = 0;
    dataArray.forEach((item, index, array) => {
      // This formula decides the height of the vertical
      // lines for every item in dataArray
      const y = (item / 255) * height * 1.1;
      canvasContext.strokeStyle = `blue`;

      // This decides the distances between the
      // vertical lines
      x = x + barWidth;
      canvasContext.beginPath();
      canvasContext.lineCap = "round";
      canvasContext.lineWidth = 2;
      canvasContext.moveTo(x, height);
      canvasContext.lineTo(x, height - y);
      canvasContext.stroke();
    });
  };
  return {
    startRecording,
    drawVisualizer,
    toggleRecording,
  };
};
