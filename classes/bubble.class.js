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

    /**
     * Creates a bubble projectile fired by the character.
     * @param {number} x - Starting world x-position.
     * @param {number} y - Starting world y-position.
     * @param {number} direction - Travel direction: 1 for right, -1 for left.
     */
    constructor(x, y, direction) {
        super();
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.spawnTime = Date.now();
        this.loadImage(IMAGE_HUB.BUBBLE);
        this.animate();
    }

    /** Starts the bubble's own update loop. */
    animate() {
        this.intervalId = setInterval(() => this.update(), 1000 / 60);
    }

    /**
     * Moves the bubble each frame: travels straight for travelDuration while
     * able to hit enemies, then drifts upward harmlessly until it's removed.
     */
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

    /** Checks for a collision with a live enemy and applies damage on hit. */
    checkHit() {
        let hit = this.world.level.enemies.find(enemy => !enemy.isDying && this.isColliding(enemy));
        if (!hit) return;
        this.remove();
        if (hit instanceof EndBoss) {
            hit.takeDamage(1);
        } else {
            hit.startDying();
        }
    }

    /** Marks the bubble for removal once it drifts off the visible camera area. */
    checkOutOfBounds() {
        let viewLeft = -this.world.cameraX - 100;
        let viewRight = -this.world.cameraX + this.world.canvas.width + 100;
        if (this.x < viewLeft || this.x > viewRight || this.y < -100) {
            this.remove();
        }
    }

    /** Flags the bubble for cleanup and stops its update loop. */
    remove() {
        this.markedForRemoval = true;
        clearInterval(this.intervalId);
    }
}
