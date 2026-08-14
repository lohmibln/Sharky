class JellyFish extends MovableObject {
    width = 70;
    height = 100;
    speed;
    verticalSpeed;
    verticalDirection = 1;
    minY;
    maxY;
    offsetTop = 12;
    offsetBottom = 12;
    offsetLeft = 6;
    offsetRight = 6;
    isDying = false;
    deathFrame = 0;
    markedForRemoval = false;
    intervalIds = [];

    IMAGES_REGULAR = IMAGE_HUB.JELLYFISH.REGULAR;
    IMAGES_DANGEROUS = IMAGE_HUB.JELLYFISH.DANGEROUS;
    IMAGES_DEAD_REGULAR = IMAGE_HUB.JELLYFISH.DEAD_REGULAR;
    IMAGES_DEAD_DANGEROUS = IMAGE_HUB.JELLYFISH.DEAD_DANGEROUS;

    isDangerous;
    activeImages;
    deadImages;

    /**
     * Creates a jellyfish at a random position that bobs up and down as it swims.
     * @param {boolean} [isDangerous=false] - Whether this is the dangerous (red) variant.
     */
    constructor(isDangerous = false) {
        super();
        this.isDangerous = isDangerous;
        this.activeImages = isDangerous ? this.IMAGES_DANGEROUS : this.IMAGES_REGULAR;
        this.deadImages = isDangerous ? this.IMAGES_DEAD_DANGEROUS : this.IMAGES_DEAD_REGULAR;
        this.loadImage(this.activeImages[0]);
        this.loadImages(this.IMAGES_REGULAR);
        this.loadImages(this.IMAGES_DANGEROUS);
        this.loadImages(this.IMAGES_DEAD_REGULAR);
        this.loadImages(this.IMAGES_DEAD_DANGEROUS);
        this.x = 600 + Math.random() * 4000;
        this.y = 50 + Math.random() * 300;
        this.speed = 0.3 + Math.random() * 0.8;
        this.verticalSpeed = 0.5 + Math.random() * 1;
        this.minY = this.y - 40;
        this.maxY = this.y + 40;
        this.animate();
    }

    /** Starts the movement and animation loops. */
    animate() {
        this.intervalIds = [
            setInterval(() => this.updatePosition(), 1000 / 60),
            setInterval(() => this.updateAnimation(), 250)
        ];
    }

    /** Stops all of this enemy's timers (called when the level is torn down). */
    destroy() {
        this.intervalIds.forEach(id => clearInterval(id));
    }

    /** Moves left while bobbing vertically between minY and maxY. */
    updatePosition() {
        if (!gameStarted || this.isDying) return;
        this.moveLeft();
        this.y += this.verticalSpeed * this.verticalDirection;
        if (this.y <= this.minY || this.y >= this.maxY) {
            this.verticalDirection *= -1;
        }
    }

    /** Plays the swim animation normally, or the death animation while dying. */
    updateAnimation() {
        if (this.isDying) {
            this.playDeathAnimation();
        } else {
            this.playAnimation(this.activeImages);
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
        if (this.deathFrame >= this.deadImages.length) {
            this.markedForRemoval = true;
            return;
        }
        this.img = this.imageCache[this.deadImages[this.deathFrame]];
        this.deathFrame++;
    }
}
