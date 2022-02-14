class Escena extends Phaser.Scene {
    constructor() {
        super('Escena');
    }

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/acierta-imagen/';
        resize();
        window.addEventListener('resize', resize, false);
        this.load.image('fondo', '../img/fondo.jpg');
        this.load.image('caraIMG0', '../img/cara0.png');
        this.load.image('caraIMG1', '../img/cara1.png');
        this.load.image('caraIMG2', '../img/cara2.png');
        this.load.image('caraIMG3', '../img/cara3.png');
    };

    create() {
        this.add.sprite(480, 320, 'fondo');

        this.cara0 = this.add.sprite(225, 425, 'caraIMG0').setInteractive();
        this.cara0.setScale(0.5, 0.5);
        //this.cara0.on('pointerdown', () => this.caraPulsada(this.cara0));
        this.cara0.on('pointerdown', function () {
            this.scene.caraPulsada(this)
        });

        this.cara1 = this.add.sprite(480, 460, 'caraIMG1').setInteractive();
        this.cara1.setScale(0.5, 0.5);
        this.cara1.on('pointerdown', () => this.caraPulsada(this.cara1));


        this.cara2 = this.add.sprite(740, 425, 'caraIMG2').setInteractive();
        this.cara2.setScale(0.5, 0.5);
        this.cara2.on('pointerdown', () => this.caraPulsada(this.cara2));

        this.spriteSolucion = this.add.sprite(480, 190, 'caraIMG0');

        this.topeDeTiempo = 10;
        this.tiempo = this.topeDeTiempo;
        this.tiempoTXT = this.add.text(835, 130, this.tiempo, {
            fontFamily: 'font1',
            fontSize: 64,
            color: '#00ff00',
        });
        this.tiempoTXT.rotation = 20 * Math.PI / 180;
        this.temporizador();

        this.marcador = 0;
        this.marcadorTXT = this.add.text(90, 120, this.marcador, {
            fontFamily: 'font1',
            fontSize: 60,
            color: '#00ff00',
            align: 'right'
        });
        this.marcadorTXT.setOrigin(1, 0);
        this.add.text(105, 150, 'pts', {
            fontFamily: 'font1',
            fontSize: 24,
            color: '#00ff00'
        });

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
        alert(cara.texture.key)
    }


    caraPulsada(cara) {
        if (cara.texture.key === this.spriteSolucion.texture.key) {
            ++this.marcador;
            this.marcadorTXT.setText(this.marcador);
            if (this.topeDeTiempo > 2) this.topeDeTiempo = this.topeDeTiempo - 1;
            this.tiempo = this.topeDeTiempo;
            this.tiempoTXT.setText(this.tiempo);
            this.cargarImagenes();
        } else {
            this.topeDeTiempo--;
            this.scene.start('perderScene');
        }
    }

    temporizador() {
        --this.tiempo;
        this.tiempoTXT.setText(this.tiempo)

        if (this.tiempo === 0) {
            this.scene.start('perderScene');
        } else {
            this.time.delayedCall(1000, this.temporizador, [], this);
        }
    }
}

class EscenaPerder extends Phaser.Scene {
    constructor() {
        super('perderScene');
    }

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/acierta-imagen/';
        this.load.image('fin', '../img/perder-juego.jpg');
    }

    create() {
        this.add.image(480, 320, 'fin');
        this.input.on('pointerdown', () => this.volverAJugar())
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
    scene: [Escena, EscenaPerder]
};

new Phaser.Game(config);