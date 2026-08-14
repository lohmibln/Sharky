class HealthBar extends DrawableObject {
    width = 150;
    height = 40;
    percentage = 100;
    folder;

    /**
     * Creates a reusable percentage-based health bar, backed by 6 pre-rendered
     * frames (0/20/40/60/80/100%) in the given folder.
     * @param {string} folder - Folder containing the 0/20/40/60/80/100.png frames.
     * @param {number} x - Screen x-position.
     * @param {number} y - Screen y-position.
     */
    constructor(folder = IMAGE_HUB.UI.HP_PLAYER_FOLDER, x = 20, y = 20) {
        super();
        this.folder = folder;
        this.x = x;
        this.y = y;
        this.IMAGES = [0, 20, 40, 60, 80, 100].map(step => this.folder + '/' + step + '.png');
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    /**
     * Updates the bar to show the nearest available frame for a given percentage.
     * @param {number} percentage - Current value as a percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.resolveImagePath()];
    }

    /**
     * Finds the image path for the frame closest to the current percentage.
     * @returns {string} Path to the closest matching frame.
     */
    resolveImagePath() {
        let steps = [0, 20, 40, 60, 80, 100];
        let closest = steps.reduce((a, b) =>
            Math.abs(b - this.percentage) <= Math.abs(a - this.percentage) ? b : a
        );
        return this.folder + '/' + closest + '.png';
    }
}
