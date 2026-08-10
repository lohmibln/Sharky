let level1;

function createLevel1() {
    let enemies = createEnemies();
    let backgrounds = createBackgrounds();
    let coins = createCoins();
    level1 = new Level(enemies, backgrounds, coins);
}

function createEnemies() {
    let enemies = [];
    addPufferfish(enemies);
    addJellyfish(enemies);
    enemies.push(new EndBoss(6100));
    return enemies;
}

function addPufferfish(enemies) {
    let positions = spawnPositions(6, 400, 5800);
    positions.forEach(x => {
        let fish = new PufferFish();
        fish.x = x;
        enemies.push(fish);
    });
}

function addJellyfish(enemies) {
    let positions = spawnPositions(6, 400, 5800);
    let dangerFlags = shuffle([true, true, false, false, false, false]);
    positions.forEach((x, i) => {
        let jelly = new JellyFish(dangerFlags[i]);
        jelly.x = x;
        enemies.push(jelly);
    });
}

function spawnPositions(count, rangeStart, rangeEnd) {
    let positions = [];
    let segmentSize = (rangeEnd - rangeStart) / count;
    for (let i = 0; i < count; i++) {
        let segStart = rangeStart + i * segmentSize;
        positions.push(segStart + Math.random() * segmentSize);
    }
    return positions;
}

function shuffle(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
        let variant = i % 2 === 0 ? 0 : 1;
        objects.push(...backgroundLayersAt(i * segmentWidth, variant));
    }
    return objects;
}

function backgroundLayersAt(x, variant) {
    return [
        new BackgroundObject(IMAGE_HUB.BACKGROUND.WATER[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.FONDO2[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.FONDO1[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.FLOOR[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.LIGHT[variant], x)
    ];
}
