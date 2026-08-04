class Coin extends MovableObject {
    width = 50;
    height = 47;
    offsetTop = 2;
    offsetBottom = 2;
    offsetLeft = 2;
    offsetRight = 2;

    IMAGES_SPIN = [
        'img/coins/1.png',
        'img/coins/2.png',
        'img/coins/3.png',
        'img/coins/4.png'
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(this.IMAGES_SPIN[0]);
        this.loadImages(this.IMAGES_SPIN);
        this.animate();
    }

    animate() {
        setInterval(() => this.playAnimation(this.IMAGES_SPIN), 200);
    }
}
