class Character extends MovableObject {
    x = 100;
    y = 180;
    width = 200;
    height = 200;
    speed = 4;
    offsetTop = 90;
    offsetBottom = 44;
    offsetLeft = 40;
    offsetRight = 40;
    isHurt = false;

    IMAGES_IDLE = [
        'img/sharkie/idle/1.png',
        'img/sharkie/idle/2.png',
        'img/sharkie/idle/3.png',
        'img/sharkie/idle/4.png',
        'img/sharkie/idle/5.png',
        'img/sharkie/idle/6.png',
        'img/sharkie/idle/7.png',
        'img/sharkie/idle/8.png',
        'img/sharkie/idle/9.png',
        'img/sharkie/idle/10.png',
        'img/sharkie/idle/11.png',
        'img/sharkie/idle/12.png',
        'img/sharkie/idle/13.png',
        'img/sharkie/idle/14.png',
        'img/sharkie/idle/15.png',
        'img/sharkie/idle/16.png',
        'img/sharkie/idle/17.png',
        'img/sharkie/idle/18.png'
    ];

    IMAGES_SWIM = [
        'img/sharkie/swim/1.png',
        'img/sharkie/swim/2.png',
        'img/sharkie/swim/3.png',
        'img/sharkie/swim/4.png',
        'img/sharkie/swim/5.png',
        'img/sharkie/swim/6.png'
    ];

    world;
    otherDirection = false;

    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SWIM);
        this.animate();
    }

    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimation(), 100);
    }

    handleMovement() {
        if (!this.world) return;
        let kb = this.world.keyboard;
        if (kb.RIGHT) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (kb.LEFT) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (kb.UP) {
            this.moveUp();
        }
        if (kb.DOWN) {
            this.moveDown();
        }
        this.clampPosition();
        this.world.cameraX = -this.x + 100;
    }

clampPosition() {
    if (this.y < 0) this.y = 0;
    if (this.y > 280) this.y = 280;
    if (this.x < 0) this.x = 0;
    let maxX = this.world.level.levelEndX - this.width;
    if (this.x > maxX) this.x = maxX;
}

    handleAnimation() {
        if (!this.world) return;
        let kb = this.world.keyboard;
        let isMoving = kb.RIGHT || kb.LEFT || kb.UP || kb.DOWN;
        if (isMoving) {
            this.playAnimation(this.IMAGES_SWIM);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }
}
