class MovableObject extends DrawableObject {
    speed = 2;
    currentImage = 0;

    /** Moves the object one step to the right. */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves the object one step to the left. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Moves the object one step up. */
    moveUp() {
        this.y -= this.speed;
    }

    /** Moves the object one step down. */
    moveDown() {
        this.y += this.speed;
    }

    /**
     * Advances a looping frame-based animation by one step.
     * @param {string[]} images - Ordered list of image paths making up the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Checks whether this object's hitbox (inset by its offsets) overlaps another's.
     * @param {MovableObject} mo - The other object to check against.
     * @returns {boolean} True if the two hitboxes overlap.
     */
    isColliding(mo) {
        return this.x + this.width - this.offsetRight > mo.x + mo.offsetLeft &&
            this.x + this.offsetLeft < mo.x + mo.width - mo.offsetRight &&
            this.y + this.height - this.offsetBottom > mo.y + mo.offsetTop &&
            this.y + this.offsetTop < mo.y + mo.height - mo.offsetBottom;
    }
}
