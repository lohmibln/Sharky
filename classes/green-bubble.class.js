class GreenBubble extends MovableObject {
    width = 40;
    height = 40;
    offsetTop = 2;
    offsetBottom = 2;
    offsetLeft = 2;
    offsetRight = 2;

    /**
     * Creates a collectible green bubble at a fixed position, which heals
     * the character a little when picked up.
     * @param {number} x - World x-position.
     * @param {number} y - World y-position.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(IMAGE_HUB.GREEN_BUBBLE);
    }
}
