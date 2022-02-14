class Escena extends Phaser.Scene {

  preload() {
    console.log('preload');
  }

  create() {
    console.log('create');
  }

  update() {
    console.log('update');
  }
}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  scene: Escena,
};

new Phaser.Game(config);
