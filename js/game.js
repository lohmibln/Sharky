let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

function init() {
    canvas = document.getElementById('canvas');
    createLevel1();
    world = new World(canvas, keyboard);
    document.getElementById('mobile-controls').classList.remove('hidden');
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
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
}

function showEndScreen(won) {
    let endScreen = document.getElementById('end-screen');
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
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('start-screen').classList.add('hidden');
        init();
    });
    document.getElementById('try-again-button').addEventListener('click', restartGame);
    document.getElementById('back-to-menu-button').addEventListener('click', backToMenu);
    setupImpressum();
    setupMobileControls();
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

window.addEventListener('load', setupMenus);
