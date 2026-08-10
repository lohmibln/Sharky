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

    IMAGES_IDLE = IMAGE_HUB.CHARACTER.IDLE;
    IMAGES_SWIM = IMAGE_HUB.CHARACTER.SWIM;
    IMAGES_LONG_IDLE = IMAGE_HUB.CHARACTER.LONG_IDLE;
    IMAGES_DEATH = IMAGE_HUB.CHARACTER.DEATH;
    IMAGES_HURT = IMAGE_HUB.CHARACTER.HURT;
    IMAGES_FINSLAP = IMAGE_HUB.CHARACTER.FINSLAP;
    IMAGES_BUBBLETRAP = IMAGE_HUB.CHARACTER.BUBBLETRAP;

    world;
    otherDirection = false;
    isAttacking = false;
    isFinSlapping = false;
    finSlapHasHit = false;
    isPlayingHurtAnim = false;
    attackImages = [];
    finSlapCooldown = 500;
    bubbleTrapCooldown = 600;
    lastFinSlap = 0;
    lastBubbleTrap = 0;
    maxHealth = 5;
    health = 5;
    hurtCooldown = 800;
    lastHit = 0;
    isDead = false;
    longIdleDelay = 5000;
    lastActivityTime = Date.now();
    intervalIds = [];

    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_FINSLAP);
        this.loadImages(this.IMAGES_BUBBLETRAP);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_DEATH);
        this.loadImages(this.IMAGES_HURT);
        this.animate();
    }

    animate() {
        this.intervalIds = [
            setInterval(() => this.handleMovement(), 1000 / 60),
            setInterval(() => this.handleAttacks(), 1000 / 60),
            setInterval(() => this.handleAnimation(), 100)
        ];
    }

    destroy() {
        this.intervalIds.forEach(id => clearInterval(id));
    }

    handleMovement() {
        if (!this.world || this.isDead) return;
        let kb = this.world.keyboard;
        this.checkGameStart(kb);
        this.applyKeyboardMovement(kb);
        this.clampPosition();
        this.world.cameraX = -this.x + 100;
    }

    checkGameStart(kb) {
        if (!gameStarted && (kb.RIGHT || kb.LEFT || kb.UP || kb.DOWN)) {
            gameStarted = true;
        }
    }

    applyKeyboardMovement(kb) {
        if (kb.RIGHT) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (kb.LEFT) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (kb.UP) this.moveUp();
        if (kb.DOWN) this.moveDown();
    }

    clampPosition() {
        if (this.y < 0) this.y = 0;
        if (this.y > 280) this.y = 280;
        if (this.x < 0) this.x = 0;
        let maxX = this.world.level.levelEndX - this.width;
        if (this.x > maxX) this.x = maxX;
    }

    handleAttacks() {
        if (!this.world || this.isAttacking || this.isDead) return;
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
        if (this.isDead) {
            this.playDeathAnimation();
            return;
        }
        if (this.isPlayingHurtAnim) {
            this.playHurtAnimation();
            return;
        }
        if (this.isAttacking) {
            this.playAttackAnimation();
            return;
        }
        this.playIdleOrSwim();
    }

    playIdleOrSwim() {
        let kb = this.world.keyboard;
        let isMoving = kb.RIGHT || kb.LEFT || kb.UP || kb.DOWN;
        if (isMoving) {
            this.lastActivityTime = Date.now();
            this.playAnimation(this.IMAGES_SWIM);
        } else if (Date.now() - this.lastActivityTime > this.longIdleDelay) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    playHurtAnimation() {
        if (this.currentImage >= this.IMAGES_HURT.length) {
            this.isPlayingHurtAnim = false;
            this.currentImage = 0;
            return;
        }
        this.img = this.imageCache[this.IMAGES_HURT[this.currentImage]];
        this.currentImage++;
    }

    playDeathAnimation() {
        if (this.currentImage >= this.IMAGES_DEATH.length) return;
        this.img = this.imageCache[this.IMAGES_DEATH[this.currentImage]];
        this.currentImage++;
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

    takeDamage(amount = 1) {
        if (this.isDead) return;
        let now = Date.now();
        if (now - this.lastHit < this.hurtCooldown) return;
        this.lastHit = now;
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        } else {
            this.isPlayingHurtAnim = true;
        }
        this.currentImage = 0;
    }
}
