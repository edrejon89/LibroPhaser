class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/carreras/con-matter-sin-tiled/';
        resize();
        //this.load.image('fondo', '../img/carreras/fondo.png');
        this.load.multiatlas('nombreQueLeDoyALaHojaDeSpritesEnPhaser', '/curso/assets/phaser/coches/texturePacker.json', '/apuntes/assets/phaser/coches');


        this.load.spritesheet('player0', '../img/playerSprite1.png', {
            frameWidth: 64,
            frameHeight: 32
        });
        this.load.spritesheet('player1', '../img/playerSprite2.png', {
            frameWidth: 64,
            frameHeight: 32
        });
        this.load.spritesheet('player2', '../img/playerSprite3.png', {
            frameWidth: 64,
            frameHeight: 32
        });
        this.load.spritesheet('player3', '../img/playerSprite4.png', {
            frameWidth: 64,
            frameHeight: 32
        });
        this.load.image('leftbtn', '../img/flecha.png');
        this.load.json('muros', '../img/muros.json');


    }

    create() {
        //this.add.sprite(480, 320, 'fondo');
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
        this.cursors = this.input.keyboard.createCursorKeys();

        /* muros matter*/
        const muros = this.cache.json.get('muros');
        //muro_exterior_izquierda.png es el nombre que recibe en TexturePacker


        const muro_ext_izq = this.matter.add.sprite(0, 0, 'nombreQueLeDoyALaHojaDeSpritesEnPhaser', 'muro_exterior_izquierda.png', {
            shape: muros.muro_exterior_izquierda
        });


        //  If you position the shape at 0x0 it will be positioned based on its center of mass by default.

        var width = (muro_ext_izq.body.bounds.max.x - muro_ext_izq.body.bounds.min.x) / 2;
        var height = (muro_ext_izq.body.bounds.max.y - muro_ext_izq.body.bounds.min.y) / 2;
        var xOffset = -(width - muro_ext_izq.centerOfMass.x) + width;
        var yOffset = -(height - muro_ext_izq.centerOfMass.y) + height;

        var x = 0;
        var y = 0;

        //  Then apply them to the position we want the shape to appear at
        muro_ext_izq.setPosition(x + xOffset, y + yOffset);


        //  muro_ext_izq.setPosition(0 + muro_ext_izq.centerOfMass.x, 0 + muro_ext_izq.centerOfMass.y);  // position (0,0)
        //muro_ext_izq.setPosition(320,110);
        //    const muro_ext_der = this.matter.add.sprite(450, 0, 'nombreQueLeDoyALaHojaDeSpritesEnPhaser', 'muro-exterior-derecha.png', {shape: muros.muro_ext_der})//.setOrigin(0,0);
        //  muro_ext_der.setPosition(0 + muro_ext_der.centerOfMass.x, 0 + muro_ext_der.centerOfMass.y);

        //this.matter.add.sprite(480, 320, 'nombreQueLeDoyALaHojaDeSpritesEnPhaser', 'muro_ext', {shape: muros.muro_int});

        this.creaPlayers();

        //this.matter.world.createDebugGraphic();
        //  this.matter.world.drawDebug = true;

    }

    update() {
        for (let i = 0; i < this.n_jugadores; i++) {
            this.players[i].thrust(-0.003);

            if (this.cursors.left.isDown || this.players[i].parametros.direccionHorizontal === -1)
                this.players[i].setAngularVelocity(-0.065);

            else if (this.cursors.right.isDown || this.players[i].parametros.direccionHorizontal === 1)
                this.players[i].setAngularVelocity(0.065);
        }
    }

    controlesVisuales(n) {
        this.players[n].parametros = {};
        this.players[n].parametros.direccionHorizontal = 0;

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
window.addEventListener('resize', resize, false);