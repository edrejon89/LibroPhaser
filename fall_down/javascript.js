class Escena extends Phaser.Scene{

    constructor() {
        super('Escena');
    }

    preload(){
        resize('resize', resize, false);
        window.addEventListener('resize', resize, false);
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.image('misil0', 'img/misil0.png');
        this.load.image('misil1', 'img/misil1.png')
        this.load.spritesheet('explosion', 'img/crash.png', {
            frameWidth: 199,
            frameHeight: 200
        });
        //Alto y ancho del sprite
    }

    create() {
        this.add.sprite(320, 480, 'fondo');
        this.physics.add.sprite(50, 100, 'misil0');
        this.time.delayedCall(1000, this.lanzarMisil, [], this);
        this.physics.world.on('worldbounds', () => {
            this.scene.start('perderScene');
        });
        // cargar animacion
        this.anims.create({
            key: 'explosionAnim',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 4}),
            frameRate:7
        });
    }

    // update() {
    //
    // }

    lanzarMisil() {
        // const misil = this.physics.add.sprite(50,100,'misil0');
        const aleatorio = Math.floor(Math.random() * 2);
        const posicionMisil = Math.floor(Math.random() * 590);
        const misil = this.physics.add.sprite(posicionMisil, 100,  `misil${aleatorio}`).setInteractive();
        misil.setVelocity(0,200);
        this.time.delayedCall(1000, this.lanzarMisil, [], this);
        misil.setInteractive();
        misil.on('pointerdown', () => this.misilPulsado(misil));
        misil.setCollideWorldBounds(true);
        misil.body.onWorldBounds = true;
        misil.setBounce(0.1, 0.1);
    }

    misilPulsado(m) {
        m.disableBody();
        m.play("explosionAnim");
    }


}


class EscenaPerder extends Phaser.Scene {
    constructor() {
        super('perderScene');
    }

    preload(){
        this.load.image('fin','img/fin-de-juego-vertical.jpg');
    }

    create(){
        this.add.image(320, 480, 'fin');
    }

    volverAJugar(){
        this.scene.start('Escena');
    }

}



const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    scene: [Escena,EscenaPerder],
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

function resize() {
    const canvas = document.querySelector('canvas');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;

    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + 'px';
        canvas.style.height = `${windowHeight}px`;
    } else {
        canvas.style.width = (windowHeight * gameRatio) + 'px';
        canvas.style.height = `${windowHeight}px`;
    }
}

new Phaser.Game(config);