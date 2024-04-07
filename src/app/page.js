"use client";

import { useState } from 'react';

export default function VideoTranscriptionPage() {
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [transcriptWords, setTranscriptWords] = useState([]);

  const handleMicrophoneInput = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const newTranscript = event.results[0][0].transcript;
      const timestamp = new Date().toLocaleTimeString(); 
      const newLine = { text: newTranscript, timestamp: timestamp };
      setTranscriptLines(prevLines => [...prevLines, newLine]);
      const words = newTranscript.split(' '); 
      setTranscriptWords(prevWords => [...prevWords, ...words]);
    };

    for (const word of transcriptWords) {
      console.log(word); 
    }

    recognition.start();
  };

  return (
    <>
      <div>
        <h1>Real Time Audio Input To Text</h1>
      </div>
      <div>
        <button onClick={handleMicrophoneInput}>Record</button>
        <h2>Transcript:</h2>
        <div>
          {transcriptLines.map((line, index) => (
            <div key={index}>
              <span>{line.timestamp}: </span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
        <h2>Words:</h2>
        <div>
          {transcriptWords.map((word, index) => (
            <span key={index}>{word} </span>
          ))}
        </div>
      </div>
    </>
  );
}

