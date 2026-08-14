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

    /** Creates the player character and preloads every animation set it uses. */
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

    /** Starts the movement, attack-input, and animation loops. */
    animate() {
        this.intervalIds = [
            setInterval(() => this.handleMovement(), 1000 / 60),
            setInterval(() => this.handleAttacks(), 1000 / 60),
            setInterval(() => this.handleAnimation(), 100)
        ];
    }

    /** Stops all of the character's timers (called when the level is torn down). */
    destroy() {
        this.intervalIds.forEach(id => clearInterval(id));
    }

    /** Reads keyboard input and moves the character, unless dead or the game has ended. */
    handleMovement() {
        if (!this.world || this.isDead || this.world.gameEnded) return;
        let kb = this.world.keyboard;
        this.checkGameStart(kb);
        this.applyKeyboardMovement(kb);
        this.clampPosition();
        this.world.cameraX = -this.x + 100;
    }

    /**
     * Flags the very first movement input of the playthrough, which is what
     * releases enemies to start moving.
     * @param {Keyboard} kb - The shared keyboard input state.
     */
    checkGameStart(kb) {
        if (!gameStarted && (kb.RIGHT || kb.LEFT || kb.UP || kb.DOWN)) {
            gameStarted = true;
        }
    }

    /**
     * Applies movement for whichever directional keys are currently held.
     * @param {Keyboard} kb - The shared keyboard input state.
     */
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

    /** Keeps the character within the level's vertical and horizontal bounds. */
    clampPosition() {
        if (this.y < 0) this.y = 0;
        if (this.y > 280) this.y = 280;
        if (this.x < 0) this.x = 0;
        let maxX = this.world.level.levelEndX - this.width;
        if (this.x > maxX) this.x = maxX;
    }

    /** Checks attack key presses and starts an attack if its cooldown has passed. */
    handleAttacks() {
        if (!this.world || this.isAttacking || this.isDead || this.world.gameEnded) return;
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

    /** Begins the fin slap melee attack animation. */
    startFinSlap() {
        this.isAttacking = true;
        this.isFinSlapping = true;
        this.finSlapHasHit = false;
        this.attackImages = this.IMAGES_FINSLAP;
        this.currentImage = 0;
        soundManager.play('SLAP');
    }

    /** Begins the bubble trap cast animation and fires the projectile. */
    startBubbleTrap() {
        this.isAttacking = true;
        this.attackImages = this.IMAGES_BUBBLETRAP;
        this.currentImage = 0;
        this.shootBubble();
    }

    /** Spawns a bubble projectile in front of the character, facing the way they're looking. */
    shootBubble() {
        let direction = this.otherDirection ? -1 : 1;
        let x = this.otherDirection ? this.x : this.x + this.width;
        let y = this.y + this.height / 2;
        let bubble = new Bubble(x, y, direction);
        bubble.world = this.world;
        this.world.bubbles.push(bubble);
        soundManager.play('BUBBLE');
    }

    /** Picks which animation to play this frame, in priority order. */
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

    /** Plays swim, long-idle, or regular idle animation depending on recent input. */
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

    /** Plays the hurt animation once, then returns control to normal animation. */
    playHurtAnimation() {
        if (this.currentImage >= this.IMAGES_HURT.length) {
            this.isPlayingHurtAnim = false;
            this.currentImage = 0;
            return;
        }
        this.img = this.imageCache[this.IMAGES_HURT[this.currentImage]];
        this.currentImage++;
    }

    /** Plays the death animation once and freezes on the last frame. */
    playDeathAnimation() {
        if (this.currentImage >= this.IMAGES_DEATH.length) return;
        this.img = this.imageCache[this.IMAGES_DEATH[this.currentImage]];
        this.currentImage++;
    }

    /** Plays the current attack animation once, then returns to normal animation. */
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

    /**
     * Applies damage (respecting the hit cooldown) and triggers either the
     * hurt animation or death, depending on remaining health.
     * @param {number} [amount=1] - How much health to remove.
     */
    takeDamage(amount = 1) {
        if (this.isDead) return;
        let now = Date.now();
        if (now - this.lastHit < this.hurtCooldown) return;
        this.lastHit = now;
        this.health -= amount;
        soundManager.play('DMG');
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        } else {
            this.isPlayingHurtAnim = true;
        }
        this.currentImage = 0;
    }
}
