class Coin extends MovableObject {
    width = 50;
    height = 47;
    offsetTop = 2;
    offsetBottom = 2;
    offsetLeft = 2;
    offsetRight = 2;

    IMAGES_SPIN = IMAGE_HUB.COIN.SPIN;
    intervalId;

    /**
     * Creates a collectible spinning coin at a fixed position.
     * @param {number} x - World x-position.
     * @param {number} y - World y-position.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(this.IMAGES_SPIN[0]);
        this.loadImages(this.IMAGES_SPIN);
        this.animate();
    }

    /** Starts the looping spin animation. */
    animate() {
        this.intervalId = setInterval(() => this.playAnimation(this.IMAGES_SPIN), 200);
    }

    /** Stops the coin's animation timer (called when the level is torn down). */
    destroy() {
        clearInterval(this.intervalId);
    }
}
