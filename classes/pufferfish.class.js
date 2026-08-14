class PufferFish extends MovableObject {
    width = 80;
    height = 65;
    speed;
    offsetTop = 5;
    offsetBottom = 18;
    offsetLeft = 3;
    offsetRight = 8;
    isDying = false;
    deathFrame = 0;
    markedForRemoval = false;
    intervalIds = [];

    IMAGES_SWIM = IMAGE_HUB.PUFFERFISH.SWIM;
    IMAGES_DEAD = IMAGE_HUB.PUFFERFISH.DEAD;

    /** Creates a pufferfish at a random position with a random swim speed. */
    constructor() {
        super();
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 500 + Math.random() * 4000;
        this.y = 50 + Math.random() * 350;
        this.speed = 0.5 + Math.random() * 1.5;
        this.animate();
    }

    /** Starts the movement and animation loops. */
    animate() {
        this.intervalIds = [
            setInterval(() => { if (gameStarted && !this.isDying) this.moveLeft(); }, 1000 / 60),
            setInterval(() => this.updateAnimation(), 200)
        ];
    }

    /** Stops all of this enemy's timers (called when the level is torn down). */
    destroy() {
        this.intervalIds.forEach(id => clearInterval(id));
    }

    /** Plays the swim animation normally, or the death animation while dying. */
    updateAnimation() {
        if (this.isDying) {
            this.playDeathAnimation();
        } else {
            this.playAnimation(this.IMAGES_SWIM);
        }
    }

    /** Begins the one-shot death sequence after being hit. */
    startDying() {
        if (this.isDying) return;
        this.isDying = true;
        this.deathFrame = 0;
        soundManager.play('DMG');
    }

    /** Advances the death animation one frame, then marks for removal once finished. */
    playDeathAnimation() {
        if (this.deathFrame >= this.IMAGES_DEAD.length) {
            this.markedForRemoval = true;
            return;
        }
        this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrame]];
        this.deathFrame++;
    }
}
