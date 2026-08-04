class MovableObject extends DrawableObject {
    speed = 2;
    currentImage = 0;

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveUp() {
        this.y -= this.speed;
    }

    moveDown() {
        this.y += this.speed;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    isColliding(mo) {
        return this.x + this.width - this.offsetRight > mo.x + mo.offsetLeft &&
            this.x + this.offsetLeft < mo.x + mo.width - mo.offsetRight &&
            this.y + this.height - this.offsetBottom > mo.y + mo.offsetTop &&
            this.y + this.offsetTop < mo.y + mo.height - mo.offsetBottom;
    }
}
