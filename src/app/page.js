"use client";

import { useState } from 'react';

export default function VideoTranscriptionPage() {
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [transcriptWords, setTranscriptWords] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);

  const handleMicrophoneInput = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const newTranscript = event.results[0][0].transcript;
      const timestamp = new Date().toLocaleTimeString(); // Get current timestamp
      const newLine = { text: newTranscript, timestamp: timestamp };
      setTranscriptLines(prevLines => [...prevLines, newLine]);
      const words = newTranscript.split(' '); // Split transcript into words
      setTranscriptWords(prevWords => [...prevWords, ...words]); // Add words to transcriptWords array
    };

    recognition.start();
  };

  const handleSearch = () => {
    const found = transcriptWords.filter(word => word.toLowerCase() === searchWord.toLowerCase());
    setFoundWords(found);
  };

  return (
    <>
      <div>
        <h1 style={{textAlign: "center"}}>Real Time Audio Input To Text</h1>
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
        <div>
          <input type="text" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div>
          {foundWords.length > 0 && (
            <p>Found words: {foundWords.join(', ')}</p>
          )}
          {foundWords.length === 0 && (
            <p>No matching words found.</p>
          )}
        </div>
      </div>
    </>
  );
}

