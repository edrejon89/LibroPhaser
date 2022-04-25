import 'phaser';


export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
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


    create(): void {
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
            frameRate: 7
        });
    }

    lanzarMisil() {
        // const misil = this.physics.add.sprite(50,100,'misil0');
        const aleatorio = Math.floor(Math.random() * 2);
        const posicionMisil = Math.floor(Math.random() * 590);
        var misil = this.physics.add.sprite(posicionMisil, 100, `misil${aleatorio}`).setInteractive();
        misil.setVelocity(0, 200);
        this.time.delayedCall(1000, this.lanzarMisil, [], this);
        misil.setInteractive();
        misil.on('pointerdown', () => this.misilPulsado(misil));
        misil.setCollideWorldBounds(true);
        // misil.body.onWorldBounds = true;
        misil.setBounce(0.1, 0.1);
    }

    misilPulsado(m) {
        m.disableBody();
        m.play("explosionAnim");
    }


}

