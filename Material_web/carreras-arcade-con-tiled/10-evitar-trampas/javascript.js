class Escena extends Phaser.Scene {

  preload() {
    //this.load.baseURL = '/curso/phaser/ex/carreras/con-arcade-con-tiled/';
    resize();
    window.addEventListener('resize', resize, false);

    this.load.tilemapTiledJSON('level1', '../img/map.json');
    this.load.image('nombreDelTilesetEnPhaser', '../img/tiles-galactico.jpg');
    this.load.spritesheet('player0', '../img/amarillo.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player1', '../img/rojo.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player2', '../img/azul.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player3', '../img/verde.png', {
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
    this.backgroundLayer = map.createDynamicLayer('backgroundLayer', tileset, 0, 0);


    this.backgroundLayer.setCollisionBetween(5, 11);
    this.backgroundLayer.setCollisionBetween(16, 21);
    this.backgroundLayer.setCollisionBetween(27, 32);
    this.backgroundLayer.setCollisionBetween(38, 88);

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

    this.pintarMarcador();
    this.createMarkers();
    this.pintarMetas(map, this.playersGroup);

  }

  update() {
    for (let i = 0; i < this.n_jugadores; i++) {
      const player = this.players[i];
      if (player.velocidad <= 200) {
        player.velocidad += 7;
      }

      // player.body.velocity.x = player.velocidad * Math.cos(Phaser.Math.DegToRad(player.angle - 180));
      // player.body.velocity.y = player.velocidad * Math.sin(Phaser.Math.DegToRad(player.angle - 180));



      /*Para trabajar con las físicas ARCADE, es recomendable cambiar la velocidad del personaje utilizando setAcceleration en lugar de velocity
      En las ARCADE physics:
    Si necesitas aplicar una fuerza constante, usaremos aceleración
    Si necesitas aplicar la fuerza una sola vez, para comenzar un movimiento, usaremos velocidad

     */

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

  createMarkers() {
    this.markers = this.physics.add.staticGroup();

    this.markers.create(64, 460, '__DEFAULT').setSize(128, 8).setData('id', 0).setData('direction', Phaser.UP);
    this.markers.create(64, 200, '__DEFAULT').setSize(128, 8).setData('id', 1).setData('direction', Phaser.UP);
    this.markers.create(800, 64, '__DEFAULT').setSize(8, 64).setData('id', 2).setData('direction', Phaser.RIGHT);
    this.markers.create(864, 360, '__DEFAULT').setSize(96, 8).setData('id', 3).setData('direction', Phaser.DOWN);
    this.markers.create(416, 32 * 13, '__DEFAULT').setSize(8, 96).setData('id', 4).setData('direction', Phaser.LEFT);

    this.physics.add.overlap(this.playersGroup, this.markers, this.hitMarker, null, this);
  }

  creaPlayers() {
    this.playersGroup = this.physics.add.group(this);

    for (let i = 0; i < this.n_jugadores; i++) {
      //Creamos el jugador. Lo almacenamos en un array de jugadores porque nos será más fácil en adelante aplicar funcionalidades a todos los jugadores
      //this.players[i] = this.physics.add.sprite(this.coordenadasPlayers[i].x, this.coordenadasPlayers[i].y, `player${i}`);
      this.players[i] = this.playersGroup.create(this.coordenadasPlayers[i].x, this.coordenadasPlayers[i].y, `car${i}`);


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

      /*EN ESTE PASO HEMOS AÑADIDO LAs PROPIEDADes NUMERO Y MARCADOR AL PLAYER*/
      this.players[i].numero = i;
      this.players[i].marcador = 0;

      /* *************************************** */
      this.controlesVisuales(i);


      this.players[i].setSize(16, 16);
      this.players[i].setDamping(true);
      this.players[i].setDrag(0.99);
      this.players[i].setMaxVelocity(160);

      this.players[i].setData('nextMarker', 0);
    }


    this.physics.add.collider(this.playersGroup, this.playersGroup);
    this.physics.add.collider(this.playersGroup, this.backgroundLayer);

  }

  controlesVisuales(n) {
    this.players[n].setData('direccionHorizontal', 0);

    const leftbtn = this.add.sprite(this.coordenadasPlayers[n].leftbtn.x, this.coordenadasPlayers[n].leftbtn.y, 'leftbtn').setInteractive();
    leftbtn.angle = this.coordenadasPlayers[n].leftbtn.rotacion;

    const rightbtn = this.add.sprite(this.coordenadasPlayers[n].rightbtn.x, this.coordenadasPlayers[n].rightbtn.y, 'leftbtn').setInteractive();
    rightbtn.angle = this.coordenadasPlayers[n].leftbtn.rotacion;
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

  pintarMarcador() {
    this.add.text(200, 275, 'P1:', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#00ff00'
    });
    this.add.text(280, 275, 'P2:', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#00ff00'
    });
    this.add.text(200, 315, 'P3:', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#00ff00'
    });
    this.add.text(280, 315, 'P4:', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#00ff00'
    });

    this.marcadorCoche0 = this.add.text(240, 275, '0', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#ffffff'
    });
    this.marcadorCoche1 = this.add.text(320, 275, '0', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#ffffff'
    });
    this.marcadorCoche2 = this.add.text(240, 315, '0', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#ffffff'
    });
    this.marcadorCoche3 = this.add.text(320, 315, '0', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#ffffff'
    });
  }

  pintarMetas(map, coches) {

    const metaIN = this.findObjectsByType('meta', map, 'metas')[0];

    const metaObjIN = this.add.zone(metaIN.x, metaIN.y + 32, metaIN.width, metaIN.height).setOrigin(0, 0);
    this.physics.world.enable(metaObjIN);



    this.physics.add.overlap(coches, metaObjIN, this.entraArea, null, this);


  }


  /*Cada vez que pasemos por encima de un marker se dispara hitMarker.
   *
   * */
  hitMarker(player, marker) {
    let id = marker.getData('id');
    let nextMarker = player.getData('nextMarker');

    /*Si la id del marker coincide con el siguiente marker que debe atravesar el usuario...*/
    if (id === nextMarker) {
      player.setData('nextMarker', id + 1);
    }
  }



  entraArea(objectZone1, objectCar) {
    let nextMarker = objectCar.getData('nextMarker');
    if (nextMarker === this.markers.getChildren().length) {
      objectCar.marcador++;
      this['marcadorCoche' + objectCar.numero].setText(objectCar.marcador)
      objectCar.setData('nextMarker', 0);
    }
  }


  findObjectsByType(type, tilemap, layer) {
    const result = [];
    tilemap.objects.forEach(function (element) {
      if (element.name === layer) {
        element.objects.forEach(function (element2) {
          if (element2.type === type) {
            element2.y -= tilemap.tileHeight;
            result.push(element2);
          }
        });
      }
    });
    return result;
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