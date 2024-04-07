"use client";

import React, { useState, useRef } from 'react';
import logo from "./logo.png";

export default function VideoTranscriptionPage() {
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [transcriptWords, setTranscriptWords] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);
  const recognitionRef = useRef(null); // Reference for recognition object
  const transcriptRef = useRef(null);

  const handleMicrophoneInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition; // Save recognition object in ref for access outside this function

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

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Set the selected file
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile); // Append the selected file to FormData

    // Make a POST request to your Node.js server to upload the file
    axios.post('/upload', formData)
      .then(response => {
        console.log(response.data); // Log the response from the server
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  const clearTranscript = () => {
    setTranscriptLines([]);
    setTranscriptWords([]);
    setFoundWords([]);
    setSelectedTimestamp(null);
  };

  const saveTranscript = () => {
    // Logic to save the transcript
    const transcriptText = transcriptLines.map(line => `${line.timestamp}: ${line.text}`).join('\n');
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(logo);
  };

  return (
    <>
      <div>
      <h1 style={{textAlign: "center"}}>
        Edu Optimize
      <img
        style={{ height: "55px", verticalAlign: "middle", marginLeft: "10px", marginTop: "0px"}}
        src={'https://media.discordapp.net/attachments/717217667500736534/1226666717913284628/logooo-removebg-preview.png?ex=66259967&is=66132467&hm=62491c3445b9789894fcf7a11482fecc069b8595c8cbe7252dfa3d07f6ff9cd6&=&format=webp&quality=lossless&width=1000&height=1000'}
        alt="Logo"
      />
      </h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', marginRight: '20px', marginTop: "30px" }}>
          <button onClick={handleMicrophoneInput}>Record Audio</button>
          <button onClick={stopRecording} style={{marginLeft: "20px"}}>Pause Recording</button>
          <button onClick={clearTranscript} style={{marginLeft: "20px"}}>Clear Transcript</button>
          <h2>Transcript:</h2>
          <div ref={transcriptRef} style={{backgroundColor: "white", color: "black", padding: "20px"}}>
            {transcriptLines.map((line, index) => (
              <div key={index} className={line.timestamp === selectedTimestamp ? "highlighted-line" : ""}>
                <span>{line.timestamp}: </span>
                <span>{line.text}</span>
              </div>
            ))}
          {transcriptWords.length === 0 && (
              <p>Start recording for transcript.</p>
            )}
          </div>
          <button onClick={saveTranscript} style={{marginTop: "20px"}}>Save Transcript</button>
        </div>
        <div style={{ flex: '1', marginTop: "75px"}}>
          <h2>Search Transcript:</h2>
          <div>
            <input type="text" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div>
            {foundWords.length > 0 && (
              <div>
                <h3>Found Words:</h3>
                <div style={{backgroundColor: "white", color: "black", padding: "20px"}}>
                {foundWords.map((foundWord, index) => (
                  <p className="search" key={index} onClick={() => scrollToLine(foundWord.timestamp)} style={{cursor:'pointer'}}>
                    {foundWord.timestamp}: {foundWord.word}
                  </p>
                ))}
                </div>
              </div>
            )}
            {foundWords.length === 0 && (
              <p style={{backgroundColor: "white", color: "black", padding: "20px"}}>No matching words found.</p>
            )}
          </div>
          
        </div>
      </div>
      <div>
        <input type="file" onChange={handleFileChange} style={{marginTop: "40px"}} />
          <button onClick={handleUpload}>Upload</button>
      </div>
      <div>
      <h2 style={{marginTop: "20px"}}>Audio File to Text:</h2>
      <p> Transcription starting at 00:00: nanoengineering is
 engineering
 Systems and materials that drive their properties from having small size having sizes that are nanoscale dimensions in at least 1 axis so uh that could be the lengths with or or height that is
 less than or approximately equal to 100 nanometers now um that is
 a loose definition because there are some things that might be 101 nanometers that are still nanotechnology
 and sometimes you'll find things with Micron scale uh um
 characteristic sizes that are still kind of have effects of of size confinement
 so
Transcription starting at 00:59: Nano engineer
 i n g
 stuff that derives
 properties
 from
 size confinement
 I was going to write roughly but I already have a school squiggle here which means which means rough this is a loose loose definition
 so
Transcription starting at 01:58: uh so what is what are the characteristic scales of things um if I if I write
 here
 okay you can't see if I write here so I'll say about here
 everyone okay if I I'm not going to use this board I'll get into trouble
 okay cool
 0.1 nanometers
 1 time I went to a talk on Nano science and the uh the seminar speaker used the word
 nanometers
 instead of nanometers
 and it was my impression that they put the emphasis on the wrong saleable the nominative meter is nanometers all the same thing
 0.1 nanometers is an angstrom that's like a characteristic size diameter of a hydrogen atom
Transcription starting at 02:57: 1 nanometer is a large small molecule
 I'm not confused about the definition of large and small
 a small molecule is like an organic molecule like
 ibuprofen or acetaminophen small molecule but a particularly large
 small molecule
 say beta carotene
 beta carotene it's like
 305 carbon atoms or something like that and it's it's long it's a large
 small molecule
 10 nanometers is a large molecule
Transcription starting at 03:56: a large large molecule
 or a Macro Molecule
 Macro Molecule
 or a my cell
 Macro Molecule could be a protein or a polymer blob
 like a blob of polystyrene or acrylic uh acrylic polymer in a solution that would be have a characteristic size of 10 nanometers a my cell
 a cell
 is what is formed
 with soap and shampoo so you have these aily molecules there's a Charged end of the molecule in a greasy hydrocarbon uh tail
Transcription starting at 04:55: and the what they do is they assemble into these spheres called my cells that's solubilized the the dirt and then there's soluble they're soluble because the ionic groups on the surface of the sphere point out toward the water
 and then interior these hydrophobic uh hydrocarbon tails solubilize the dirt
 my cells are also useful for a lot of things like uh like drug delivery Nano particles which we'll talk about later in the course
 100 nanometers this could be like a virus particle
 very owns are usually
 some kind of repeating structure of uh nucleic acids like RNA but also proteins that arrange themselves into some kind of symmetric structure and they're actually like uh
Transcription starting at 05:54: particles
 1 Micron micrometer we never say micrometer it's always Micron is a bacterium
 single bacteria bacterium
 10 microns would be like a hair
 the diameter of a hair 10 microns is an especially
 uh is an especially
 thin uh hair so let's say this is a cat hair
 probably 10 to 50 microns is more typical
Transcription starting at 06:53: so nanoengineering um you'll it falls
 in between uh
 chemistry and Material Science
 and the behavior of nanoengineering
 can be like chemical engineering and bioengineering
 so uh so the so Nano structured materials tend to derive their properties from um from uh from properties that are rise from from physical principles often often Quantum principles but but Quantum or electrostatic phenomena and also the bonding and structure of atoms and molecules so physics and chemistry very important that Nano engineering then Material Science so this is the way that I think about it this is not the way that that UCSD taught me to Envision Nano engineering but this is this is kind of how I see it
Transcription starting at 07:52: physics kind of goes into chemistry
 goes into nanoengineering
 and then I'm going to draw 2-way arrows between
 chemical engineering and bioengineering I feel like I'm in a snow globe here
 and maybe Material Science is somewhere out here
Transcription starting at 08:51: are the distinctions
 so
 are you texting about nanoengineering
 the distinctions between these fields are not
 so uh so rigid there's actually a a Continuum between 1 field and another it's just the fact that you have to organize human groups like groups of Faculty into like 15 to 30 people otherwise there will be chaos
 so we call a department chemistry we call another department physics call another department nanoengineering but
 but it doesn't matter in the grand scheme of things these are skills that we tend to be that we tend to have uh but it's not
 this is chemical engineering this is nano engineering this is bioengineering
Transcription starting at 09:50: in the street
 in general you find that Engineers are are better with having interdisciplinary uh uh research programs and and uh and um uh uh uh
 the way that they organized their uh their Industries um then then physical scientists physical scientists tend to say that's not it's not chemistry that's not physics
 um but Engineers don't care whatever gets the job done is what we use right
 I can say that because my PhD is in chemistry so I'm I'm making fun of myself in a way
 who's heard of Richard Fineman
 Richard Fineman was a professor at Nobel laureates at Caltech who uh made a very famous speech called there's plenty of room at the bottom and uh and that that was in uh like the American
Transcription starting at 10:49: physical Society national meeting um 195059
 Fineman won the Nobel Prize for Quantum electrodynamics or something like that
 there's plenty
 of room
 at the bottom and what he did was he uh this this was considered the uh the Breakthrough point in nanotechnology do you wear it was identified by a world famous scientist as something that was uh that was acceptable to uh to study
Transcription starting at 11:48: and he made 2 challenges does anyone remember what the challenges were
 1 of the challenges yeah
 to write the to write an encyclopedia on the head of a pin
 1 25,000 of an inch um a size reduction
 so
 so the first 1 that just because of the historical um interest of this I'm going to write them down um make an electrical
 Reverse by the way the electrical motor is 164th of a of a cubic inch and then the reduction of the encyclopedia is 1 over 25,000 size reduction
Transcription starting at 12:47: electrical motor that is
 1 64 of a cubic inch
 and the page
 let's say the encyclopedia
 on a pin head
 which is equivalent to 1
 part in 25,000 size reduction
 these challenges have already fallen they fell in this order annoyingly this 1 fell within like a year because someone had super sharp tweezers
Transcription starting at 13:46: and they were really good with their hands and Fineman didn't make the challenge difficult enough
 so he had to pay out it was like a thousand dollars or something like that a a lot like which is like a billion dollars in 1959 because professors get paid that much
 and then number 2 the encyclopedia on a pin head somebody actually did this uh with Electron Beam lithography
 Electron Beam level and this is in the 80s and they called them up they said is your challenge still
 active they didn't write a whole encyclopedia but they did write a page of text with this level of size reduction
 um and what is Electron Beam lithography Electron Beam lithography is taking an electron beam from a hot tungsten filament and directing it with electromagnetic fields toward a uh toward a what's called a resist film which is a thin plastic film on a on a wafer what you do is you guide this electron
Transcription starting at 14:45: team into patterns on the wafer
 and then you etch the you dissolve all of the areas in the plastic film that were exposed by the Electron Beam
 and you can make structures in these plastic films these polymer films that are down to about um maybe 8 to 10 nanometer line widths which is pretty incredible and in fact that's how the first step in um in computer chip manufacturing is actually done by Evie lithography so what you do is you take your Electron Beam and you take this chrome mask which has this this this uh this ebam sensitive resist film on it almost like a photographic plate and you expose it to all your transistor your your your transistor design and your circuit patterns then you etch the chromium under it then you take that mask and then you do what's called photo lithography on a film that's uh that's sensitive to light and you project light
Transcription starting at 15:44: through this mask that you made by electrons being lithography and why don't you just make the whole and you do that 50 times
 to build up all the complexity of a microprocessor now why don't you just make the whole damn thing with Electron Beam lithography and the reason is because it's very slow
 so you just making 1 letter at a time it's a little faster than this pantomime but it's still slow
 but total lithography you just blanket expose the whole thing like click click click and they're done
 why is size confinement important
 I almost said why is size confinement important
Transcription starting at 16:43: for a number of reasons
 what color is gold gold
 what color is a gold Nano particle solution red
 orange
 what color is it is cadmium selenide
 like silverish
 what color cadmium selenide Nano particles
 any color of the rainbow
 those are quantum dots
 because the electron wave function
 or the the electron hole pair in a quantum dot are confined in such a way to only allow certain types of of of of um excitation energy into the quantum dot and to create an excitation and then what you're seeing um uh is is either due to absorption of the quantum dot or fluorescent
Transcription starting at 17:42: the quantum dot and I'll show you in the next couple days some examples of quantum dots and we'll turn the lights out and then I'll show the quantum dot under um elimination and it will be fluorescent and uh
 and it will be incredible
 trust me
 okay what are forces forces acting over
 small distances because something is so small things like Vanderbilt's Force everybody's heard of vanderbyl force become very very important
 so
 2 Nano particles will stick to each other by a Vanderbilt's force with very uh very tight uh binding takes it takes a significant Force to pull these materials apart by the way something I didn't mention on the syllabus was that my notes that I copy off of from my note into the board into your brain will be posted immediately after class for every class
Transcription starting at 18:41: so if you miss something don't worry about it um it will all be on the podcast and the notes and they will both be available within the day uh after uh after class Okay so
 forces acting on small particles and over small distances are really incredibly strong
 um
 and why why is that what are what are these forces
 forces acting over small distances
 for between
 small objects
 we have the Vanderbilts Force
Transcription starting at 19:40: 
which was of course named after professor
 Force
 and there are 3 kinds of vanderbyl force
 there is the dipole dipole interaction
 the dipole induced dipole interaction
 dispersion interaction
 and what are these well if you have dipoles
 which are just polar molecules where 1 side is more negatively charged on the other side of the molecules more positively charged and they're spinning around sometimes they will spin in such a way as
Transcription starting at 20:39: to align toward each other and that will be favorable because positive end of 1 dipole pointing toward the negative end of the other dipole is electrostatically favorable that lowers the electrostatic energy of the system and because of that favorability some orientations will be more favorable than others certainly some orientations will be more favorable than the reverse where you have positive and positive poles interacting with each other which will be energetically unfavorable so as a result the molecules will tend to be attracted to each other
 dipole induced dipole is when you have an oscillating uh a frilly rotating dipole interacting with a nearby molecule the molecule does not have to be polar but it could be polar and what it's doing is interacting with the electron cloud of the adjacent molecule and because you have this oscillating this this really rotating dipole that's creating an electric field
Transcription starting at 21:38: sometimes you'll transiently polarize the nearby molecule and shift its electron cloud in such a way to create a dipole using the uh the electron uh cloud and therefore the molecules will be drawn toward each other in the same way as with the dipole dipole interaction
 so these are both purely electrostatic
 interactions the dispersion force believe it or not is the most powerful of the of the 3 variables forces the dispersion force is has the electron clouds of 2 adjacent molecules they could be polar but they don't have to be
 and at any snapshot of time the electron which of course orbits in a perfectly circular path around the nucleus
 bear with me
Transcription starting at 22:37: sometimes the electron will be over here compared to the nucleus sometimes it will be over here now what does that do but create a dipole in 1 along 1 Axis or another that dipole induces a dipole in the adjacent molecule um in the electron cloud and then they're drawn together now if you have 2 polar molecules the permanent dipoles and the transient dipoles of the electron clouds are operating on the adjacent molecules simultaneously so all 3 of these things are happening at the same time in a polar molecule the dispersion interaction is a quantum mechanical in nature
 and electric static
 because the
 orbit of the electron about a nucleus is a quantum mechanical phenomena
Transcription starting at 23:36: in fact it it it it uses the the particle version of of of quantum mechanics where we have to Envision that the that there's actually a a discrete particle orbiting around the nucleus which uh which is how we describe the dispersion interaction named after Professor London
 okay so this is the
 um
 Okay so
 we use a lot of Nano scale materials in our everyday lives so who painted anything recently
 I guess that could be considered painting
 uh drank milk anything but skim milk
 um
 uh
 used sunblock
Transcription starting at 24:35: probably not in this weather but
 on an ordinary day in San Diego all of these things have nanoparticles in them
 sunblock titanium dioxide nanoparticles if everything and and um
 uh milk milk milk fat globules and um
 paint uh different types of either organic dye molecules or transition metal compounds or if in case of white paint um to tanium dioxide particles as well why do we even need sunscreen just get the white paint
 um because they absorb visible uh and uh and uh ultraviolet light
 why if if this is the only interaction
 then why don't they just why why why why do they remain suspended why isn't milk just sold to you as a big coagulated thing that you need to shake up every time
Transcription starting at 25:34: or uh or or or or paint I mean you do have to mix paint to some extent but there's not a big block of crap at the bottom that you have to resolve every time you want to paint something and the reason is because they're repulsive forces as well and the most famous of which
 is the electric double layer Force
 or the edl
 force
 it can exist in other media but typically we're talking about it in water this is why water is a halfway decent lubricant why you don't want to take a razor and
 shave your hair or your beard when it's totally dry because it's going to
 cut you up if there's uh and and
Transcription starting at 26:33: and and the reason that that water is important because services in ice all services ionized in the presence of water we'll talk about this in more detail but what happens when surfaces uh are ionized
 is that the counter ions
 form a diffuse double layer between surfaces in water and when you push these surfaces together this cloud of counter ions become compressed and they're freedom to move around as restricted by this spatial compression
 now why does the freedom to move around matter well because their number of available statistical microstates decreases which decreases the entropy which is bad
 so in order to increase the entropy there is
Transcription starting at 27:32: a repulsive force between surfaces that are charged that have the same charge and they have mobile counter ions
 incidentally this is why soap is slippery this is why you don't want to shave dry
 it's also why paint and milk and
 all those other Nano particles suspensions oo
 don't uh flock or coagulate
 my favorite uh surface tension
 over small
 distances
 to great effect
 surface tension creates something called capillary forces
Transcription starting at 28:31: what do you need to make a sand castle
 sand is a nano particles
 but they're almost Nano particles
 what do you need to make a sand castle 1 sand
 2
 water how much water
 a little bit
 can you make a dry sand castle know can you make a sand castle underwater
 no so why does
 water make sand want to stick to itself
 because of surface tension
 the way I organized the lecture
 made that a good thing to to say um okay so surface tension why would it be surface tension well
Transcription starting at 29:30: let's picture a surface gas
 liquid and let's picture a molecule so we know that molecules interact with each other by vandiril force and what they're really doing is they're lowering their electrostatic self energy
 so a molecule that has a dipole or even even 1 that doesn't have a dipole it can lower its electrostatic energy if it comes into contact with another molecule
 that it can uh that it can
 associate with
 because a dipole and a dipole even if it's an induced dipole want to uh want to come together
 so as a result
 you have a molecule in the liquid phase
 and it's these arrows represent interactions with all the neighbors its electrostatic self energy is going to be
Transcription starting at 30:29: lowered as a result of interacting with all of its neighbors
 thusly
 in contrast
 if you have a molecule at the surface
 surface you're missing some of these favorable interactions because it's interacting with are
 but there's not much
 are
 compared to the liquid
 so as a result this 1
 is unhappy
 so what is that do what it does is it means that in order to stretch out this liquid uh this liquid gas interface liquid air interface more molecules have to go to the surface which they don't want to do because they lose all of this favorable interaction
Transcription starting at 31:28: the bulk with the bulk water so as you stretch this out there's actually a restoring Force produced by the surface that serves to contract the surface and that's the origin of surface tension because the molecules of the water at the water air interface are the liquid air and liquid Vapor interface they have an unfavorable interaction
 so suppose you have 2 sand grains
 and this is a liquid
 you have these menus sky
 this meniscus that forms
 this is called a capillary Bridge
Transcription starting at 32:27: and there is a pressure
 that is produced called the leelas pressure
 that sucks
 outward the way I've drawn it and draws these 2 Solid Surfaces closer together
 and in the case of
 bubbles or droplets
 these are 2 contiguous phases this is a bubble or droplet
 there's a leelas pressure here too which is pointing always in the direction of the concave
Transcription starting at 33:26: interface so outward in the case of menisci inward in the case of Bubbles and droplets
 and the leelas pressure PL
 which is the pressure difference between inside and outside
 is 2 gamma
 over uh over r
 this is the
 difference
 between inside and outside
 gamma is the surface tension
 we're used to thinking about surface tension and terms of liquid water and air for the vapor that's around are but this could be any interfacial tension so
Transcription starting at 34:25: the interfacial tension between say oil and water which is really the same thing here like water would rather be interacting with itself and interacting with oil
 even if oil would rather be interacting with water than with oil which happens to be true
 yep
 I'm sorry
 so we will talk about this in more uh detail later on in the course but basically if this is a hydrophilic surface these are hydrophilic surfaces um or they uh they have a favorable interaction with the um with the liquid the edge here will want to
 the edge share will want to um
 uh to to approach more and more uh
Transcription starting at 35:24: solid surface to cover it up I hear a lot of um
 sounds like I'm out of time which I am so uh thank you very much um and we'll start there on Wednesday</p>
      </div>
    </>
  );
}
