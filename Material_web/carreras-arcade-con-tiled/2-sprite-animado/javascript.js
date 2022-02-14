class Escena extends Phaser.Scene {

  preload() {
    //this.load.baseURL = '/curso/phaser/ex/carreras/con-arcade-con-tiled/';
    resize();
    window.addEventListener('resize', resize, false);

    this.load.tilemapTiledJSON('level1', '../img/map.json');
    this.load.image('nombreDelTilesetEnPhaser', '../img/tiles-galactico.jpg');
    this.load.spritesheet('player0', '../img/player1.png', {
      frameWidth: 64,
      frameHeight: 32
    });

  }

  create() {
    const map = this.make.tilemap({
      key: 'level1'
    });
    const tileset = map.addTilesetImage('nombreDelTilesetEnTiled', 'nombreDelTilesetEnPhaser');
    map.createDynamicLayer('backgroundLayer', tileset, 0, 0);

    this.player0 = this.add.sprite(400, 500, 'player0');

    this.anims.create({
      key: 'volar',
      frames: this.anims.generateFrameNumbers('player0', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player0.play('volar');
  }
}

function resize() {
  const canvas = document.querySelector('canvas');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  canvas.style.width = '${windowWidth}px';
  canvas.style.height = '${windowHeight}px';
}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  scene: Escena
};

new Phaser.Game(config);