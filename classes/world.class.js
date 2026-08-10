class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    coinsCollected = 0;
    healthBar = new HealthBar();
    bossHealthBar = new HealthBar(IMAGE_HUB.UI.HP_BOSS_FOLDER, 550, 20);
    isBossFight = false;
    bubbles = [];
    gameEnded = false;
    stopped = false;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level1;
        this.character.world = this;
        this.assignWorldToBoss();
        this.draw();
    }

    assignWorldToBoss() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof EndBoss) enemy.world = this;
        });
    }

    destroy() {
        this.stopped = true;
        this.character.destroy();
        this.level.enemies.forEach(enemy => enemy.destroy());
        this.level.coins.forEach(coin => coin.destroy());
        this.bubbles.forEach(bubble => bubble.remove());
    }

    draw() {
        if (this.stopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawBackgrounds();
        this.drawBubbles();
        this.drawCoins();
        this.drawEnemies();
        this.drawCharacter();
        this.ctx.restore();
        this.drawCoinCounter();
        this.drawHealthBar();
        this.drawBossHealthBar();
        this.checkCollisions();
        requestAnimationFrame(() => this.draw());
    }

    drawBackgrounds() {
        this.level.backgroundObjects.forEach(bg => bg.draw(this.ctx));
    }

    drawBubbles() {
        this.bubbles.forEach(bubble => bubble.draw(this.ctx));
    }

    drawCoins() {
        this.level.coins.forEach(coin => coin.draw(this.ctx));
    }

    drawEnemies() {
        let enemiesToDraw = this.isBossFight
            ? this.level.enemies.filter(enemy => enemy instanceof EndBoss)
            : this.level.enemies;

        enemiesToDraw.forEach(enemy => this.drawFlippable(enemy));
    }

    drawCharacter() {
        this.drawFlippable(this.character);
    }

    drawFlippable(movableObject) {
        if (movableObject.otherDirection) {
            this.drawMirrored(movableObject);
        } else {
            movableObject.draw(this.ctx);
        }
    }

    drawMirrored(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.x + movableObject.width, movableObject.y);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(movableObject.img, 0, 0, movableObject.width, movableObject.height);
        this.ctx.restore();
    }

    drawCoinCounter() {
        this.ctx.font = '20px "Luckiest Guy", sans-serif';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Coins: ' + this.coinsCollected, 20, 85);
    }

    drawHealthBar() {
        this.healthBar.setPercentage(this.character.health / this.character.maxHealth * 100);
        this.healthBar.draw(this.ctx);
    }

    drawBossHealthBar() {
        if (!this.isBossFight) return;
        let boss = this.level.enemies.find(enemy => enemy instanceof EndBoss);
        if (!boss) return;
        this.bossHealthBar.setPercentage(boss.health / boss.maxHealth * 100);
        this.bossHealthBar.draw(this.ctx);
    }

    checkCollisions() {
        this.character.isHurt = this.isTouchingHarmfulEnemy();
        if (this.character.isHurt) {
            this.character.takeDamage(1);
        }
        this.checkCoinCollection();
        this.checkMeleeHits();
        this.cleanupBubbles();
        this.cleanupDeadEnemies();
        this.checkGameEnd();
    }

    isTouchingHarmfulEnemy() {
        let enemiesToCheck = this.isBossFight
            ? this.level.enemies.filter(enemy => enemy instanceof EndBoss)
            : this.level.enemies;
        let harmfulEnemies = enemiesToCheck.filter(enemy =>
            !(enemy instanceof EndBoss && enemy.isDefeated) && !enemy.isDying
        );
        return harmfulEnemies.some(enemy => this.character.isColliding(enemy));
    }

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

    checkCoinCollection() {
        let remaining = this.level.coins.filter(coin => !this.character.isColliding(coin));
        this.coinsCollected += this.level.coins.length - remaining.length;
        this.level.coins = remaining;
    }

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

    cleanupBubbles() {
        this.bubbles = this.bubbles.filter(bubble => !bubble.markedForRemoval);
    }

    cleanupDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.markedForRemoval);
    }
}
