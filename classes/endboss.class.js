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

    IMAGES_FLOATING = [
        'img/enemies/boss/floating/1.png',
        'img/enemies/boss/floating/2.png',
        'img/enemies/boss/floating/3.png',
        'img/enemies/boss/floating/4.png',
        'img/enemies/boss/floating/5.png',
        'img/enemies/boss/floating/6.png',
        'img/enemies/boss/floating/7.png',
        'img/enemies/boss/floating/8.png',
        'img/enemies/boss/floating/9.png',
        'img/enemies/boss/floating/10.png',
        'img/enemies/boss/floating/11.png',
        'img/enemies/boss/floating/12.png',
        'img/enemies/boss/floating/13.png'
    ];

    IMAGES_DEAD = [
        'img/enemies/boss/dead/1.png',
        'img/enemies/boss/dead/2.png',
        'img/enemies/boss/dead/3.png',
        'img/enemies/boss/dead/4.png',
        'img/enemies/boss/dead/5.png',
        'img/enemies/boss/dead/6.png'
    ];

    deathFrame = 0;

    constructor(x) {
        super();
        this.x = x;
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        setInterval(() => this.chaseCharacter(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 150);
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

        // Check if player is within activation range
        if (Math.abs(distanceX) < this.activationDistance) {
            this.isActive = true;
            // Also trigger the world's boss fight flag
            if (this.world) {
                this.world.isBossFight = true;
            }
        }

        if (this.isActive) {
            if (Math.abs(distanceX) > this.stopDistance) {
                this.moveTowardCharacter(distanceX);
            }
            this.followVertically(distanceY);
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