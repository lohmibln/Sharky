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

    IMAGES_FINSLAP = [
        'img/sharkie/attack/finslap/1.png',
        'img/sharkie/attack/finslap/2.png',
        'img/sharkie/attack/finslap/3.png',
        'img/sharkie/attack/finslap/4.png',
        'img/sharkie/attack/finslap/5.png',
        'img/sharkie/attack/finslap/6.png',
        'img/sharkie/attack/finslap/7.png',
        'img/sharkie/attack/finslap/8.png'
    ];

    IMAGES_BUBBLETRAP = [
        'img/sharkie/attack/bubbletrap/1.png',
        'img/sharkie/attack/bubbletrap/2.png',
        'img/sharkie/attack/bubbletrap/3.png',
        'img/sharkie/attack/bubbletrap/4.png',
        'img/sharkie/attack/bubbletrap/5.png',
        'img/sharkie/attack/bubbletrap/6.png',
        'img/sharkie/attack/bubbletrap/7.png',
        'img/sharkie/attack/bubbletrap/8.png'
    ];

    world;
    otherDirection = false;
    isAttacking = false;
    isFinSlapping = false;
    finSlapHasHit = false;
    attackImages = [];
    finSlapCooldown = 500;
    bubbleTrapCooldown = 600;
    lastFinSlap = 0;
    lastBubbleTrap = 0;

    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_FINSLAP);
        this.loadImages(this.IMAGES_BUBBLETRAP);
        this.animate();
    }

    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAttacks(), 1000 / 60);
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

    handleAttacks() {
        if (!this.world || this.isAttacking) return;
        let kb = this.world.keyboard;
        let now = Date.now();
        if (kb.D && now - this.lastFinSlap > this.finSlapCooldown) {
            this.lastFinSlap = now;
            this.startFinSlap();
        } else if (kb.SPACE && now - this.lastBubbleTrap > this.bubbleTrapCooldown) {
            this.lastBubbleTrap = now;
            this.startBubbleTrap();
        }
    }

    startFinSlap() {
        this.isAttacking = true;
        this.isFinSlapping = true;
        this.finSlapHasHit = false;
        this.attackImages = this.IMAGES_FINSLAP;
        this.currentImage = 0;
    }

    startBubbleTrap() {
        this.isAttacking = true;
        this.attackImages = this.IMAGES_BUBBLETRAP;
        this.currentImage = 0;
        this.shootBubble();
    }

    shootBubble() {
        let direction = this.otherDirection ? -1 : 1;
        let x = this.otherDirection ? this.x : this.x + this.width;
        let y = this.y + this.height / 2;
        let bubble = new Bubble(x, y, direction);
        bubble.world = this.world;
        this.world.bubbles.push(bubble);
    }

    handleAnimation() {
        if (!this.world) return;
        if (this.isAttacking) {
            this.playAttackAnimation();
            return;
        }
        let kb = this.world.keyboard;
        let isMoving = kb.RIGHT || kb.LEFT || kb.UP || kb.DOWN;
        if (isMoving) {
            this.playAnimation(this.IMAGES_SWIM);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    playAttackAnimation() {
        if (this.currentImage >= this.attackImages.length) {
            this.isAttacking = false;
            this.isFinSlapping = false;
            this.currentImage = 0;
            return;
        }
        this.img = this.imageCache[this.attackImages[this.currentImage]];
        this.currentImage++;
    }
}
