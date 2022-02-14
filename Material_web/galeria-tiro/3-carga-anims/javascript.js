class Escena extends Phaser.Scene {

  preload() {
    //this.load.baseURL = '/curso/phaser/ex/galeria-tiro/';
    resize();
    window.addEventListener('resize', resize);
    this.load.image('fondo', '../img/fondo.jpg');

    this.load.spritesheet('dude', '../img/dude.png', {
      frameWidth: 180,
      frameHeight: 180
    });
    this.load.spritesheet('oruga', '../img/oruga.png', {
      frameWidth: 96,
      frameHeight: 192
    });
    this.load.spritesheet('hormiga', '../img/hormiga.png', {
      frameWidth: 192,
      frameHeight: 96
    });
    this.load.spritesheet('avispa', '../img/avispa.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  };

  create() {
    this.add.sprite(480, 320, 'fondo');
    this.animacionesDeLaEscena();
    const p2 = this.add.sprite(300, 200, 'oruga');
    const p3 = this.add.sprite(500, 200, 'hormiga');
    const p4 = this.add.sprite(700, 200, 'avispa');

    p2.play('orugaLeft');
    p3.play('hormigaLeft');
    p4.play('avispaLeft');
  };

  animacionesDeLaEscena() {
    this.anims.create({
      key: 'hormigaLeft',
      frames: this.anims.generateFrameNumbers('hormiga', {
        start: 0,
        end: 3
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'orugaLeft',
      frames: this.anims.generateFrameNumbers('oruga', {
        start: 0,
        end: 3
      }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: 'avispaLeft',
      frames: this.anims.generateFrameNumbers('avispa', {
        start: 0,
        end: 2
      }),
      frameRate: 10,
      repeat: -1,
    });

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