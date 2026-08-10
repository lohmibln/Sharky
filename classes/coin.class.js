class Coin extends MovableObject {
    width = 50;
    height = 47;
    offsetTop = 2;
    offsetBottom = 2;
    offsetLeft = 2;
    offsetRight = 2;

    IMAGES_SPIN = IMAGE_HUB.COIN.SPIN;
    intervalId;

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(this.IMAGES_SPIN[0]);
        this.loadImages(this.IMAGES_SPIN);
        this.animate();
    }

    animate() {
        this.intervalId = setInterval(() => this.playAnimation(this.IMAGES_SPIN), 200);
    }

    destroy() {
        clearInterval(this.intervalId);
    }
}
