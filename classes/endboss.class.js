class EndBoss extends MovableObject {
    width = 270;
    height = 315;
    y = 100;
    speed = 0.4;
    stopDistance = 150;
    activationDistance = 800;  
    isActive = false;           
    otherDirection = false;
    world;

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

    constructor(x) {
        super();
        this.x = x;
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.animate();
    }

    animate() {
        setInterval(() => this.chaseCharacter(), 1000 / 60);
        setInterval(() => this.playAnimation(this.IMAGES_FLOATING), 150);
    }

    chaseCharacter() {
        if (!this.world) return;
        let distance = this.world.character.x - this.x;
        
        // Check if player is within activation range
        if (Math.abs(distance) < this.activationDistance) {
            this.isActive = true;
            // Also trigger the world's boss fight flag
            if (this.world) {
                this.world.isBossFight = true;
            }
        }
        
        // Only move if boss has been activated AND character is not at stop distance
        if (this.isActive && Math.abs(distance) > this.stopDistance) {
            this.moveTowardCharacter(distance);
        }
    }

    moveTowardCharacter(distance) {
        this.x += distance > 0 ? this.speed : -this.speed;
        this.otherDirection = distance > 0;
    }
}