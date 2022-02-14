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
        this.load.image('flecha', '../img/flecha.png');
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
        this.cameras.main.setSize(960, 640);
        this.controlesVisuales();
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
        this.anims.create({
            key: 'caer',
            frames: this.anims.generateFrameNumbers('player', {
                start: 6,
                end: 8
            }),
            frameRate: 7,
            repeat: -1,
        });
    }

    controlesVisuales() {
        this.player.setData('direccionHorizontal', Phaser.NONE);
        this.player.setData('estaSaltando', Phaser.NONE);

        const leftbtn = this.add.sprite(50, 560, 'flecha').setInteractive();
        leftbtn.setScrollFactor(0);
        const rightbtn = this.add.sprite(200, 560, 'flecha').setInteractive();
        rightbtn.setScrollFactor(0);
        rightbtn.flipX = true;
        const upbtn = this.add.sprite(850, 560, 'flecha').setInteractive();
        upbtn.setScrollFactor(0);
        upbtn.rotation = Math.PI / 2;

        leftbtn.on('pointerdown', function () {
            this.scene.player.setData('direccionHorizontal', Phaser.LEFT);
        });

        rightbtn.on('pointerdown', function () {
            this.scene.player.setData('direccionHorizontal', Phaser.RIGHT);
        });

        upbtn.on('pointerdown', function () {
            this.scene.player.setData('estaSaltando', Phaser.UP);
        });

        leftbtn.on('pointerup', function () {
            this.scene.player.setData('direccionHorizontal', Phaser.NONE);
        });

        rightbtn.on('pointerup', function () {
            this.scene.player.setData('direccionHorizontal', Phaser.NONE);
        });

        upbtn.on('pointerup', function () {
            this.scene.player.setData('estaSaltando', Phaser.NONE);
        });
    }

    update() {
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = 0;

        if (this.cursors.left.isDown || this.player.getData('direccionHorizontal') === Phaser.LEFT) {
            this.player.caminarALaIzquierda();
        } else if (this.cursors.right.isDown || this.player.getData('direccionHorizontal') === Phaser.RIGHT) {
            this.player.caminarALaDerecha();
        } else {
            this.player.reposo();
        }

        if (this.cursors.up.isDown || this.player.getData('estaSaltando') === Phaser.UP) {
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

        this.setSize(90, 180, true);
    }

    caminarALaIzquierda() {
        this.body.setVelocityX(-250);
        this.flipX = true;
        if (this.enElSuelo) this.play('andar', true);

    }

    caminarALaDerecha() {
        this.body.setVelocityX(250);
        this.flipX = false;
        if (this.enElSuelo) this.play('andar', true);

    }

    reposo() {
        this.body.setVelocityX(0);
        if (this.enElSuelo) this.play('reposo', true);
    }

    saltar() {
        console.log(this.enElSuelo)
        if (this.enElSuelo) {
            this.body.setVelocityY(-250);
            this.play('caer', true);
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
            gravity: {
                y: 200
            }
        }
    }
};

new Phaser.Game(config);
window.addEventListener('resize', resize, false);