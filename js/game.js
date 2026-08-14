let canvas;
let world;
let keyboard = new Keyboard();
let soundManager = new SoundManager();
let gameStarted = false;

/** Creates a fresh level and World, and starts the background music. */
function init() {
    canvas = document.getElementById('canvas');
    createLevel1();
    world = new World(canvas, keyboard);
    document.getElementById('mobile-controls').classList.remove('hidden');
    soundManager.play('BG', true);
}

/** Tears down the current game and starts a brand new one, without reloading the page. */
function restartGame() {
    if (world) world.destroy();
    gameStarted = false;
    keyboard.reset();
    document.getElementById('end-screen').classList.add('hidden');
    init();
}

/** Tears down the current game and returns to the start screen. */
function backToMenu() {
    if (world) world.destroy();
    gameStarted = false;
    keyboard.reset();
    soundManager.stop('BG');
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
}

/**
 * Shows the win or lose screen and plays the matching sound, once the game has ended.
 * @param {boolean} won - True if the boss was defeated, false if the character died.
 */
function showEndScreen(won) {
    let endScreen = document.getElementById('end-screen');
    soundManager.stop('BG');
    soundManager.play(won ? 'VICTORY' : 'DEFEAT');
    if (won) {
        showWinScreen(endScreen);
    } else {
        showLoseScreen(endScreen);
    }
    endScreen.classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
}

/**
 * Displays the win screen's full confetti artwork.
 * @param {HTMLElement} endScreen - The end-screen container element.
 */
function showWinScreen(endScreen) {
    endScreen.style.backgroundImage = "url('" + IMAGE_HUB.UI.SCREENS.YOU_WIN + "')";
    endScreen.style.backgroundColor = 'transparent';
    endScreen.classList.add('win-mode');
    document.getElementById('end-title').classList.add('hidden');
}

/**
 * Displays the "Game Over" title on the dark end-screen background.
 * @param {HTMLElement} endScreen - The end-screen container element.
 */
function showLoseScreen(endScreen) {
    endScreen.style.backgroundImage = 'none';
    endScreen.style.backgroundColor = '';
    endScreen.classList.remove('win-mode');
    let endTitle = document.getElementById('end-title');
    endTitle.src = IMAGE_HUB.UI.SCREENS.GAME_OVER_TITLE;
    endTitle.classList.remove('hidden');
}

/** Loads all sounds and wires up every menu/button once the page has fully loaded. */
function setupMenus() {
    soundManager.loadAll();
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('start-screen').classList.add('hidden');
        init();
    });
    document.getElementById('try-again-button').addEventListener('click', restartGame);
    document.getElementById('back-to-menu-button').addEventListener('click', backToMenu);
    setupImpressum();
    setupMobileControls();
    setupAudioControls();
}

/** Wires up the mute button and volume slider. */
function setupAudioControls() {
    let muteButton = document.getElementById('mute-button');
    let volumeSlider = document.getElementById('volume-slider');
    updateMuteIcon();
    muteButton.addEventListener('click', () => {
        soundManager.toggleMute();
        updateMuteIcon();
    });
    volumeSlider.addEventListener('input', (e) => {
        soundManager.setVolume(parseFloat(e.target.value));
    });
}

/** Swaps the mute button's icon to match the current muted state. */
function updateMuteIcon() {
    let icon = soundManager.muted ? IMAGE_HUB.UI.SCREENS.VOLUME_OFF : IMAGE_HUB.UI.SCREENS.VOLUME_ON;
    document.getElementById('mute-icon').src = icon;
}

/** Wires up every on-screen mobile control button. */
function setupMobileControls() {
    document.querySelectorAll('.mobile-btn').forEach(bindMobileButton);
}

/**
 * Binds a single mobile control button to the matching keyboard flag, and
 * blocks the long-press context menu so it can't interrupt gameplay.
 * @param {HTMLElement} btn - The button element, with its key in data-key.
 */
function bindMobileButton(btn) {
    let key = btn.dataset.key;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keyboard[key] = false; });
    btn.addEventListener('touchcancel', (e) => { e.preventDefault(); keyboard[key] = false; });
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

/** Wires up opening/closing the Impressum popup, including clicking outside it. */
function setupImpressum() {
    let overlay = document.getElementById('impressum-overlay');
    document.getElementById('impressum-link').addEventListener('click', () => {
        overlay.classList.remove('hidden');
    });
    document.getElementById('impressum-close').addEventListener('click', () => {
        overlay.classList.add('hidden');
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.add('hidden');
    });
}

if (window.matchMedia('(hover: none)').matches) {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
}

window.addEventListener('load', setupMenus);
