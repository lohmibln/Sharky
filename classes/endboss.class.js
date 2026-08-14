class EndBoss extends MovableObject {
    width = 270;
    height = 315;
    y = 100;
    speed = 1.4;
    stopDistance = 100;
    activationDistance = 800;
    isActive = false;
    otherDirection = false;
    world;
    maxHealth = 10;
    health = 10;
    isDefeated = false;

    offsetTop = 110;
    offsetBottom = 54;
    offsetLeft = 16;
    offsetRight = 19;

    IMAGES_FLOATING = IMAGE_HUB.BOSS.FLOATING;
    IMAGES_DEAD = IMAGE_HUB.BOSS.DEAD;

    deathFrame = 0;
    intervalIds = [];

    /**
     * Creates the end boss at a fixed position near the end of the level.
     * @param {number} x - World x-position where the boss waits.
     */
    constructor(x) {
        super();
        this.x = x;
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    /** Starts the chase and animation loops. */
    animate() {
        this.intervalIds = [
            setInterval(() => this.chaseCharacter(), 1000 / 60),
            setInterval(() => this.updateAnimation(), 150)
        ];
    }

    /** Stops all of the boss's timers (called when the level is torn down). */
    destroy() {
        this.intervalIds.forEach(id => clearInterval(id));
    }

    /** Plays the floating animation normally, or the death animation once defeated. */
    updateAnimation() {
        if (this.isDefeated) {
            this.playDeathAnimation();
        } else {
            this.playAnimation(this.IMAGES_FLOATING);
        }
    }

    /** Advances the death animation one frame, then holds on the last frame. */
    playDeathAnimation() {
        if (this.deathFrame >= this.IMAGES_DEAD.length) return;
        this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrame]];
        this.deathFrame++;
    }

    /**
     * Activates the boss once the character is close enough, then chases
     * and follows them horizontally and vertically until defeated.
     */
    chaseCharacter() {
        if (!this.world || this.isDefeated || !gameStarted) return;
        let distanceX = this.world.character.x - this.x;
        let distanceY = this.world.character.y - this.y;
        this.checkActivation(distanceX);
        if (!this.isActive) return;
        if (Math.abs(distanceX) > this.stopDistance) {
            this.moveTowardCharacter(distanceX);
        }
        this.followVertically(distanceY);
    }

    /**
     * Activates the boss fight once the character enters activation range.
     * @param {number} distanceX - Horizontal distance to the character.
     */
    checkActivation(distanceX) {
        if (Math.abs(distanceX) < this.activationDistance) {
            this.isActive = true;
            this.world.isBossFight = true;
        }
    }

    /**
     * Steps horizontally toward the character and faces the right direction.
     * @param {number} distance - Signed horizontal distance to the character.
     */
    moveTowardCharacter(distance) {
        this.x += distance > 0 ? this.speed : -this.speed;
        this.otherDirection = distance > 0;
    }

    /**
     * Tracks the character's vertical position, clamped so the boss stays on screen.
     * @param {number} distanceY - Signed vertical distance to the character.
     */
    followVertically(distanceY) {
        if (Math.abs(distanceY) < this.speed) {
            this.y = this.world.character.y;
        } else {
            this.y += distanceY > 0 ? this.speed : -this.speed;
        }
        if (this.y < 0) this.y = 0;
        if (this.y > 165) this.y = 165;
    }

    /**
     * Applies damage from an attack and marks the boss defeated at 0 HP.
     * @param {number} [amount=1] - How much health to remove.
     */
    takeDamage(amount = 1) {
        if (this.isDefeated) return;
        this.health -= amount;
        soundManager.play('DMG');
        if (this.health <= 0) {
            this.health = 0;
            this.isDefeated = true;
        }
    }
}
