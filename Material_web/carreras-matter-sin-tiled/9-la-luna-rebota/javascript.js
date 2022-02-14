class Escena extends Phaser.Scene {

    preload() {
        //this.load.baseURL = '/curso/phaser/ex/carreras/con-matter-sin-tiled/';
        resize();
        window.addEventListener('resize', resize, false);

        this.load.image('fondo', '../img/background.jpg');
        this.load.image('ladoizquierdo', '../img/ladoizquierdo.png');
        this.load.image('ladoderecho', '../img/ladoderecho.png');
        this.load.image('centro', '../img/centro.png');
        this.load.image('luna', '../img/luna.png');
        this.load.image('saturno', '../img/saturno.png');
        this.load.image('astronauta', '../img/astronauta.png');
        this.load.image('estrella', '../img/estrella.png');

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
        this.load.json('muros', '../img/muros.json');
    }

    create() {
        this.add.sprite(480, 320, 'fondo');
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


        const ladoizquierda = this.matter.add.sprite(0, 0, 'ladoizquierdo', null, {
            shape: muros.ladoizquierdo
        });
        const ladoderecha = this.matter.add.sprite(0, 0, 'ladoderecho', null, {
            shape: muros.ladoderecho
        });
        const centro = this.matter.add.sprite(0, 0, 'centro', null, {
            shape: muros.centro
        });
        const luna = this.matter.add.sprite(0, 0, 'luna', null, {
            shape: muros.luna
        });
        const astronauta = this.matter.add.sprite(0, 0, 'astronauta', null, {
            shape: muros.astronauta
        });
        //  const estrella = this.matter.add.sprite(0, 0, 'estrella', null, {shape: muros.estrella});
        const saturno = this.matter.add.sprite(0, 0, 'saturno', null, {
            shape: muros.saturno
        });

        luna.setBounce(1.5);

        const coordenadasLadoIzquierda = this.getCoordenadasSinTenerEnCuentaLaMasa(ladoizquierda, 0, 0);
        const coordenadasLadoDerecha = this.getCoordenadasSinTenerEnCuentaLaMasa(ladoderecha, 479, 0);
        const coordenadasCentro = this.getCoordenadasSinTenerEnCuentaLaMasa(centro, 210, 155);
        const coordenadasLuna = this.getCoordenadasSinTenerEnCuentaLaMasa(luna, 100, 100);
        const coordenadasAstronauta = this.getCoordenadasSinTenerEnCuentaLaMasa(astronauta, 685, 210);
        const coordenadasSaturno = this.getCoordenadasSinTenerEnCuentaLaMasa(saturno, 665, 110);

        ladoizquierda.setPosition(coordenadasLadoIzquierda.x, coordenadasLadoIzquierda.y);
        ladoderecha.setPosition(coordenadasLadoDerecha.x, coordenadasLadoDerecha.y);
        centro.setPosition(coordenadasCentro.x, coordenadasCentro.y);
        luna.setPosition(coordenadasLuna.x, coordenadasLuna.y);
        astronauta.setPosition(coordenadasAstronauta.x, coordenadasAstronauta.y);
        saturno.setPosition(coordenadasSaturno.x, coordenadasSaturno.y);


        this.creaPlayers();

        //this.matter.world.createDebugGraphic();
        //  this.matter.world.drawDebug = true;

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

    getCoordenadasSinTenerEnCuentaLaMasa(obj, xDondeLoPuseInicialmente, yDondeLoPuseInicialmente) {
        //  Si posicionas la forma en la el punto (0,0), por defecto será posicionado en función de su centro de gravedad. Lo siguiente son las coordenadas del centro de la pieza, tanto horizontal como verticalmente.
        const xDondeEstaAhora = (obj.body.bounds.max.x - obj.body.bounds.min.x) / 2;
        const yDondeEstaAhora = (obj.body.bounds.max.y - obj.body.bounds.min.y) / 2;
        const xOffset = -(xDondeEstaAhora - obj.centerOfMass.x) + xDondeEstaAhora;
        const yOffset = -(yDondeEstaAhora - obj.centerOfMass.y) + yDondeEstaAhora;
        //  Then apply them to the position we want the shape to appear at
        return {
            x: xDondeLoPuseInicialmente + xOffset,
            y: yDondeLoPuseInicialmente + yOffset
        };
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