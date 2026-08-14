function numberedPaths(folder, count) {
    let paths = [];
    for (let i = 1; i <= count; i++) {
        paths.push(folder + '/' + i + '.png');
    }
    return paths;
}

const IMAGE_HUB = {
    CHARACTER: {
        IDLE: numberedPaths('img/sharkie/idle', 18),
        SWIM: numberedPaths('img/sharkie/swim', 6),
        LONG_IDLE: numberedPaths('img/sharkie/long-idle', 14),
        DEATH: numberedPaths('img/sharkie/death', 12),
        HURT: numberedPaths('img/sharkie/hurt', 5),
        FINSLAP: numberedPaths('img/sharkie/attack/finslap', 8),
        BUBBLETRAP: numberedPaths('img/sharkie/attack/bubbletrap', 8)
    },
    PUFFERFISH: {
        SWIM: numberedPaths('img/enemies/pufferfish/swim', 5),
        DEAD: numberedPaths('img/enemies/pufferfish/dead', 4)
    },
    JELLYFISH: {
        REGULAR: numberedPaths('img/enemies/jellyfish/regular', 4),
        DANGEROUS: numberedPaths('img/enemies/jellyfish/dangerous', 4),
        DEAD_REGULAR: numberedPaths('img/enemies/jellyfish/dead-regular', 4),
        DEAD_DANGEROUS: numberedPaths('img/enemies/jellyfish/dead-dangerous', 4)
    },
    BOSS: {
        FLOATING: numberedPaths('img/enemies/boss/floating', 13),
        DEAD: numberedPaths('img/enemies/boss/dead', 6)
    },
    COIN: {
        SPIN: numberedPaths('img/coins', 4)
    },
    BUBBLE: 'img/bubble/bubble.png',
    BACKGROUND: {
        WATER: numberedPaths('img/background/water', 2),
        FONDO2: numberedPaths('img/background/fondo2', 2),
        FONDO1: numberedPaths('img/background/fondo1', 2),
        FLOOR: numberedPaths('img/background/floor', 2),
        LIGHT: numberedPaths('img/background/light', 2)
    },
    UI: {
        HP_PLAYER_FOLDER: 'img/ui/hp-player',
        HP_BOSS_FOLDER: 'img/ui/hp-boss',
        SCREENS: {
            PAGE_BACKGROUND: 'img/ui/screens/page-background.png',
            START_BUTTON: 'img/ui/screens/start-button.png',
            KEY_ARROWS: 'img/ui/screens/key-arrows.png',
            KEY_D: 'img/ui/screens/key-d.png',
            KEY_SPACE: 'img/ui/screens/key-space.png',
            GAME_OVER_TITLE: 'img/ui/screens/game-over-title.png',
            YOU_WIN: 'img/ui/screens/you-win.png',
            TRY_AGAIN_BUTTON: 'img/ui/screens/try-again-button.png',
            VOLUME_ON: 'img/ui/screens/volume-on.svg',
            VOLUME_OFF: 'img/ui/screens/volume-off.svg'
        }
    }
};
