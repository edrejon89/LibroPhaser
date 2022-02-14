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
        this.load.tilemapTiledJSON('level1', '../img/map.json');
        this.load.image('flecha', '../img/flecha.png');
        this.load.spritesheet('explosion', '../img/crash.png', {
            frameWidth: 199,
            frameHeight: 200
        });
    }

    create() {
        this.bg = this.add.tileSprite(480, 320, 960, 640, 'fondo').setScrollFactor(0);
        const map = this.add.tilemap('level1');
        const tileset = map.addTilesetImage('tiles', 'gameTiles');
        map.createStaticLayer('backgroundLayer', tileset);
        map.createStaticLayer('hierbaLayer', tileset).setDepth(100);
        this.collisionLayer = map.createStaticLayer('collisionLayer', tileset);
        this.collisionLayer.setCollisionByExclusion([-1]);
        this.animacionesDeLaEscena();
        const playersFromTiled = this.findObjectsByType('player', map);
        this.player = new Player(this, playersFromTiled[0].x, playersFromTiled[0].y);

        const hormigasFromTiled = this.findObjectsByType('hormigaEnemy', map);
        const orugasFromTiled = this.findObjectsByType('orugaEnemy', map);
        const avispasFromTiled = this.findObjectsByType('avispaEnemy', map);

        const hormigas = this.insertarMalos(hormigasFromTiled, HormigaEnemy, this);
        const orugas = this.insertarMalos(orugasFromTiled, OrugaEnemy, this);
        const avispas = this.insertarMalos(avispasFromTiled, AvispaEnemy, this);

        this.physics.add.collider(this.player, this.collisionLayer);
        this.physics.add.overlap(this.player, hormigas, this.player.checkEnemy, null, this.player);
        this.physics.add.overlap(this.player, orugas, this.player.checkEnemy, null, this.player);

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
        this.anims.create({
            key: 'hormiga_caminar',
            frames: this.anims.generateFrameNumbers('hormiga', {
                start: 0,
                end: 3
            }),
            frameRate: 7,
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
        this.anims.create({
            key: 'oruga_caminar',
            frames: this.anims.generateFrameNumbers('oruga', {
                start: 0,
                end: 3
            }),
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: 'avispa_volar',
            frames: this.anims.generateFrameNumbers('avispa', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
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

    insertarMalos(arrayDeMalos, type, scene) {
        const enemies = scene.physics.add.group({
            classType: type,
            runChildUpdate: true,
            runChildCreate: true
        });
        for (let i = 0; i < arrayDeMalos.length; i++) {
            const malo = new type(arrayDeMalos[i].x, arrayDeMalos[i].y, scene);
            enemies.add(malo);
        }
        return enemies;
    }

    update() {
        this.bg.tilePositionX = this.player.x;

        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = 0;

        if (this.player.estaVivo) {
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
        this.estaVivo = true;
        this.setSize(90, 180, true);

        this.on('animationcomplete', this.animationComplete, this);
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
        if (this.enElSuelo) {
            this.body.setVelocityY(-250);
            this.play('caer', true);
        }
    }

    update() {
        this.enElSuelo = this.body.onFloor();
    }

    checkEnemy(player, enemigo) {
        //  El jugador está cayendo?
        if (this.body.velocity.y > 0) {
            enemigo.morir();
        } else {
            this.morir();
        }
    }

    morir() {
        this.estaVivo = false;
        this.disableBody();
        this.play('explosionAnim', true);
    }

    animationComplete(animation, frame, sprite) {
        if (animation.key === 'explosionAnim') {
            this.disableBody(true, true);
        }
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.physics.add.collider(this, scene.collisionLayer);
        scene.add.existing(this);

        this.velocidad = 100;
        this.direccion = 1;
        this.on('animationcomplete', this.animationComplete, this);
    }

    update() {
        this.body.setVelocityX(this.direccion * this.velocidad);
        const nextX = Math.floor(this.x / 32) + this.direccion;
        let nextY = this.y + this.height / 2;
        nextY = Math.round(nextY / 32);
        const nextTile = this.scene.collisionLayer.hasTileAt(nextX, nextY);
        if (!nextTile && this.body.blocked.down) {
            this.direccion *= -1;
        }
        if (this.direccion > 0) {
            this.flipX = true;
        } else {
            // console.log(this.direccion);

            this.flipX = false;
        }
    }

    morir() {
        this.disableBody();
        this.play('explosionAnim');
    }

    animationComplete(animation, frame, sprite) {
        if (animation.key === 'explosionAnim') {
            this.disableBody(true, true);
        }
    }
}

class HormigaEnemy extends Enemy {

    constructor(x, y, scene) {
        super(scene, x, y, 'hormiga');
        scene.add.existing(this);
        this.play('hormiga_caminar');
    }
}

class OrugaEnemy extends Enemy {

    constructor(x, y, scene) {
        super(scene, x, y, 'oruga');
        scene.add.existing(this);
        this.play('oruga_caminar');
    }
}


class AvispaEnemy extends Phaser.Physics.Arcade.Sprite {

    constructor(x, y, scene) {
        super(scene, x, y, 'avispa');
        scene.physics.add.collider(this, this.scene.collisionLayer);
        scene.add.existing(this);

        this.flyPath = new Phaser.Curves.Ellipse(x, y, 100, 100);
        this.pathIndex = 0;
        this.pathSpeed = 0.005;
        this.pathVector = new Phaser.Math.Vector2();
        this.flyPath.getPoint(0, this.pathVector);
        this.setPosition(this.pathVector.x, this.pathVector.y);

        this.path = this.flyPath;
        this.patrolCircle = new Phaser.Geom.Circle(0, 0, 256);

        this.play('avispa_volar', true);
    }

    update() {
        this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
        this.path.getPoint(this.pathIndex, this.pathVector);
        this.setPosition(this.pathVector.x, this.pathVector.y);
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