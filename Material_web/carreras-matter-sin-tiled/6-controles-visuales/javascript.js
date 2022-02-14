class Escena extends Phaser.Scene {

  preload() {
    //this.load.baseURL = '/curso/phaser/ex/carreras/con-matter-sin-tiled/';
    resize();
    window.addEventListener('resize', resize, false);

    this.load.image('fondo', '../img/background.jpg');
    this.load.spritesheet('player0', '../img/player0.png', {
      frameWidth: 64,
      frameHeight: 32
    });
    this.load.spritesheet('player1', '../img/player1.png', {
      frameWidth: 64,
      frameHeight: 32
    });
    this.load.spritesheet('player2', '../img/player2.png', {
      frameWidth: 64,
      frameHeight: 32
    });
    this.load.spritesheet('player3', '../img/player3.png', {
      frameWidth: 64,
      frameHeight: 32
    });
    this.load.image('leftbtn', '../img/flecha.png');
  }

  create() {
    this.add.sprite(480, 320, 'fondo');
    this.coordenadasPlayers = [{
        x: 280,
        y: 500,
        leftbtn: {
          x: 30,
          y: 540
        },
        rightbtn: {
          x: 90,
          y: 600
        }
      },
      {
        x: 360,
        y: 500,
        leftbtn: {
          x: 870,
          y: 30
        },
        rightbtn: {
          x: 930,
          y: 90
        }
      },
      {
        x: 300,
        y: 550,
        leftbtn: {
          x: 30,
          y: 90
        },
        rightbtn: {
          x: 90,
          y: 30
        }
      },
      {
        x: 380,
        y: 550,
        leftbtn: {
          x: 870,
          y: 600
        },
        rightbtn: {
          x: 930,
          y: 540
        }
      }
    ];

    this.players = [];
    this.n_jugadores = 4;
    this.creaPlayers();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    for (let i = 0; i < this.n_jugadores; i++) {
      this.players[i].thrust(-0.003);

      if (this.cursors.left.isDown || this.players[i].getData('direccionHorizontal') === -1)
        this.players[i].setAngularVelocity(-0.065);

      else if (this.cursors.right.isDown || this.players[i].getData('direccionHorizontal') === 1)
        this.players[i].setAngularVelocity(0.065);
    }
  }

  controlesVisuales(n) {
    this.players[n].setData('direccionHorizontal', 0);

    const leftbtn = this.add.sprite(this.coordenadasPlayers[n].leftbtn.x, this.coordenadasPlayers[n].leftbtn.y, 'leftbtn').setInteractive();
    const rightbtn = this.add.sprite(this.coordenadasPlayers[n].rightbtn.x, this.coordenadasPlayers[n].rightbtn.y, 'leftbtn').setInteractive();

    rightbtn.flipX = true;

    rightbtn.on('pointerdown', function () {
      this.scene.players[n].setData('direccionHorizontal', 1);
    });

    leftbtn.on('pointerdown', function () {
      this.scene.players[n].setData('direccionHorizontal', -1);
    });

    rightbtn.on('pointerup', function () {
      this.scene.players[n].setData('direccionHorizontal', 0);
    });

    leftbtn.on('pointerup', function () {
      this.scene.players[n].setData('direccionHorizontal', 0);
    });
  }

  creaPlayers() {
    for (let i = 0; i < this.n_jugadores; i++) {
      this.players[i] = this.matter.add.sprite(this.coordenadasPlayers[i].x, this.coordenadasPlayers[i].y, `player${i}`);

      this.anims.create({
        key: `volar${i}`,
        frames: this.anims.generateFrameNumbers(`player${i}`, {
          start: 0,
          end: 1
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.players[i].play(`volar${i}`, true);
      this.players[i].setFrictionAir(0.08);
      this.controlesVisuales(i);
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
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0,
      },
    },
  },
};

new Phaser.Game(config);