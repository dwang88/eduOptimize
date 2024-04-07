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
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const newTranscript = event.results[i][0].transcript;
        const timestamp = new Date().toLocaleTimeString(); // Get current timestamp
        const newLine = { text: newTranscript, timestamp: timestamp };
        setTranscriptLines(prevLines => [...prevLines, newLine]);
        const words = newTranscript.split(' ').map(word => ({ word, timestamp })); // Add timestamp to each word
        setTranscriptWords(prevWords => [...prevWords, ...words]); // Add words to transcriptWords array
      }
    };

    recognition.start();
  };

  const handleSearch = () => {
    const found = transcriptWords.filter(wordObj => wordObj.word.toLowerCase() === searchWord.toLowerCase());
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
        <h2>Search Transcript:</h2>
        <div>
          <input type="text" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div>
          {foundWords.length > 0 && (
            <div>
              <h3>Found Words:</h3>
              {foundWords.map((foundWord, index) => (
                <p key={index}>{foundWord.timestamp}: {foundWord.word}</p>
              ))}
            </div>
          )}
          {foundWords.length === 0 && (
            <p>No matching words found.</p>
          )}
        </div>
      </div>
    </>
  );
}
