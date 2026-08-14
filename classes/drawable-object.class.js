class DrawableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    offsetTop = 0;
    offsetLeft = 0;
    offsetRight = 0;
    offsetBottom = 0;

    /**
     * Loads a single image and sets it as the object's current image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads a list of images into the image cache, keyed by their path.
     * @param {string[]} paths - Paths to the image files.
     */
    loadImages(paths) {
        paths.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object's current image onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
     */
    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
