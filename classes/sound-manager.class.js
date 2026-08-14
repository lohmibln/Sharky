class SoundManager {
    sounds = {};
    muted = localStorage.getItem('sharkieMuted') === 'true';
    volume = 0.6;
    loaded = false;

    loadAll() {
        Object.keys(AUDIO_HUB).forEach(key => this.loadSound(key));
        this.loaded = true;
    }

    loadSound(key) {
        let sound = new Audio(AUDIO_HUB[key]);
        sound.volume = this.volume;
        sound.muted = this.muted;
        sound.addEventListener('error', () => {});
        this.sounds[key] = sound;
    }

    play(key, loop = false) {
        let sound = this.sounds[key];
        if (!this.loaded || !sound) return;
        sound.loop = loop;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    stop(key) {
        let sound = this.sounds[key];
        if (sound) sound.pause();
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('sharkieMuted', this.muted);
        Object.values(this.sounds).forEach(sound => sound.muted = this.muted);
        return this.muted;
    }

    setVolume(volume) {
        this.volume = volume;
        Object.values(this.sounds).forEach(sound => sound.volume = volume);
    }
}
