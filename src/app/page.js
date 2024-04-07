"use client";

import { useState, useRef } from 'react';

export default function VideoTranscriptionPage() {
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [transcriptWords, setTranscriptWords] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);
  const transcriptRef = useRef(null);

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

  const scrollToLine = (timestamp) => {
    const lineIndex = transcriptLines.findIndex(line => line.timestamp === timestamp);
    if (lineIndex !== -1) {
      const lineElement = transcriptRef.current.children[lineIndex];
      if (lineElement) {
        setSelectedTimestamp(timestamp); // Highlight the selected line
        lineElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <div>
        <h1 style={{textAlign: "center"}}>Real Time Audio Input To Text</h1>
      </div>
      <div>
        <button onClick={handleMicrophoneInput}>Record</button>
        <h2>Transcript:</h2>
        <div ref={transcriptRef}>
          {transcriptLines.map((line, index) => (
            <div key={index} className={line.timestamp === selectedTimestamp ? "highlighted-line" : ""}>
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
                <p key={index} onClick={() => scrollToLine(foundWord.timestamp)} style={{cursor:'pointer'}}>
                  {foundWord.timestamp}: {foundWord.word}
                </p>
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
