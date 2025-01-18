let audioContext;
let audioSource;
let audioBuffer;
let tracks = [];

// Initialize audioContext
try {
    audioContext = new AudioContext();
} 
catch (e) {
    console.error('Error initializing audioContext:', e);
}

// Load music files
document.getElementById('music-file').addEventListener('change', (e) =>{
    const files = e.target.files;
    tracks = [];

    for (const file of files) {
        const reader = new FileReader();
        reader.onload = () => {
            audioContext.decodeAudioData(reader.result, (buffer) => {
             tracks.push(buffer);
                displayTracks();
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

// Display loaded tracks
function displayTracks() {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = '';

    for (let i = 0; i < tracks.length; i++) {
        const track = document.createElement('div');
        track.textContent = `Track ${i + 1}`;

        trackList.appendChild(track);
    }
}

// Play selected track
document.getElementById('play-button').addEventListener('click', () => {
    if (tracks.length > 0) {
        const selectedTrack = tracks[0];
        // Play first track, for now
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = selectedTrack;
        audioSource.connect(audioContext.destination);
        audioSource.start();
    }
});

// Pause playback
document.getElementById('pause-button').addEventListener('click', () => {
    if (audioSource) {
        audioSource.stop();

        audioSource.disconnect();
    }
});

// Initialize track list
const trackListUl = document.getElementById('track-list-ul');

// Populate track list
tracks.forEach((track, index) => {
    const trackLi = document.createElement('LI');
    track.textContent = `${track.title} by ${track.artist}`;
    trackListUl.appendChild(trackLi);
});