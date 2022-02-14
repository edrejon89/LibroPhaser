class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/plataformas/';
        resize();
        this.load.image('fondo', '../img/fondo-infinito.jpg');
        this.load.image('gameTiles', '../img/tiles.png');
        //frameWidth y frameHeight son los tamaños de cada uno de los frames de la animación
        this.load.spritesheet('player', '../img/player.png', {
            frameWidth: 180,
            frameHeight: 180
        });
        this.load.tilemapTiledJSON('level1', '../img/map.json');
    }

    create() {
        this.add.sprite(480, 320, 'fondo');
        const map = this.add.tilemap('level1');
        const tileset = map.addTilesetImage('tiles', 'gameTiles');
        map.createStaticLayer('backgroundLayer', tileset);
        map.createStaticLayer('hierbaLayer', tileset).setDepth(100);
        this.collisionLayer = map.createStaticLayer('collisionLayer', tileset);
        this.collisionLayer.setCollisionByExclusion([-1]);
        this.animacionesDeLaEscena();
        const playersFromTiled = this.findObjectsByType('player', map);
        this.player = new Player(this, playersFromTiled[0].x, playersFromTiled[0].y);

        this.physics.add.collider(this.player, this.collisionLayer);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    animacionesDeLaEscena() {
        this.anims.create({
            key: 'andar',
            frames: this.anims.generateFrameNumbers('player', {
                start: 1,
                end: 3
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'reposo',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 1
            }),
            frameRate: 4,
            repeat: -1,
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.caminarALaIzquierda();
        } else if (this.cursors.right.isDown) {
            this.player.caminarALaDerecha();
        } else {
            this.player.reposo();
        }

        if (this.cursors.up.isDown) {
            this.player.saltar();
        }
        this.player.update();
    }

    findObjectsByType(type, tilemap, layer) {
        const result = [];

        tilemap.objects.forEach(function (element) {
            if (element.name === 'objectsLayer') {
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

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.physics.systems.displayList.add(this);
        scene.physics.systems.updateList.add(this);
        scene.physics.world.enableBody(this, 0);
        this.enElSuelo = true;
        console.log(3)

        this.setSize(90, 180, true);
    }

    caminarALaIzquierda() {
        this.body.setVelocityX(-250);
        this.flipX = true;
        this.play('andar', true);
    }

    caminarALaDerecha() {
        this.body.setVelocityX(250);
        this.flipX = false;
        this.play('andar', true);
    }

    reposo() {
        this.body.setVelocityX(0);
        this.play('reposo', true);
    }

    saltar() {
        if (this.enElSuelo) {
            this.body.setVelocityY(-250);
        }
    }

    update() {
        this.enElSuelo = this.body.onFloor();
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
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 200
            }
        }
    }
};

new Phaser.Game(config);
window.addEventListener('resize', resize, false);