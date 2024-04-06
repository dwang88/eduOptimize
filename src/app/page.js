"use client";

import { useState } from 'react';

export default function VideoTranscriptionPage() {
  const [transcript, setTranscript] = useState('');

  const handleMicrophoneInput = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const newTranscript = event.results[0][0].transcript;
      setTranscript(prevTranscript => prevTranscript + '<br>' + newTranscript);
    };

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
        {transcript && (
          <div>
            <p dangerouslySetInnerHTML={{ __html: transcript }}></p>
          </div>
        )}
      </div>
    </>
  );
}
