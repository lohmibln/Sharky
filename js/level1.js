let level1;

function createLevel1() {
    let enemies = createEnemies();
    let backgrounds = createBackgrounds();
    let coins = createCoins();
    level1 = new Level(enemies, backgrounds, coins);
}

function createEnemies() {
    let enemies = [];
    let pufferPositions = spawnPositions(6, 400, 5800);
    pufferPositions.forEach(x => {
        let fish = new PufferFish();
        fish.x = x;
        enemies.push(fish);
    });
    let jellyPositions = spawnPositions(6, 400, 5800);
    let dangerFlags = shuffle([true, true, false, false, false, false]);
    jellyPositions.forEach((x, i) => {
        let jelly = new JellyFish(dangerFlags[i]);
        jelly.x = x;
        enemies.push(jelly);
    });
    enemies.push(new EndBoss(6100));
    return enemies;
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
