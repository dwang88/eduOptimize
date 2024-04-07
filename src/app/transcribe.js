const speech = require('@google-cloud/speech');
const fs = require('fs');
const client = new speech.SpeechClient();

async function quickstart() {
    const fileName = '/Users/mattlu/Desktop/harvard.wav';

    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');

    const audio = {
        content: audioBytes,
    };

    const config = {
        encoding: 'LINEAR16',
        languageCode: 'en-US',
    };
    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
}

quickstart().catch(console.error);
