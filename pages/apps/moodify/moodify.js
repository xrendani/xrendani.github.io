// File: moodify.js
import API from "../../../API.js";

// Initialize API with Spotify credentials
const api = new API("1ea4678f8cdf4141a8fd6ed6f0411cff", "a8fa287e25c74bd7a613b853b9d1818a");

// Mood mappings for Spotify recommendations
const moodMapping = {
  Happy: { seed_genres: "pop", target_energy: 0.8, target_valence: 0.9 },
  Calm: { seed_genres: "acoustic", target_energy: 0.3, target_valence: 0.5 },
  Energetic: { seed_genres: "dance", target_energy: 0.9, target_tempo: 140 },
};

let currentTracks = []; // Store current tracks
let currentTrackIndex = 0; // Track the index of the currently playing track
let audioPlayer = null; // HTML audio element

// Initialize the app
async function initMoodify() {
  await api.authenticateSpotify();
  console.log("Moodify initialized successfully!");
}

// Handle mood selection
async function handleMoodSelection(mood) {
  const attributes = moodMapping[mood];

  toggleLoading(true); // Show loading spinner
  const tracks = await api.getRecommendations(attributes);
  toggleLoading(false); // Hide loading spinner

  if (tracks.length === 0) {
    displayError("No tracks found for this mood. Please try another mood.");
    return;
  }

  currentTracks = tracks; // Save tracks globally
  currentTrackIndex = 0; // Reset the index
  displayTracks(tracks);
}

// Display the list of tracks
function displayTracks(tracks) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  tracks.forEach((track, index) => {
    const trackDiv = document.createElement("div");
    trackDiv.classList.add("track");
    trackDiv.dataset.index = index; // Save track index

    trackDiv.innerHTML = `
      <img src="${track.albumArt}" alt="${track.title}" class="album-art" />
      <div>
        <strong>${track.title}</strong> by ${track.artist}
      </div>
    `;

    trackDiv.addEventListener("click", () => playTrack(index)); // Add click event
    resultsDiv.appendChild(trackDiv);
  });

  // Automatically play the first track
  playTrack(0);
}

// Play a specific track
function playTrack(index) {
  if (!currentTracks[index]) return;

  currentTrackIndex = index;
  const track = currentTracks[index];

  // Highlight the currently playing track
  document.querySelectorAll(".track").forEach((el) => el.classList.remove("playing"));
  document.querySelector(`.track[data-index="${index}"]`).classList.add("playing");

  // Create or update the audio player
  if (!audioPlayer) {
    audioPlayer = new Audio();
    audioPlayer.addEventListener("ended", playNextTrack); // Play the next track when finished
  }

  audioPlayer.src = track.previewUrl; // Use Spotify preview URL
  audioPlayer.play();
}

// Play the next track
function playNextTrack() {
  if (currentTrackIndex < currentTracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  }
}

// Play the previous track
function playPreviousTrack() {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1);
  }
}

// Show or hide the loading spinner
function toggleLoading(show) {
  const loadingSpinner = document.getElementById("loading");
  loadingSpinner.style.display = show ? "block" : "none";
}

// Display an error message
function displayError(message) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p class="error">${message}</p>`;
}

// Add event listeners for mood buttons
document.querySelectorAll(".mood-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const mood = e.target.getAttribute("data-mood");
    handleMoodSelection(mood);
  });
});

// Add event listeners for player controls
document.getElementById("prev-btn").addEventListener("click", playPreviousTrack);
document.getElementById("next-btn").addEventListener("click", playNextTrack);

// Start the app
initMoodify();
