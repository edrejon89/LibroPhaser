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

  }

  create() {
    const map = this.make.tilemap({
      key: 'level1'
    });
    const tileset = map.addTilesetImage('nombreDelTilesetEnTiled', 'nombreDelTilesetEnPhaser');
    map.createDynamicLayer('backgroundLayer', tileset, 0, 0);



    this.coordenadasPlayers = [{
        x: 280,
        y: 500
      },
      {
        x: 360,
        y: 500
      },
      {
        x: 300,
        y: 550
      },
      {
        x: 380,
        y: 550
      },
    ];
    this.players = [];
    this.n_jugadores = 4;
    this.creaPlayers();

  }

  creaPlayers() {
    for (let i = 0; i < this.n_jugadores; i++) {
      //Creamos el jugador. Lo almacenamos en un array de jugadores porque nos será más fácil en adelante aplicar funcionalidades a todos los jugadores
      this.players[i] = this.add.sprite(this.coordenadasPlayers[i].x, this.coordenadasPlayers[i].y, `player${i}`);
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
      this.players[i].play(`volar${i}`);
    }
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
  scene: Escena
};

new Phaser.Game(config);