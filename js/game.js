let canvas;
let world;
let keyboard = new Keyboard();
let soundManager = new SoundManager();
let gameStarted = false;

function init() {
    canvas = document.getElementById('canvas');
    createLevel1();
    world = new World(canvas, keyboard);
    document.getElementById('mobile-controls').classList.remove('hidden');
    soundManager.play('BG', true);
}

function restartGame() {
    if (world) world.destroy();
    gameStarted = false;
    keyboard.reset();
    document.getElementById('end-screen').classList.add('hidden');
    init();
}

function backToMenu() {
    if (world) world.destroy();
    gameStarted = false;
    keyboard.reset();
    soundManager.stop('BG');
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
}

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

function showWinScreen(endScreen) {
    endScreen.style.backgroundImage = "url('" + IMAGE_HUB.UI.SCREENS.YOU_WIN + "')";
    endScreen.style.backgroundColor = 'transparent';
    endScreen.classList.add('win-mode');
    document.getElementById('end-title').classList.add('hidden');
}

function showLoseScreen(endScreen) {
    endScreen.style.backgroundImage = 'none';
    endScreen.style.backgroundColor = '';
    endScreen.classList.remove('win-mode');
    let endTitle = document.getElementById('end-title');
    endTitle.src = IMAGE_HUB.UI.SCREENS.GAME_OVER_TITLE;
    endTitle.classList.remove('hidden');
}

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

function updateMuteIcon() {
    let icon = soundManager.muted ? IMAGE_HUB.UI.SCREENS.VOLUME_OFF : IMAGE_HUB.UI.SCREENS.VOLUME_ON;
    document.getElementById('mute-icon').src = icon;
}

function setupMobileControls() {
    document.querySelectorAll('.mobile-btn').forEach(bindMobileButton);
}

function bindMobileButton(btn) {
    let key = btn.dataset.key;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keyboard[key] = false; });
    btn.addEventListener('touchcancel', (e) => { e.preventDefault(); keyboard[key] = false; });
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

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
