class Disclaimer extends Phaser.Scene {

    constructor() {
        super({
            key: 'disclaimerScene'
        });
    }

    preload() {

    }

    create() {
        const txt = this.make.text({
            x: 0,
            y: 0,
            text: 'Si vous vous attendez à un jeu avec des champs qui volent, vous n’avez peut-être pas choisi le bon jeu. Quand nous parlons de ferme du futur, c’est pour une échéance dans 5 à 10, avec les objectifs cités précédemment. \n\nConcernant le bien-être animal, certains peuvent être choqué, mais nous parlons de la réalité, et il est utopique de penser que d’ici 10 ans tout le monde plus personne ne mangera de viande. Notre consommation globale de viande doit baisser, car sa production est très polluante, cependant la souffrance animale existe malgré tout et nous devons la réduire le plus possible. \n\nDe nombreux autres points ne sont pas abordés, (gestion des sols, …) mais nous ne prétendons pas faire une liste exhaustive de tout ce qu’il faut améliorer dans le futur. Nous présentons simplement qu’il y a plein de choses que nous pouvons améliorer, des solutions qui parfois existes déjà mais qui doivent êtres, répandues, et surtout nous ouvrons la porte à votre réflexion et à votre curiosité pour creuser le sujet. \n\n\nMais puis après tout ce n’est qu’un jeu donc Have Fun ! ',
            style:{
                fontSize:20,
                fontFamily:'monospace',
                align:'center',
                wordWrap:{
                    width:window.innerWidth-40
                },
                lineSpacing:10
            }
        });
        Phaser.Display.Align.In.Center(txt, this.add.zone(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight));

        this.input.once('pointerdown', this.start, this);
    }

    start() {
        this.scene.start('mapScene');
    }

}