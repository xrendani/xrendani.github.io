// Constants and state management
const JAMENDO_CLIENT_ID = '6ee5715e';
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';

class MoodifyPlayer {
    constructor() {
        this.currentTrack = null;
        this.playlist = [];
        this.isPlaying = false;
        this.currentTime = 0;
        this.volume = 0.7;
        this.shuffle = false;
        this.repeat = false;
        this.audio = new Audio();
        this.initializePlayer();
        this.loadInitialMood('relaxed'); // Load some initial music
    }

    async fetchFromJamendo(endpoint, params = {}) {
        const queryParams = new URLSearchParams({
            client_id: JAMENDO_CLIENT_ID,
            format: 'json',
            ...params
        });

        try {
            const response = await fetch(`${JAMENDO_API_URL}/${endpoint}?${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching from Jamendo:', error);
            this.showError('Failed to load music. Please try again later.');
            return null;
        }
    }

    showError(message) {
        // Create or update error message element
        let errorDiv = document.querySelector('.moodify-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'moodify-error';
            this.elements.trackList.parentElement.insertBefore(errorDiv, this.elements.trackList);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 5000);
    }

    initializePlayer() {
        // Initialize DOM elements
        this.elements = {
            playPauseBtn: document.querySelector('.player-pause-button'),
            stopBtn: document.querySelector('.stop-button'),
            prevBtn: document.querySelector('.previous-button'),
            nextBtn: document.querySelector('.next-button'),
            shuffleBtn: document.querySelector('.shuffle-button'),
            repeatBtn: document.querySelector('.repeat-button'),
            volumeSlider: document.querySelector('#volume-slider'),
            progressBar: document.querySelector('.progress'),
            progressContainer: document.querySelector('.progress-bar'),
            currentTimeSpan: document.querySelector('#current-time'),
            durationSpan: document.querySelector('#duration'),
            trackTitle: document.querySelector('#track-title'),
            trackArtist: document.querySelector('#track-artist'),
            albumName: document.querySelector('#album-name'),
            albumArt: document.querySelector('#album-art'),
            trackList: document.querySelector('#track-list-ul'),
            moodButtons: document.querySelectorAll('.mood-button')
        };

        this.bindEvents();
    }

    bindEvents() {
        // Player controls
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.elements.stopBtn.addEventListener('click', () => this.stop());
        this.elements.prevBtn.addEventListener('click', () => this.playPrevious());
        this.elements.nextBtn.addEventListener('click', () => this.playNext());
        this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.elements.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Volume control
        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        // Progress bar click handling
        this.elements.progressContainer.addEventListener('click', (e) => {
            const rect = this.elements.progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = pos * this.audio.duration;
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showError('Error playing track. Skipping to next...');
            this.playNext();
        });

        // Mood selection
        this.elements.moodButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.moodButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.loadMoodPlaylist(button.dataset.mood);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowRight') {
                this.playNext();
            } else if (e.code === 'ArrowLeft') {
                this.playPrevious();
            }
        });
    }

    async loadMoodPlaylist(mood) {
        const moodTags = {
            'happy': 'happy+upbeat+energetic',
            'relaxed': 'relaxing+calm+chill',
            'energetic': 'energetic+powerful+epic',
            'melancholic': 'sad+melancholic+emotional'
        };

        const params = {
            tags: moodTags[mood],
            limit: 20,
            include: 'musicinfo',
            boost: 'popularity_total',
            audioformat: 'mp32'
        };

        const data = await this.fetchFromJamendo('tracks/', params);
        
        if (data && data.results) {
            this.playlist = data.results;
            this.renderPlaylist();
            
            if (this.playlist.length > 0) {
                this.playTrack(0);
            }
        }
    }

    async loadInitialMood(mood) {
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Loading music...';
        loadingMessage.className = 'loading-message';
        this.elements.trackList.appendChild(loadingMessage);

        await this.loadMoodPlaylist(mood);
        loadingMessage.remove();
    }

    renderPlaylist() {
        this.elements.trackList.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'track-item';
            li.innerHTML = `
                <span class="track-number">${index + 1}</span>
                <span class="track-info">
                    <span class="track-name">${track.name}</span>
                    <span class="track-artist">${track.artist_name}</span>
                </span>
                <span class="track-duration">${this.formatTime(track.duration)}</span>
            `;
            
            if (index === this.currentTrack) {
                li.classList.add('playing');
            }
            
            li.addEventListener('click', () => this.playTrack(index));
            this.elements.trackList.appendChild(li);
        });
    }

    playTrack(index) {
        if (this.currentTrack !== null) {
            const currentItem = this.elements.trackList.children[this.currentTrack];
            if (currentItem) currentItem.classList.remove('playing');
        }

        this.currentTrack = index;
        const track = this.playlist[index];
        
        this.audio.src = track.audio;
        this.audio.volume = this.volume;
        this.audio.play().catch(error => {
            console.error('Error playing track:', error);
            this.showError('Error playing track. Please try another.');
        });
        
        this.isPlaying = true;
        
        // Update UI
        this.updateTrackInfo(track);
        this.updatePlayPauseButton();
        
        const newItem = this.elements.trackList.children[index];
        if (newItem) newItem.classList.add('playing');
    }

    // ... (rest of the methods remain the same as in the previous version)
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodifyPlayer = new MoodifyPlayer();
});
