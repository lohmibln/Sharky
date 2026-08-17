let level1;

/** Builds level 1's enemies, backgrounds, and coins into a fresh Level instance. */
function createLevel1() {
    let enemies = createEnemies();
    let backgrounds = createBackgrounds();
    let coins = createCoins();
    let greenBubbles = createGreenBubbles();
    level1 = new Level(enemies, backgrounds, coins, greenBubbles);
}

/**
 * Builds the full enemy list for the level: pufferfish, jellyfish, and the boss.
 * @returns {Array} All enemies for level 1.
 */
function createEnemies() {
    let enemies = [];
    addPufferfish(enemies);
    addJellyfish(enemies);
    enemies.push(new EndBoss(6100));
    return enemies;
}

/**
 * Creates and evenly spaces 6 pufferfish across the level.
 * @param {Array} enemies - Enemy list to push the new pufferfish into.
 */
function addPufferfish(enemies) {
    let positions = spawnPositions(6, 400, 5800);
    positions.forEach(x => {
        let fish = new PufferFish();
        fish.x = x;
        enemies.push(fish);
    });
}

/**
 * Creates and evenly spaces 6 jellyfish across the level, with 2 of them
 * randomly chosen to be the dangerous variant.
 * @param {Array} enemies - Enemy list to push the new jellyfish into.
 */
function addJellyfish(enemies) {
    let positions = spawnPositions(6, 400, 5800);
    let dangerFlags = shuffle([true, true, false, false, false, false]);
    positions.forEach((x, i) => {
        let jelly = new JellyFish(dangerFlags[i]);
        jelly.x = x;
        enemies.push(jelly);
    });
}

/**
 * Splits a range into equal segments and picks one random point inside each,
 * so spawn positions are spread out instead of clumping randomly.
 * @param {number} count - How many positions to generate.
 * @param {number} rangeStart - Start of the spawnable range.
 * @param {number} rangeEnd - End of the spawnable range.
 * @returns {number[]} One x-position per segment.
 */
function spawnPositions(count, rangeStart, rangeEnd) {
    let positions = [];
    let segmentSize = (rangeEnd - rangeStart) / count;
    for (let i = 0; i < count; i++) {
        let segStart = rangeStart + i * segmentSize;
        positions.push(segStart + Math.random() * segmentSize);
    }
    return positions;
}

/**
 * Returns a shuffled copy of an array (Fisher-Yates).
 * @param {Array} array - Array to shuffle.
 * @returns {Array} A new, randomly-ordered array.
 */
function shuffle(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Lays out 20 coins along the level with some random jitter.
 * @returns {Coin[]} All coins for level 1.
 */
function createCoins() {
    let coins = [];
    for (let i = 0; i < 20; i++) {
        let x = 400 + i * 300 + Math.random() * 150;
        let y = 80 + Math.random() * 300;
        coins.push(new Coin(x, y));
    }
    return coins;
}

/**
 * Lays out 10 collectible green bubbles along the level with some random jitter,
 * offset from the coin positions so the two don't just stack on top of each other.
 * @returns {GreenBubble[]} All green bubbles for level 1.
 */
function createGreenBubbles() {
    let greenBubbles = [];
    for (let i = 0; i < 10; i++) {
        let x = 550 + i * 600 + Math.random() * 150;
        let y = 80 + Math.random() * 300;
        greenBubbles.push(new GreenBubble(x, y));
    }
    return greenBubbles;
}

/**
 * Builds the full 5-layer parallax background across the whole level,
 * alternating between two tile variants so the repeat isn't obvious.
 * @returns {BackgroundObject[]} Every background tile for the level.
 */
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

/**
 * Builds the 5 stacked background layers (water/fondo2/fondo1/floor/light)
 * for one screen-width segment.
 * @param {number} x - World x-position for this segment.
 * @param {number} variant - Which tile variant (0 or 1) to use.
 * @returns {BackgroundObject[]} The 5 layers for this segment.
 */
function backgroundLayersAt(x, variant) {
    return [
        new BackgroundObject(IMAGE_HUB.BACKGROUND.WATER[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.FONDO2[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.FONDO1[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.FLOOR[variant], x),
        new BackgroundObject(IMAGE_HUB.BACKGROUND.LIGHT[variant], x)
    ];
}
