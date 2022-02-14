class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/plataformas/';
        resize()
        this.load.image('fondo', '../img/fondo-infinito.jpg');
        this.load.spritesheet('player', '../img/player.png', {
            frameWidth: 180,
            frameHeight: 180
        });
        this.load.tilemapTiledJSON('level1', '../img/map.json');
    }

    create() {
        this.add.sprite(480, 320, 'fondo');
        const map = this.add.tilemap('level1');
        const playersFromTiled = this.findObjectsByType('player', map);
        this.player = new Player(this, playersFromTiled[0].x, playersFromTiled[0].y);

    }

    findObjectsByType(type, tilemap) {
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

var game = new Phaser.Game(config);
window.addEventListener('resize', resize, false);