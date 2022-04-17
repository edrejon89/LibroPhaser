import {BootScene} from './scenes/boot-scene'
import { GameScene } from './scenes/game-scene';
import {EscenaPerder } from './scenes/lose-scene';

// https://blog.ourcade.co/posts/2020/phaser-3-typescript/
export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    scene: [BootScene, GameScene,EscenaPerder],
    physics: {
        default:'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 300.
            },
        },
    },
};