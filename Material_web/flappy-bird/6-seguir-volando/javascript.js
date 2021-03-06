class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/flappy-bird/';
        resize();
        window.addEventListener('resize', resize, false);
        this.load.image('fondo', '../img/espacio.jpg');
        this.load.spritesheet('heroes', '../img/heroes.png', {
            frameWidth: 50,
            frameHeight: 50
        });
    };

    create() {
        this.add.sprite(480, 320, 'fondo');
        this.player = this.physics.add.sprite(50, 100, 'heroes');

        this.anims.create({
            key: 'volar',
            frames: this.anims.generateFrameNumbers('heroes', {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'saltar',
            frames: this.anims.generateFrameNumbers('heroes', {
                start: 2,
                end: 2
            }),
            frameRate: 10,
            repeat: 1,
        });

        this.player.play('volar');

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.saltar();
            }
        });

        this.input.on('pointerdown', () => this.saltar());

        this.player.on('animationcomplete', this.animationComplete, this);
    };

    saltar() {
        this.player.setVelocityY(-200);
        this.player.play('saltar');
    }

    animationComplete(animation, frame, sprite) {
        if (animation.key === 'saltar') {
            this.player.play('volar');
        }
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