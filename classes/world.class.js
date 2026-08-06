class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    coinsCollected = 0;
    isBossFight = false;
    bubbles = [];

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

    draw() {
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
        // Filter enemies: only draw the boss during boss fight, all others otherwise
        let enemiesToDraw = this.isBossFight 
            ? this.level.enemies.filter(enemy => enemy instanceof EndBoss)
            : this.level.enemies;
        
        enemiesToDraw.forEach(enemy => this.drawFlippable(enemy));
    }

    drawCharacter() {
        this.drawFlippable(this.character);
        if (this.character.isHurt) this.drawHurtOverlay();
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

    drawHurtOverlay() {
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.character.x, this.character.y, this.character.width, this.character.height);
        this.ctx.restore();
    }

    drawCoinCounter() {
        this.ctx.font = '20px sans-serif';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Coins: ' + this.coinsCollected, 20, 30);
    }

    checkCollisions() {
        // During boss fight, only check collision with boss
        let enemiesToCheck = this.isBossFight
            ? this.level.enemies.filter(enemy => enemy instanceof EndBoss)
            : this.level.enemies;
        let harmfulEnemies = enemiesToCheck.filter(enemy => !(enemy instanceof EndBoss && enemy.isDefeated));

        this.character.isHurt = harmfulEnemies.some(enemy => this.character.isColliding(enemy));
        this.checkCoinCollection();
        this.checkMeleeHits();
        this.cleanupBubbles();
    }

    checkCoinCollection() {
        let remaining = this.level.coins.filter(coin => !this.character.isColliding(coin));
        this.coinsCollected += this.level.coins.length - remaining.length;
        this.level.coins = remaining;
    }

    checkMeleeHits() {
        if (!this.character.isFinSlapping || this.character.finSlapHasHit) return;
        let hits = this.level.enemies.filter(enemy => this.character.isColliding(enemy));
        if (!hits.length) return;
        this.character.finSlapHasHit = true;
        hits.forEach(enemy => {
            if (enemy instanceof EndBoss) enemy.takeDamage(1);
        });
        let toRemove = hits.filter(enemy => !(enemy instanceof EndBoss));
        if (toRemove.length) {
            this.level.enemies = this.level.enemies.filter(enemy => !toRemove.includes(enemy));
        }
    }

    cleanupBubbles() {
        this.bubbles = this.bubbles.filter(bubble => !bubble.markedForRemoval);
    }
}