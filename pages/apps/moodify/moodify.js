// File: moodify.js
import API from "../../../assets/js/API.js";

// Initialize API with Spotify credentials
const api = new API("1ea4678f8cdf4141a8fd6ed6f0411cff", "a8fa287e25c74bd7a613b853b9d1818a");

// Mood mappings for Spotify recommendations
const moodMapping = {
  Happy: { seed_genres: "pop", target_energy: 0.8, target_valence: 0.9 },
  Calm: { seed_genres: "acoustic", target_energy: 0.3, target_valence: 0.5 },
  Energetic: { seed_genres: "dance", target_energy: 0.9, target_tempo: 140 },
};

// Initialize the app
async function initMoodify() {
  await api.authenticateSpotify();
}

// Show or hide the loading spinner
function toggleLoading(show) {
  const loadingSpinner = document.getElementById("loading");
  loadingSpinner.style.display = show ? "block" : "none";
}

// Handle mood selection
async function handleMoodSelection(mood) {
  const attributes = moodMapping[mood];

  toggleLoading(true); // Show loading spinner
  const tracks = await api.getRecommendations(attributes);
  toggleLoading(false); // Hide loading spinner

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (tracks.length === 0) {
    resultsDiv.innerHTML = `<p>No tracks found for the selected mood. Please try again.</p>`;
    return;
  }

  tracks.forEach((track) => {
    const trackDiv = document.createElement("div");
    trackDiv.classList.add("track");
    trackDiv.innerHTML = `<strong>${track.title}</strong> by ${track.artist}`;
    resultsDiv.appendChild(trackDiv);
  });
}

// Add event listeners for mood buttons
document.querySelectorAll(".mood-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const mood = e.target.getAttribute("data-mood");
    handleMoodSelection(mood);
  });
});

// Start the app
initMoodify();
