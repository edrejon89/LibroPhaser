class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/flappy-bird/';
        resize();
        window.addEventListener('resize', resize, false);
        this.load.image('fondo', '../img/espacio.jpg');
        this.load.spritesheet('heroe', '../img/heroe.png', {
            frameWidth: 50,
            frameHeight: 50
        });
    };

    create() {
        this.add.sprite(480, 320, 'fondo');
        this.player = this.physics.add.sprite(50, 100, 'heroe');

        this.anims.create({
            key: 'volar',
            frames: this.anims.generateFrameNumbers('heroe', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.player.play('volar');

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.saltar();
            }
        });

        this.input.on('pointerdown', () => this.saltar())
    };

    saltar() {
        this.player.setVelocityY(-200);
    }
}

function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = '${windowWidth}px';
        canvas.style.height = '${windowWidth / gameRatio}px';
    } else {
        canvas.style.width = '${windowHeight * gameRatio}px';
        canvas.style.height = '${windowHeight}px';
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: Escena,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 200
            }
        },
    },
};

new Phaser.Game(config);