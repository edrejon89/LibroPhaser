class Escena extends Phaser.Scene {

  preload() {
    resize();
    window.addEventListener('resize', resize);
    console.log('preload');
  };

  create() {
    console.log('create');
  }

  update() {
    console.log('update');
  }
}

function resize() {
  const canvas = document.querySelector("canvas");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  canvas.style.width = '${windowWidth}px';
  canvas.style.height = '${windowHeight}px';

  /*
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;
    if(windowRatio < gameRatio){
      canvas.style.width = '${windowWidth}px';
      canvas.style.height = '${windowWidth / gameRatio}px';
    }else{
      canvas.style.width = '${windowHeight * gameRatio}px';
      canvas.style.height = '${windowHeight}px';
    }
    */
}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  scene: Escena,
};

new Phaser.Game(config);