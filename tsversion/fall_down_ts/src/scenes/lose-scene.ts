import Phaser from "phaser";

export class EscenaPerder extends Phaser.Scene {
    constructor() {
        super('perderScene');
    }

    preload(){
        this.load.image('fin','../assets/img/fin-de-juego-vertical.jpg');
    }

    create(){
        this.add.image(320, 480, 'fin');
    }

    volverAJugar(){
        this.scene.start('Escena');
    }

}