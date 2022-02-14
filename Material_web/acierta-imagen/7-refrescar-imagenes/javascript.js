class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/acierta-imagen/';
        resize();
        window.addEventListener('resize', resize, false);
        this.load.image('fondo', '../img/fondo.jpg');
        this.load.image('caraIMG0', '../img/cara0.png');
        this.load.image('caraIMG1', '../img/cara1.png');
        this.load.image('caraIMG2', '../img/cara2.png');
        this.load.image('caraIMG3', '../img/cara3.png');
    }

    create() {
        this.add.sprite(480, 320, 'fondo');

        this.cara0 = this.add.sprite(225, 425, 'caraIMG0').setInteractive();
        this.cara0.setScale(0.5, 0.5);
        this.cara0.on('pointerdown', () => this.caraPulsada(this.cara0));


        this.cara1 = this.add.sprite(480, 460, 'caraIMG1').setInteractive();
        this.cara1.setScale(0.5, 0.5);
        this.cara1.on('pointerdown', () => this.caraPulsada(this.cara1));


        this.cara2 = this.add.sprite(740, 425, 'caraIMG2').setInteractive();
        this.cara2.setScale(0.5, 0.5);
        this.cara2.on('pointerdown', () => this.caraPulsada(this.cara2));

        this.spriteSolucion = this.add.sprite(480, 190, 'caraIMG0');
        this.cargarImagenes();
    }

    cargarImagenes() {
        const numeros = [0, 1, 2, 3];

        for (let i = 0; i < 3; i++) {
            const posicion = Math.floor(Math.random() * numeros.length);
            const valor = numeros[posicion];
            this['cara' + i].setTexture('caraIMG' + valor);
            numeros.splice(posicion, 1);
        }

        const random = Math.floor(Math.random() * 3);
        this.spriteSolucion.setTexture(this['cara' + random].texture.key);
    }

    caraPulsada(cara) {
        if (cara.texture.key === this.spriteSolucion.texture.key) {
            this.cargarImagenes();
        } else {
            alert('fracaso');
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
};

new Phaser.Game(config);