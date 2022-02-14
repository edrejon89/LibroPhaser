class Escena extends Phaser.Scene {

  preload() {
    //this.load.baseURL = '/curso/phaser/ex/galeria-tiro/';
    resize();
    window.addEventListener('resize', resize);
    this.load.image('fondo', '../img/fondo.jpg');

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
    this.load.spritesheet('explosion', '../img/fall-down-game/crash.png', {
      frameWidth: 199,
      frameHeight: 200
    });
  };

  create() {
    this.add.sprite(480, 320, 'fondo');
    this.animacionesDeLaEscena();

    this.createSprite();
  };

  createSprite() {
    const y = Math.floor(Math.random() * config.height);
    const x = Math.random() > 0.5 ? 960 : 0;
    const sentidoVelocidad = x == 0 ? 1 : -1;

    const bichos = ['oruga', 'hormiga', 'avispa'];
    const random = Math.floor(Math.random() * bichos.length);
    const nombreSprite = bichos[random];
    const obj = this.physics.add.sprite(x, y, nombreSprite).setInteractive();

    if (nombreSprite == 'oruga') {
      obj.play('orugaLeft');
    } else if (nombreSprite == 'hormiga') {
      obj.play('hormigaLeft');
    } else {
      obj.play('avispaLeft');
    }

    if (sentidoVelocidad == 1) {
      obj.flipX = true;
    }
    obj.setVelocity(sentidoVelocidad * 200, 0);

    obj.on('pointerdown', () => this.bichoPulsado(obj));

    this.time.delayedCall(1000, () => {
      this.createSprite();
    }, [], this);

  }

  bichoPulsado(bicho) {
    bicho.disableBody();
    bicho.play("explosionAnim");
  }

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

    this.anims.create({
      key: 'explosionAnim',
      frames: this.anims.generateFrameNumbers('explosion', {
        start: 0,
        end: 4
      }),
      frameRate: 7
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
  physics: {
    default: 'arcade'
  },
};

new Phaser.Game(config);