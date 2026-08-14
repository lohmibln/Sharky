class SoundManager {
    sounds = {};
    muted = localStorage.getItem('sharkieMuted') === 'true';
    volume = 0.6;
    loaded = false;

    /**
     * Creates an Audio object for every entry in the audio hub. Deliberately
     * not called until the page's load event fires, so a slow connection
     * can't throw errors while the rest of the game is still loading.
     */
    loadAll() {
        Object.keys(AUDIO_HUB).forEach(key => this.loadSound(key));
        this.loaded = true;
    }

    /**
     * Creates and caches a single sound at the shared starting volume/mute state.
     * @param {string} key - Key from AUDIO_HUB identifying which sound to load.
     */
    loadSound(key) {
        let sound = new Audio(AUDIO_HUB[key]);
        sound.volume = this.volume;
        sound.muted = this.muted;
        sound.addEventListener('error', () => {});
        this.sounds[key] = sound;
    }

    /**
     * Plays a loaded sound from the start. Does nothing if sounds haven't
     * loaded yet or the key doesn't exist.
     * @param {string} key - Which sound to play.
     * @param {boolean} [loop=false] - Whether the sound should loop.
     */
    play(key, loop = false) {
        let sound = this.sounds[key];
        if (!this.loaded || !sound) return;
        sound.loop = loop;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    /**
     * Pauses a currently playing sound.
     * @param {string} key - Which sound to stop.
     */
    stop(key) {
        let sound = this.sounds[key];
        if (sound) sound.pause();
    }

    /**
     * Toggles mute for all sounds and persists the choice to localStorage.
     * @returns {boolean} The new muted state.
     */
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('sharkieMuted', this.muted);
        Object.values(this.sounds).forEach(sound => sound.muted = this.muted);
        return this.muted;
    }

    /**
     * Applies a new volume level to all loaded sounds.
     * @param {number} volume - Volume from 0 (silent) to 1 (full).
     */
    setVolume(volume) {
        this.volume = volume;
        Object.values(this.sounds).forEach(sound => sound.volume = volume);
    }
}
