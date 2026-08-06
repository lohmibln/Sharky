class Bubble extends MovableObject {
    width = 40;
    height = 40;
    speed = 8;
    driftSpeed = 1.5;
    travelDuration = 1000;
    direction;
    world;
    spawnTime;
    intervalId;
    markedForRemoval = false;

    constructor(x, y, direction) {
        super();
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.spawnTime = Date.now();
        this.loadImage('img/bubble/bubble.png');
        this.animate();
    }

    animate() {
        this.intervalId = setInterval(() => this.update(), 1000 / 60);
    }

    update() {
        if (!this.world || this.markedForRemoval) return;
        let elapsed = Date.now() - this.spawnTime;
        if (elapsed < this.travelDuration) {
            this.x += this.speed * this.direction;
            this.checkHit();
        } else {
            this.y -= this.driftSpeed;
        }
        this.checkOutOfBounds();
    }

    checkHit() {
        let hit = this.world.level.enemies.find(enemy => this.isColliding(enemy));
        if (!hit) return;
        this.remove();
        if (hit instanceof EndBoss) {
            hit.takeDamage(1);
        } else {
            this.world.level.enemies = this.world.level.enemies.filter(enemy => enemy !== hit);
        }
    }

    checkOutOfBounds() {
        let viewLeft = -this.world.cameraX - 100;
        let viewRight = -this.world.cameraX + this.world.canvas.width + 100;
        if (this.x < viewLeft || this.x > viewRight || this.y < -100) {
            this.remove();
        }
    }

    remove() {
        this.markedForRemoval = true;
        clearInterval(this.intervalId);
    }
}
