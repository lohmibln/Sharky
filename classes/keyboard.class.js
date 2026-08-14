class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    /** Creates a keyboard state tracker and starts listening for key events. */
    constructor() {
        this.bindKeyEvents();
    }

    /** Registers the window-level keydown/keyup listeners. */
    bindKeyEvents() {
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    /**
     * Updates the relevant key flag and blocks default browser behavior
     * (like page scroll) for the keys this game uses.
     * @param {KeyboardEvent} e - The keydown/keyup event.
     * @param {boolean} isPressed - Whether the key is now pressed or released.
     */
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

    /** Clears every key flag (used when restarting so no key stays "stuck"). */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
        this.D = false;
    }
}
