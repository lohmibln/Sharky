# Sharkie

A 2D jump-and-run browser game built with vanilla JavaScript and HTML5 Canvas. Guide Sharkie through an underwater level, dodge and defeat pufferfish and jellyfish, collect coins, and take down the End Boss.

## Controls

**Desktop**

| Key | Action |
| --- | --- |
| Arrow keys | Move |
| D | Fin Slap (melee attack) |
| Space | Bubble Shot (ranged attack) |

**Mobile / Touch**

On touch devices in landscape orientation, on-screen controls appear at the bottom of the screen (D-pad + attack buttons). In portrait orientation, you'll be prompted to rotate your device.

## Features

- Full character animation set: idle, long idle, swim, hurt, death, and two attacks (fin slap, bubble trap)
- Enemies: pufferfish, jellyfish (regular and dangerous variants), and an End Boss, each with their own hit/death animations
- Parallax scrolling background across a 5-layer depth
- Health bars for both player and boss
- Coin collectibles
- Sound effects and background music (mutable, with a volume slider)
- Responsive layout with dedicated mobile touch controls
- Win/lose end screens with in-place restart (no page reload)
- Impressum popup

## Tech Stack

Plain HTML, CSS, and JavaScript — no frameworks, no build step, no ES modules. All classes and scripts are loaded via `<script>` tags in dependency order in `index.html`.

## Project Structure

```
classes/       Game object classes (Character, enemies, World, Level, etc.)
js/            Non-class scripts: game loop/menu wiring, level layout, asset hubs
img/           Sprite sheets and UI images
sounds/        Sound effects and music
fonts/         Local font files
css/           Stylesheet
index.html     Entry point
```

## Author

Lucas Lohmann
