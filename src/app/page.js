"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
const { createWorker } = dynamic(() => import('tesseract.js'), { ssr: false });

export default function VideoTranscriptionPage() {
  const [transcript, setTranscript] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    

    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(file);
    setTranscript(text);

    await worker.terminate();
  };

  return (
    <>
    <div>
      <h1>Upload a video</h1>
    </div><div>
        <input type="file" accept="video/*" onChange={handleFileUpload} />
        {transcript && (
          <div>
            <h2>Transcript</h2>
            <p>{transcript}</p>
          </div>
        )}
      </div>
      </>
  );
}
