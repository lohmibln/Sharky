class Level {
    enemies;
    backgroundObjects;
    coins;
    levelEndX = 6480;

    constructor(enemies, backgroundObjects, coins) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}
