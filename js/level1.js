let level1;

function createLevel1() {
    let enemies = createEnemies();
    let backgrounds = createBackgrounds();
    let coins = createCoins();
    level1 = new Level(enemies, backgrounds, coins);
}

function createEnemies() {
    return [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
        new JellyFish(false),
        new JellyFish(false),
        new JellyFish(false),
        new JellyFish(true),
        new JellyFish(true),
        new EndBoss(6100)
    ];
}

function createCoins() {
    let coins = [];
    for (let i = 0; i < 20; i++) {
        let x = 400 + i * 300 + Math.random() * 150;
        let y = 80 + Math.random() * 300;
        coins.push(new Coin(x, y));
    }
    return coins;
}

function createBackgrounds() {
    let objects = [];
    let segmentWidth = 720;
    let segments = 10;
    for (let i = -1; i < segments; i++) {
        let x = i * segmentWidth;
        let variant = (i % 2 === 0) ? '1' : '2';
        objects.push(
            new BackgroundObject('img/background/water/' + variant + '.png', x),
            new BackgroundObject('img/background/fondo2/' + variant + '.png', x),
            new BackgroundObject('img/background/fondo1/' + variant + '.png', x),
            new BackgroundObject('img/background/floor/' + variant + '.png', x),
            new BackgroundObject('img/background/light/' + variant + '.png', x)
        );
    }
    return objects;
}
