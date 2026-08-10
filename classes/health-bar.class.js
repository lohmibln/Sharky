class HealthBar extends DrawableObject {
    width = 150;
    height = 40;
    percentage = 100;
    folder;

    constructor(folder = IMAGE_HUB.UI.HP_PLAYER_FOLDER, x = 20, y = 20) {
        super();
        this.folder = folder;
        this.x = x;
        this.y = y;
        this.IMAGES = [0, 20, 40, 60, 80, 100].map(step => this.folder + '/' + step + '.png');
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.resolveImagePath()];
    }

    resolveImagePath() {
        let steps = [0, 20, 40, 60, 80, 100];
        let closest = steps.reduce((a, b) =>
            Math.abs(b - this.percentage) <= Math.abs(a - this.percentage) ? b : a
        );
        return this.folder + '/' + closest + '.png';
    }
}
