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
        this.load.image('pipe0', '../img/pipe0.png');
        this.load.image('pipeAbajo0', '../img/pipeAbajo0.png');
        this.load.image('pipeArriba0', '../img/pipeArriba0.png');

    }

    create() {
        this.add.sprite(480, 320, 'fondo');
        this.player = this.physics.add.sprite(50, 200, 'heroes');

        this.anims.create({
            key: 'volar',
            frames: this.anims.generateFrameNumbers('heroes', {
                start: 0,
                end: 2
            }),
            frameRate: 7,
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

        this.time.delayedCall(1000, this.nuevaColumna, [], this);
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

    nuevaColumna() {
        console.log('nueva columna');
        const columna = this.physics.add.group();

        const hueco = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < 16; i++) {
            //El agujero son cuatro casillas
            if (i !== hueco && i !== hueco + 1 && i !== hueco - 1) {
                let cubo;
                if (i == hueco - 2) {
                    cubo = columna.create(960, i * 100, 'pipeArriba0');
                } else if (i == hueco + 2) {
                    cubo = columna.create(960, i * 100, 'pipeAbajo0');
                } else {
                    cubo = columna.create(960, i * 100, 'pipe0');
                }
                cubo.body.allowGravity = false;
            }
        }
        columna.setVelocityX(-200);
        columna.checkWorldBounds = true;
        columna.outOfBoundsKill = true;
        this.time.delayedCall(1500, this.nuevaColumna, [], this);
        this.physics.add.overlap(this.player, columna, this.hitColumna, null, this);
    }

    hitColumna() {
        alert('game over');
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
            gravity: {
                y: 400
            }
        },
    },
};

new Phaser.Game(config);