class Escena extends Phaser.Scene{

    constructor() {
        super('Escena');
    }

    preload(){
        resize('resize', resize, false);
        window.addEventListener('resize', resize, false);
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('oruga', 'img/oruga.png', {
            frameWidth: 96,
            frameHeight: 192
        });
        this.load.spritesheet('hormiga', 'img/hormiga.png', {
            frameWidth: 192,
            frameHeight: 96
        });
        this.load.spritesheet('avispa', 'img/avispa.png', {
            frameWidth: 128,
            frameHeight: 128
        });
    }

    create() {
        this.add.sprite(320, 480, 'fondo');

        const p2 = this.add.sprite(300,200,'oruga');
        const p3 = this.add.sprite(500,200,'hormiga');
        const p4 = this.add.sprite(700,200,'avispa');

        this.createSprite();
        this.animacionesDeLaEscena();
    }

    animacionesDeLaEscena() {
        this.anims.create({
            key: 'hormigaLeft',
            frames: this.anims.generateFrameNumbers('hormiga', {start: 0, end: 3}),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'orugaLeft',
            frames: this.anims.generateFrameNumbers('oruga', {start: 0, end: 3}),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'avispaLeft',
            frames: this.anims.generateFrameNumbers('avispa', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });
    }

    createSprite() {
        const nombreSprite = 'oruga';
        const obj = this.physics.add.sprite(1000, 100, nombreSprite);
        if (nombreSprite == 'oruga') {
            obj.play('orugaLeft');
        } else if (nombreSprite == 'hormiga') {
            obj.play('hormigaLeft');
        } else {
            obj.play('avispaLeft');
        }
        obj.setVelocity(-200, 0);

        this.time.delayedCall(1000, () => {
            this.this.createSprite('oruga');
        }, [], this);
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
    width: 960,
    height: 640,
    scene: Escena,
    physics: {
        default:'arcade',
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