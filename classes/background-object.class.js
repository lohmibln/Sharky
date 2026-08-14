class BackgroundObject extends DrawableObject {
    width = 720;
    height = 480;

    /**
     * Creates one static full-screen background tile.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - World x-position where this tile should be placed.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 0;
    }
}
