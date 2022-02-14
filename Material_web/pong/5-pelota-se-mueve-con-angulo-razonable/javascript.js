class Escena extends Phaser.Scene {

  preload() {
    resize();
    //this.load.baseURL = '/curso/phaser/ex/pong/';

    this.load.image('fondo', '../img/fondo.jpg');
    this.load.spritesheet('bola', '../img/bola.png', {
      frameWidth: 100,
      frameHeight: 100
    });
  }

  create() {
    this.add.sprite(480, 320, 'fondo');

    this.bola = this.physics.add.sprite(480, 320, 'bola');
    const velocidad = 500;
    let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
    const derechaOIzq = Math.floor(Math.random() * 2);
    if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

    const vx = Math.sin(anguloInicial) * velocidad;
    const vy = Math.cos(anguloInicial) * velocidad;

    this.bola.body.velocity.x = vx;
    this.bola.body.velocity.y = vy;


    this.anims.create({
      key: 'brillar',
      frames: this.anims.generateFrameNumbers('bola', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    this.bola.play('brillar');
  }
  update() {
    this.bola.rotation += 0.1;
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
  },
}

new Phaser.Game(config);