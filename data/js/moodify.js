// Constants and state management
const JAMENDO_API_KEY = 'YOUR_JAMENDO_API_KEY'; // Replace with actual API key
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

        // Progress bar
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());

        // Mood selection
        this.elements.moodButtons.forEach(button => {
            button.addEventListener('click', () => this.loadMoodPlaylist(button.dataset.mood));
        });
    }

    async loadMoodPlaylist(mood) {
        try {
            // Map moods to tags for API query
            const moodTags = {
                'happy': 'happy+upbeat',
                'relaxed': 'relaxing+calm',
                'energetic': 'energetic+powerful',
                'melancholic': 'sad+melancholic'
            };

            const response = await fetch(
                `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=20&tags=${moodTags[mood]}&include=musicinfo`
            );
            
            const data = await response.json();
            this.playlist = data.results;
            this.renderPlaylist();
            
            if (this.playlist.length > 0) {
                this.playTrack(0);
            }
        } catch (error) {
            console.error('Error loading playlist:', error);
        }
    }

    renderPlaylist() {
        this.elements.trackList.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${track.artist_name} - ${track.name}`;
            li.addEventListener('click', () => this.playTrack(index));
            this.elements.trackList.appendChild(li);
        });
    }

    playTrack(index) {
        this.currentTrack = index;
        const track = this.playlist[index];
        
        this.audio.src = track.audio;
        this.audio.volume = this.volume;
        this.audio.play();
        this.isPlaying = true;
        
        // Update UI
        this.updateTrackInfo(track);
        this.updatePlayPauseButton();
    }

    updateTrackInfo(track) {
        this.elements.trackTitle.textContent = track.name;
        this.elements.trackArtist.textContent = track.artist_name;
        this.elements.albumName.textContent = track.album_name;
        this.elements.albumArt.src = track.image || '/data/images/default-album-art.png';
    }

    togglePlay() {
        if (!this.audio.src) return;
        
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        const icon = this.elements.playPauseBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }

    playNext() {
        if (this.playlist.length === 0) return;
        
        let nextTrack;
        if (this.shuffle) {
            nextTrack = Math.floor(Math.random() * this.playlist.length);
        } else {
            nextTrack = (this.currentTrack + 1) % this.playlist.length;
        }
        
        this.playTrack(nextTrack);
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        
        let prevTrack;
        if (this.shuffle) {
            prevTrack = Math.floor(Math.random() * this.playlist.length);
        } else {
            prevTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        }
        
        this.playTrack(prevTrack);
    }

    toggleShuffle() {
        this.shuffle = !this.shuffle;
        this.elements.shuffleBtn.classList.toggle('active');
    }

    toggleRepeat() {
        this.repeat = !this.repeat;
        this.elements.repeatBtn.classList.toggle('active');
    }

    setVolume(value) {
        this.volume = value;
        this.audio.volume = value;
    }

    updateProgress() {
        const duration = this.audio.duration;
        const currentTime = this.audio.currentTime;
        const progress = (currentTime / duration) * 100;
        
        this.elements.progressBar.style.width = `${progress}%`;
        this.elements.currentTimeSpan.textContent = this.formatTime(currentTime);
        this.elements.durationSpan.textContent = this.formatTime(duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    handleTrackEnd() {
        if (this.repeat) {
            this.playTrack(this.currentTrack);
        } else {
            this.playNext();
        }
    }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodifyPlayer = new MoodifyPlayer();
});
