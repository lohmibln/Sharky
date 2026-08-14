class Level {
    enemies;
    backgroundObjects;
    coins;
    levelEndX = 6480;

    /**
     * Holds the static content of one level.
     * @param {Array} enemies - Enemies placed in this level.
     * @param {Array} backgroundObjects - Parallax background tiles.
     * @param {Array} coins - Collectible coins.
     */
    constructor(enemies, backgroundObjects, coins) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}
