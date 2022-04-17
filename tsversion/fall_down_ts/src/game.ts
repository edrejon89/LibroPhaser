import 'phaser';
import {GameConfig} from './config';

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}


window.addEventListener('load', () => {
    const game = new Game(GameConfig);
});
/*
* https://www.freecodecamp.org/news/how-to-build-a-simple-game-in-the-browser-with-phaser-3-and-typescript-bdc94719135/
* https://blog.ourcade.co/posts/2020/phaser-3-typescript/
* https://github.com/digitsensitive/phaser3-typescript
* */