class PufferFish extends MovableObject {
    width = 80;
    height = 65;
    speed;
    offsetTop = 5;
    offsetBottom = 18;
    offsetLeft = 3;
    offsetRight = 8;

    IMAGES_SWIM = [
        'img/enemies/pufferfish/swim/1.png',
        'img/enemies/pufferfish/swim/2.png',
        'img/enemies/pufferfish/swim/3.png',
        'img/enemies/pufferfish/swim/4.png',
        'img/enemies/pufferfish/swim/5.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);
        this.x = 500 + Math.random() * 4000;
        this.y = 50 + Math.random() * 350;
        this.speed = 0.5 + Math.random() * 1.5;
        this.animate();
    }

    animate() {
        setInterval(() => this.moveLeft(), 1000 / 60);
        setInterval(() => this.playAnimation(this.IMAGES_SWIM), 200);
    }
}
