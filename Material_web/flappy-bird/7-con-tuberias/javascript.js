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
        this.load.image('pipe0', '../img/pipe0.png');
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
        this.anims.create({
            key: 'saltar',
            frames: this.anims.generateFrameNumbers('heroe', {
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
    }

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
        //Una columna es un grupo de cubos
        const columna = this.physics.add.group();

        //Cada columna tendrá un hueco (zona en la que no hay cubos) por dónde pasará el super heroe
        const hueco = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < 8; i++) {
            //El hueco estará compuesto por dos posiciones en las que no hay cubos, por eso ponemos hueco +1
            if (i !== hueco && i !== hueco + 1) {
                const cubo = columna.create(960, i * 100 + 10, 'pipe0');
                cubo.body.allowGravity = false;
            }
        }
        columna.setVelocityX(-200);
        //Detectaremos cuando las columnas salen de la pantalla...
        columna.checkWorldBounds = true;
        //... y con la siguiente línea las eliminaremos
        columna.outOfBoundsKill = true;
        //Cada 1000 milisegundos llamaremos de nuevo a esta función para que genere una nueva columna
        this.time.delayedCall(1000, this.nuevaColumna, [], this);
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
            },
        },
    },
};

new Phaser.Game(config);