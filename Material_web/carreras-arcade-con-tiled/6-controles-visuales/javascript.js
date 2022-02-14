class Escena extends Phaser.Scene {

  preload() {
    //this.load.baseURL = '/curso/phaser/ex/carreras/con-arcade-con-tiled/';
    resize();
    window.addEventListener('resize', resize, false);

    this.load.tilemapTiledJSON('level1', '../img/map.json');
    this.load.image('nombreDelTilesetEnPhaser', '../img/tiles-galactico.jpg');
    this.load.spritesheet('player0', '../img/player0.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player1', '../img/player1.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player2', '../img/player2.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player3', '../img/player3.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image('leftbtn', '../img/flecha_giro.png');

  }

  create() {
    const map = this.make.tilemap({
      key: 'level1'
    });
    const tileset = map.addTilesetImage('nombreDelTilesetEnTiled', 'nombreDelTilesetEnPhaser');
    map.createDynamicLayer('backgroundLayer', tileset, 0, 0);

    this.coordenadasPlayers = [{
        x: 280,
        y: 500,
        leftbtn: {
          x: 30,
          y: 540,
          rotacion: 45
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
          y: 30,
          rotacion: 45
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
          y: 90,
          rotacion: -45
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
          y: 600,
          rotacion: -45
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
      const player = this.players[i];
      if (player.velocidad <= 200) {
        player.velocidad += 7;
      }

      player.body.setAcceleration(
        player.velocidad * Math.cos(Phaser.Math.DegToRad(player.angle - 180)),
        player.velocidad * Math.sin(Phaser.Math.DegToRad(player.angle - 180))
      );

      if (this.cursors.left.isDown || this.players[i].getData('direccionHorizontal') === -1)
        player.rotation -= 0.05;
      else if (this.cursors.right.isDown || this.players[i].getData('direccionHorizontal') === 1)
        player.rotation += 0.05;

    }
  }

  creaPlayers() {
    for (let i = 0; i < this.n_jugadores; i++) {
      //Creamos el jugador. Lo almacenamos en un array de jugadores porque nos será más fácil en adelante aplicar funcionalidades a todos los jugadores
      this.players[i] = this.physics.add.sprite(this.coordenadasPlayers[i].x, this.coordenadasPlayers[i].y, `player${i}`);
      //Creamos la animación del jugador
      this.anims.create({
        key: `volar${i}`,
        frames: this.anims.generateFrameNumbers(`player${i}`, {
          start: 0,
          end: 1
        }),
        frameRate: 10,
        repeat: -1,
      });
      //Vinculamos la animación al jugador creado y comenzamos su reproducción.
      //El primer parámetro de la función volar es el nombre de la animación, y el segundo, si la animación se va a ejecutar indefinidamente
      this.players[i].play(`volar${i}`, true);
      this.players[i].velocidad = 0;
      this.controlesVisuales(i);

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
}


function resize() {
  const canvas = document.querySelector('canvas');
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
};

new Phaser.Game(config);