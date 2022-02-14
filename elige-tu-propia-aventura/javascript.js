class Escena extends Phaser.Scene {
    opcionPulsada(opcion) {
        // alert(opcion.name);
        if (opcion.name === 'nave') {
            this.scene.start('naveScene');
        } else {
            this.scene.start('homeScene');
        }
    }

    preload() {
        resize();
        window.addEventListener('resize', resize);
        this.load.image('fondo', 'img/espacio.jpg')
    }

    create() {
        this.add.sprite(480, 320, 'fondo')
        const opcionNave = this.add.zone(140, 10, 450, 380);//Origen x=140 y=10. Ancho=450, Alto=410
        opcionNave.setOrigin(0);
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(opcionNave);
        opcionNave.setName('nave');
        opcionNave.setInteractive();
        opcionNave.once('pointerdown', () => this.opcionPulsada(opcionNave));

        const opciontierra = this.add.zone(600, 240, 360, 400);//Origen x=140 y=10. Ancho=450, Alto=410
        opciontierra.setOrigin(0);
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(opciontierra);
        opciontierra.setName('tierra');
        opciontierra.setInteractive();
        opciontierra.once('pointerdown', () => this.opcionPulsada(opciontierra));
    }

    // update() {
    //     console.log('update');
    // }
}

class EscenaNave extends Phaser.Scene {
    constructor() {
        super({key: 'naveScene'});
    }

    preload() {
        this.load.image('nave', 'img/nave.jpg');
    }

    create() {
        this.add.sprite(480, 320, 'nave');
        const opcionNave = this.add.zone(150, 170, 250, 370);
        opcionNave.setOrigin(0);
        opcionNave.setName('boss');
        opcionNave.setInteractive();
        opcionNave.once('pointerdown', () => this.opcionPulsada(opcionNave));
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(opcionNave);

        const opcionMundo = this.add.zone(530, 170, 250, 370);
        opcionMundo.setOrigin(0);
        opcionMundo.setName('home');
        opcionMundo.setInteractive();
        opcionMundo.once('pointerdown', () => this.opcionPulsada(opcionMundo));
        this.add.graphics().lineStyle(2, 0x00ff00).strokeRectShape(opcionMundo);
    }

    opcionPulsada(opcion) {
        if (opcion.name === 'boss') {
            this.scene.start('monstruoScene');
        } else {
           this.scene.start('homeScene');
        }
    }
}

class EscenaHome extends Phaser.Scene {
    constructor() {
        super({key: 'homeScene'});
    }

    preload() {
        this.load.image('home', 'img/home.jpg');
    }

    create() {
        this.add.sprite(480, 320, 'home');
    }
}

class EscenaMonstruo extends Phaser.Scene {
    constructor() {
        super({key: 'monstruoScene'});
    }

    preload() {
        this.load.image('monstruo', 'img/monstruo.jpg');
    }

    create() {
        this.add.sprite(480, 320, 'monstruo');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: [Escena, EscenaNave, EscenaHome, EscenaMonstruo],
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

function resize1() {
    const canvas = document.querySelector('canvas');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = `${windowHeight}px`;
}


new Phaser.Game(config);

