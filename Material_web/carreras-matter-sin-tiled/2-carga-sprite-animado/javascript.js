class Escena extends Phaser.Scene {

  preload() {
    //this.load.baseURL = '/curso/phaser/ex/carreras/con-matter-sin-tiled/';
    resize();
    this.load.image('fondo', '../img/background.jpg');
    this.load.spritesheet('player0', '../img/player0.png', {
      frameWidth: 64,
      frameHeight: 32
    });
  }

  create() {
    this.add.sprite(480, 320, 'fondo');
    this.player1 = this.add.sprite(400, 500, 'player0');

    this.anims.create({
      key: 'volar',
      frames: this.anims.generateFrameNumbers('player0', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player1.play('volar', true);
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
  scene: Escena
};

new Phaser.Game(config);
window.addEventListener('resize', resize, false);