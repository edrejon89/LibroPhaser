import 'phaser';
export class BootScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;

    constructor() {
        super({
            key: 'BootScene'
        });
    }

    preload(): void {
        // resize('resize', resize, false);
        window.addEventListener('resize', this.resize, false);
        this.load.image('fondo', '../assets/img/fondo.jpg');
        this.load.image('misil0', '../assets/img/misil0.png');
        this.load.image('misil1', '../assets/img/misil1.png')
        this.load.spritesheet('explosion', '../assets/img/crash.png', {
            frameWidth: 199,
            frameHeight: 200
        });
    }

    update(): void {

    }

    resize() {
        const canvas = document.querySelector('canvas');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const windowRatio = windowWidth / windowHeight;
        // const gameRatio = config.width / config.height;
        const gameRatio = 640 / 960;

        if (windowRatio < gameRatio) {
            canvas.style.width = windowWidth + 'px';
            canvas.style.height = `${windowHeight}px`;
        } else {
            canvas.style.width = (windowHeight * gameRatio) + 'px';
            canvas.style.height = `${windowHeight}px`;
        }
    }
}
