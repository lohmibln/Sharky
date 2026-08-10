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

    constructor(x) {
        super();
        this.x = x;
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        this.intervalIds = [
            setInterval(() => this.chaseCharacter(), 1000 / 60),
            setInterval(() => this.updateAnimation(), 150)
        ];
    }

    destroy() {
        this.intervalIds.forEach(id => clearInterval(id));
    }

    updateAnimation() {
        if (this.isDefeated) {
            this.playDeathAnimation();
        } else {
            this.playAnimation(this.IMAGES_FLOATING);
        }
    }

    playDeathAnimation() {
        if (this.deathFrame >= this.IMAGES_DEAD.length) return;
        this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrame]];
        this.deathFrame++;
    }

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

    checkActivation(distanceX) {
        if (Math.abs(distanceX) < this.activationDistance) {
            this.isActive = true;
            this.world.isBossFight = true;
        }
    }

    moveTowardCharacter(distance) {
        this.x += distance > 0 ? this.speed : -this.speed;
        this.otherDirection = distance > 0;
    }

    followVertically(distanceY) {
        if (Math.abs(distanceY) < this.speed) {
            this.y = this.world.character.y;
        } else {
            this.y += distanceY > 0 ? this.speed : -this.speed;
        }
        if (this.y < 0) this.y = 0;
        if (this.y > 165) this.y = 165;
    }

    takeDamage(amount = 1) {
        if (this.isDefeated) return;
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDefeated = true;
        }
    }
}
