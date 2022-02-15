class Escena extends Phaser.Scene {


    preload() {
        resize();
        window.addEventListener('resize', resize);
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.image("caraIMG0", "img/cara0.png");
        this.load.image("caraIMG1", "img/cara1.png");
        this.load.image("caraIMG2", "img/cara2.png");
        this.load.image("caraIMG3", "img/cara3.png");
    }

    create() {
        // Numero aleatorio en js nativo
        // const n_aleatorio = Math.floor(Math.random() * (MAX-MIN+1)) +MIN;
        this.add.sprite(480, 320, 'fondo');
        this.cara0 = this.add.sprite(225, 425, 'caraIMG0').setInteractive();
        this.cara1 = this.add.sprite(480, 460, 'caraIMG1').setInteractive();
        this.cara2 = this.add.sprite(740, 425, 'caraIMG2').setInteractive();



        this.cara0.setScale(0.5, 0.5);
        this.cara1.setScale(0.5, 0.5);
        this.cara2.setScale(0.5, 0.5);

        this.cara0.on('pointerdown', () => this.caraPulsada(this.cara0));
        this.cara1.on('pointerdown', () => this.caraPulsada(this.cara1));
        this.cara2.on('pointerdown', () => this.caraPulsada(this.cara2));

        const random = Math.floor(Math.random() *3);
        this.spriteSolucion = this.add.sprite(480,190, 'caraIMG0');
    }

    caraPulsada(cara){
        if (cara.texture.key === this.spriteSolucion.texture.key){
            alert('Exito!!!');
        } else {
            alert('Fracaso, como en todo lo que haces!');
        }

    }
    // update() {
    //     console.log('update');
    // }
}





const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: [Escena],
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

