class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    coinsCollected = 0;
    greenBubblesCollected = 0;
    coinIcon = new Image();
    greenBubbleIcon = new Image();
    healthBar = new HealthBar();
    bossHealthBar = new HealthBar(IMAGE_HUB.UI.HP_BOSS_FOLDER, 550, 55);
    isBossFight = false;
    bubbles = [];
    gameEnded = false;
    stopped = false;

    /**
     * Creates the game world and starts the draw loop.
     * @param {HTMLCanvasElement} canvas - The canvas to render into.
     * @param {Keyboard} keyboard - The shared keyboard input state.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level1;
        this.character.world = this;
        this.coinIcon.src = IMAGE_HUB.COIN.SPIN[0];
        this.greenBubbleIcon.src = IMAGE_HUB.GREEN_BUBBLE;
        this.assignWorldToBoss();
        this.draw();
    }

    /** Gives the boss a reference back to this world so it can chase the character. */
    assignWorldToBoss() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof EndBoss) enemy.world = this;
        });
    }

    /** Stops the draw loop and every character/enemy/coin/bubble timer it owns. */
    destroy() {
        this.stopped = true;
        this.character.destroy();
        this.level.enemies.forEach(enemy => enemy.destroy());
        this.level.coins.forEach(coin => coin.destroy());
        this.bubbles.forEach(bubble => bubble.remove());
    }

    /** Renders one frame, checks collisions, then schedules the next frame. */
    draw() {
        if (this.stopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawBackgrounds();
        this.drawBubbles();
        this.drawCollectibles();
        this.drawEnemies();
        this.drawCharacter();
        this.ctx.restore();
        this.drawCounters();
        this.drawHealthBar();
        this.drawBossHealthBar();
        this.checkCollisions();
        requestAnimationFrame(() => this.draw());
    }

    /** Draws every parallax background tile. */
    drawBackgrounds() {
        this.level.backgroundObjects.forEach(bg => bg.draw(this.ctx));
    }

    /** Draws every active bubble projectile. */
    drawBubbles() {
        this.bubbles.forEach(bubble => bubble.draw(this.ctx));
    }

    /** Draws every remaining coin and green bubble. */
    drawCollectibles() {
        this.drawCoins();
        this.drawGreenBubbles();
    }

    /** Draws every remaining coin. */
    drawCoins() {
        this.level.coins.forEach(coin => coin.draw(this.ctx));
    }

    /** Draws every remaining green bubble. */
    drawGreenBubbles() {
        this.level.greenBubbles.forEach(bubble => bubble.draw(this.ctx));
    }

    /** Draws enemies, showing only the boss once the boss fight has started. */
    drawEnemies() {
        let enemiesToDraw = this.isBossFight
            ? this.level.enemies.filter(enemy => enemy instanceof EndBoss)
            : this.level.enemies;

        enemiesToDraw.forEach(enemy => this.drawFlippable(enemy));
    }

    /** Draws the character, flipping it to face the right direction. */
    drawCharacter() {
        this.drawFlippable(this.character);
    }

    /**
     * Draws an object normally, or mirrored if it's currently facing left.
     * @param {MovableObject} movableObject - The object to draw.
     */
    drawFlippable(movableObject) {
        if (movableObject.otherDirection) {
            this.drawMirrored(movableObject);
        } else {
            movableObject.draw(this.ctx);
        }
    }

    /**
     * Draws an object horizontally mirrored in place.
     * @param {MovableObject} movableObject - The object to draw flipped.
     */
    drawMirrored(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.x + movableObject.width, movableObject.y);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(movableObject.img, 0, 0, movableObject.width, movableObject.height);
        this.ctx.restore();
    }

    /** Draws both HUD counters (coins and green bubbles). */
    drawCounters() {
        this.drawCoinCounter();
        this.drawGreenBubbleCounter();
    }

    /** Draws the coin counter fixed to the top-left of the canvas. */
    drawCoinCounter() {
        this.drawCounter(this.coinIcon, this.coinsCollected, 68);
    }

    /** Draws the green bubble counter just below the coin counter. */
    drawGreenBubbleCounter() {
        this.drawCounter(this.greenBubbleIcon, this.greenBubblesCollected, 100);
    }

    /**
     * Draws a small icon followed by a colon and a number, used for both the
     * coin and green bubble counters.
     * @param {HTMLImageElement} icon - Icon to draw next to the count.
     * @param {number} count - Current collected amount.
     * @param {number} y - Vertical position for this counter row.
     */
    drawCounter(icon, count, y) {
        this.ctx.drawImage(icon, 20, y, 24, 24);
        this.ctx.font = '20px "Luckiest Guy", sans-serif';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(': ' + count, 48, y + 20);
    }

    /** Updates and draws the player's health bar. */
    drawHealthBar() {
        this.healthBar.setPercentage(this.character.health / this.character.maxHealth * 100);
        this.healthBar.draw(this.ctx);
    }

    /** Updates and draws the boss's health bar, only during the boss fight. */
    drawBossHealthBar() {
        if (!this.isBossFight) return;
        let boss = this.level.enemies.find(enemy => enemy instanceof EndBoss);
        if (!boss) return;
        this.bossHealthBar.setPercentage(boss.health / boss.maxHealth * 100);
        this.bossHealthBar.draw(this.ctx);
    }

    /** Runs every per-frame collision, cleanup, and game-end check. */
    checkCollisions() {
        this.character.isHurt = this.isTouchingHarmfulEnemy();
        if (this.character.isHurt) {
            this.character.takeDamage(1);
        }
        this.checkCoinCollection();
        this.checkGreenBubbleCollection();
        this.checkMeleeHits();
        this.cleanupBubbles();
        this.cleanupDeadEnemies();
        this.checkGameEnd();
    }

    /**
     * Checks whether the character is currently touching an enemy that can hurt them.
     * @returns {boolean} True if a harmful enemy is currently overlapping the character.
     */
    isTouchingHarmfulEnemy() {
        let enemiesToCheck = this.isBossFight
            ? this.level.enemies.filter(enemy => enemy instanceof EndBoss)
            : this.level.enemies;
        let harmfulEnemies = enemiesToCheck.filter(enemy =>
            !(enemy instanceof EndBoss && enemy.isDefeated) && !enemy.isDying
        );
        return harmfulEnemies.some(enemy => this.character.isColliding(enemy));
    }

    /** Shows the win or lose screen once the character's death animation or the boss's finishes. */
    checkGameEnd() {
        if (this.gameEnded) return;
        if (this.character.isDead && this.character.currentImage >= this.character.IMAGES_DEATH.length) {
            this.gameEnded = true;
            showEndScreen(false);
            return;
        }
        let boss = this.level.enemies.find(enemy => enemy instanceof EndBoss);
        if (boss && boss.isDefeated && boss.deathFrame >= boss.IMAGES_DEAD.length) {
            this.gameEnded = true;
            showEndScreen(true);
        }
    }

    /** Removes coins the character is touching and adds them to the coin count. */
    checkCoinCollection() {
        let remaining = this.level.coins.filter(coin => !this.character.isColliding(coin));
        this.coinsCollected += this.level.coins.length - remaining.length;
        this.level.coins = remaining;
    }

    /**
     * Removes green bubbles the character is touching, adds them to the count,
     * and heals the character 10% of their max health per bubble collected.
     */
    checkGreenBubbleCollection() {
        let remaining = this.level.greenBubbles.filter(bubble => !this.character.isColliding(bubble));
        let collected = this.level.greenBubbles.length - remaining.length;
        this.greenBubblesCollected += collected;
        this.character.heal(collected * this.character.maxHealth * 0.1);
        this.level.greenBubbles = remaining;
    }

    /** Applies fin slap damage once per swing to any enemy the character is touching. */
    checkMeleeHits() {
        if (!this.character.isFinSlapping || this.character.finSlapHasHit) return;
        let hits = this.level.enemies.filter(enemy => !enemy.isDying && this.character.isColliding(enemy));
        if (!hits.length) return;
        this.character.finSlapHasHit = true;
        hits.forEach(enemy => {
            if (enemy instanceof EndBoss) {
                enemy.takeDamage(1);
            } else {
                enemy.startDying();
            }
        });
    }

    /** Removes bubbles that have hit something or left the visible area. */
    cleanupBubbles() {
        this.bubbles = this.bubbles.filter(bubble => !bubble.markedForRemoval);
    }

    /** Removes enemies whose death animation has finished playing. */
    cleanupDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.markedForRemoval);
    }
}
