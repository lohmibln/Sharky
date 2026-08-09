class JellyFish extends MovableObject {
    width = 70;
    height = 100;
    speed;
    verticalSpeed;
    verticalDirection = 1;
    minY;
    maxY;
    offsetTop = 12;
    offsetBottom = 12;
    offsetLeft = 6;
    offsetRight = 6;

    IMAGES_REGULAR = [
        'img/enemies/jellyfish/regular/1.png',
        'img/enemies/jellyfish/regular/2.png',
        'img/enemies/jellyfish/regular/3.png',
        'img/enemies/jellyfish/regular/4.png'
    ];

    IMAGES_DANGEROUS = [
        'img/enemies/jellyfish/dangerous/1.png',
        'img/enemies/jellyfish/dangerous/2.png',
        'img/enemies/jellyfish/dangerous/3.png',
        'img/enemies/jellyfish/dangerous/4.png'
    ];

    isDangerous;
    activeImages;

    constructor(isDangerous = false) {
        super();
        this.isDangerous = isDangerous;
        this.activeImages = isDangerous ? this.IMAGES_DANGEROUS : this.IMAGES_REGULAR;
        this.loadImage(this.activeImages[0]);
        this.loadImages(this.IMAGES_REGULAR);
        this.loadImages(this.IMAGES_DANGEROUS);
        this.x = 600 + Math.random() * 4000;
        this.y = 50 + Math.random() * 300;
        this.speed = 0.3 + Math.random() * 0.8;
        this.verticalSpeed = 0.5 + Math.random() * 1;
        this.minY = this.y - 40;
        this.maxY = this.y + 40;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!gameStarted) return;
            this.moveLeft();
            this.y += this.verticalSpeed * this.verticalDirection;
            if (this.y <= this.minY || this.y >= this.maxY) {
                this.verticalDirection *= -1;
            }
        }, 1000 / 60);
        setInterval(() => this.playAnimation(this.activeImages), 250);
    }
}
