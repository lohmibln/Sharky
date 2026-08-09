let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

function init() {
    canvas = document.getElementById('canvas');
    createLevel1();
    world = new World(canvas, keyboard);
}

function showEndScreen(won) {
    let endScreen = document.getElementById('end-screen');
    let endTitle = document.getElementById('end-title');
    if (won) {
        endScreen.style.backgroundImage = "url('img/ui/screens/you-win.png')";
        endScreen.style.backgroundColor = 'transparent';
        endScreen.classList.add('win-mode');
        endTitle.classList.add('hidden');
    } else {
        endScreen.style.backgroundImage = 'none';
        endScreen.style.backgroundColor = '';
        endScreen.classList.remove('win-mode');
        endTitle.src = 'img/ui/screens/game-over-title.png';
        endTitle.classList.remove('hidden');
    }
    endScreen.classList.remove('hidden');
}

function setupMenus() {
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('start-screen').classList.add('hidden');
        init();
    });
    document.getElementById('try-again-button').addEventListener('click', () => {
        location.reload();
    });
    document.getElementById('impressum-link').addEventListener('click', () => {
        document.getElementById('impressum-overlay').classList.remove('hidden');
    });
    document.getElementById('impressum-close').addEventListener('click', () => {
        document.getElementById('impressum-overlay').classList.add('hidden');
    });
}

window.addEventListener('load', setupMenus);
