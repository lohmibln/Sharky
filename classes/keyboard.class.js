class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    constructor() {
        this.bindKeyEvents();
    }

    bindKeyEvents() {
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    handleKey(e, isPressed) {
        switch (e.code) {
            case 'ArrowLeft':  this.LEFT  = isPressed; break;
            case 'ArrowRight': this.RIGHT = isPressed; break;
            case 'ArrowUp':    this.UP    = isPressed; break;
            case 'ArrowDown':  this.DOWN  = isPressed; break;
            case 'Space':      this.SPACE = isPressed; break;
            case 'KeyD':       this.D     = isPressed; break;
        }
        if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) {
            e.preventDefault();
        }
    }

    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
        this.D = false;
    }
}
