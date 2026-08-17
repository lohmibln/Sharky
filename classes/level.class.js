class Level {
    enemies;
    backgroundObjects;
    coins;
    greenBubbles;
    levelEndX = 6480;

    /**
     * Holds the static content of one level.
     * @param {Array} enemies - Enemies placed in this level.
     * @param {Array} backgroundObjects - Parallax background tiles.
     * @param {Array} coins - Collectible coins.
     * @param {Array} greenBubbles - Collectible green bubbles that heal the character.
     */
    constructor(enemies, backgroundObjects, coins, greenBubbles) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.greenBubbles = greenBubbles;
    }
}
