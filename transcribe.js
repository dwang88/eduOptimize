// Import google cloud library by looking through path
const speech = require('@google-cloud/speech');
const fs = require('fs');
// Creates a client that allows us to connect to google's API
const client = new speech.SpeechClient();

async function quickstart() {
    // The path of the audio file
    const fileName = '/Users/mattlu/Desktop/harvard.wav';

    // Reads a local audio file and converts it to base64, which is a binary to 
    //text encoder (audio files are in binary)
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding 
    const audio = {
        content: audioBytes,
    };
    //use LINEAR 16 encoding 
    const config = {
        encoding: 'LINEAR16',
        languageCode: 'en-US',
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    //prints out the transcription 
    console.log(`Transcription: ${transcription}`);
}
//way to run the quickstart() method and catch errors if they arise
quickstart().catch(console.error);

/* attempt to try to allow longer transcriptions
const speech = require('@google-cloud/speech');
const fs = require('fs');
const client = new speech.SpeechClient();

async function transcribeSegment(filePath) {
  const file = fs.readFileSync(filePath);
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
  return response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
}

async function processSegments(directory) {
  const files = fs.readdirSync(directory);
  let fullTranscript = '';

  for (const file of files) {
    if (file.endsWith('.wav')) {
      const transcript = await transcribeSegment(`${directory}/${file}`);
      fullTranscript += transcript + ' ';
    }
  }

  console.log('Full Transcript:', fullTranscript);
}

// Replace '/path/to/segments' with the path to your directory containing the audio segments
processSegments('/Users/mattlu/Desktop/audio_split').catch(console.error);*/


