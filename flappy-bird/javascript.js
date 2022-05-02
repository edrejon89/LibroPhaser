class Escena extends Phaser.Scene {

    preload() {
        resize();
        window.addEventListener('resize', resize, false);
        this.load.image('fondo', 'img/espacio.jpg');
        this.load.spritesheet('heroe', 'img/heroe.png', {frameWidth: 50, frameHeight: 50});
        this.load.image('pipe0', 'img/pipe0.png');
        this.load.image('pipeAbajo0', 'img/pipeAbajo0.png')
        this.load.image('pipeArriba0', 'img/pipeArriba0.png');
        this.load.image('pipe1', 'img/pipe1.png');
        this.load.image('pipeAbajo1', 'img/pipeAbajo1.png')
        this.load.image('pipeArriba1', 'img/pipeArriba1.png');

    }

    create() {
        // this.add.sprite(480, 320, 'fondo');
        this.bg = this.add.tileSprite(480, 320, 960, 640, 'fondo').setScrollFactor(0); // con este permite  desplazar
        //el fondo. Se le agrega un parametro al metodo update.
        this.player = this.physics.add.sprite(50, 200, 'heroe');

        this.anims.create({
            key: 'volar',
            frames: this.anims.generateFrameNumbers('heroe', {start: 0, end: 1}),
            frameRate: 7,
            repeat: -1,
        });

        this.anims.create({
            key: 'saltar',
            frames: this.anims.generateFrameNumbers('heroe', {start: 2, end: 2}),
            frameRate: 7,
            repeat: 1,
        });

        this.player.play('volar');

        this.input.keyboard.on('keydown', (event) => {
            // console.log("event code:", event.keyCode);
            if (event.keyCode === 32) {
                this.saltar();
            }
        });

        this.input.on('pointerdown', () => this.saltar());

        this.time.delayedCall(1000, this.nuevaColumna, [], this);
        this.player.on('animationcomplete', this.animationComplete, this); // cuando concluye cualquier animacion
        // de un objeto dispara in metodo

        this.physics.world.setBoundsCollision(true);

        this.physics.world.on('worldbounds', (body) => {
            this.scene.start('perderScene');
        });

        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;
    }


    saltar() {
        this.player.setVelocityY(-300);
        this.player.play('saltar');
    }

    animationComplete(animation, frame, sprite) {
        if (animation.key === 'saltar') {
            this.player.play('volar');
        }
    }

    nuevaColumna() {
        // Una columna es un grupo de cubos.
        const columna = this.physics.add.group();

        //Cada columna tendra un hueco (zona en la que no hay cubos) por donde pasara el superheroe
        const hueco = Math.floor(Math.random() * 5) + 1;

        const aleatorio = Math.floor(Math.random() * 2);

        for (let i = 0; i < 8; i++) {
            // El hueco estara compuesto por dos posiciones en las que no hay cubos, por eso ponemos hueco +1
            // if (i !== hueco){
            if (i !== hueco && i !== hueco + 1 && i !== hueco - 1) {
                // const cubo = columna.create(960, i * 100 + 10, 'pipe0');
                let cubo;
                if (i == hueco - 2) {
                    cubo = columna.create(960, i * 100, 'pipeArriba' + aleatorio);
                } else if (i == hueco + 2) {
                    cubo = columna.create(960, i * 100, 'pipeAbajo' + aleatorio);
                } else {
                    cubo = columna.create(960, i * 100, 'pipe' + aleatorio);
                }
                cubo.body.allowGravity = false;
            }
        }

        columna.setVelocityX(-200);
        // Detectaremos cuando las columnas salen de la pantalla...
        columna.checkWorldBounds = true;
        // ... y con cada siguiente linea las eliminaremos
        columna.outOfBoundsKill = true;
        // Cada 1000 milisegundos llamaremos de nuevo a esta funcion para que genere una nueva columna.
        this.time.delayedCall(1500, this.nuevaColumna, [], this);
        this.physics.add.overlap(this.player, columna, this.hitColumna, null, this);
    }

    hitColumna() {
        // alert("Game Over");
        this.scene.start('perderScene');
    }

    update(time){
        this.bg.tilePositionX = time * 0.1;
    }


}

class PerderEscena extends Phaser.Scene {
    constructor() {
        super({key: 'perderScene'});
    }

    preload() {
        this.load.image('perder', 'img/perder-juego.jpg');
    }

    create() {
        this.add.image(480, 320, 'perder');

        this.input.keyboard.on('keydown', function (event) {
            if (event.keyCode === 32) {
                this.scene.volverAJugar();
            }
        });

        this.input.on('pointerdown', () => this.saltar())
    }

    volverAJugar() {
        this.scene.start('Escena');
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
    scene: [Escena, PerderEscena],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {y: 500},
        }
    }
};

new Phaser.Game(config);