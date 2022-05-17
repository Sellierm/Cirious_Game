class Europe extends Phaser.Scene {

    constructor() {
        super({
            key: 'europeScene'
        });
        this.player;
        this.cursors;
        this.animal1;
        this.animal2;
        this.struct1;
        this.struct2;
        this.field1;
        this.field2;

        this.images = [];

        this.headerScene;
        this.menuScene;

        this.timedEvent;

        this.timerGrowth = 0;
        this.timer = 0;
        this.timerDead = 0;
        this.timerWeeds = 0;
        this.timerDeadanimal = 0;
        this.timerMeal = 0;
        this.timerHunger = 0;

        this.climat = 'europe';

        this.musique;
    }

    create() {
        this.musique = this.sound.add('game_musique', {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.musique.play();


        this.registry.set('climat', 'europe');


        // Animaux
        this.data.set('bat1', {
            key: 1,
            x: -16,
            y: 304,
            dataType:'bat',
            type: 'animal',
            typeName:'Elevage',
            level: 0,
            tag: 'build',
            scale: 0.5,
            ref: {},
            dead:false,
            feed:100,
            qt:100
        });
        this.data.set('bat2', {
            key: 2,
            x: -16,
            y: -304,
            dataType:'bat',
            type: 'animal',
            typeName:'Elevage',
            level: 2,
            tag: 'cow',
            scale: 0.5,
            ref: {},
            dead:false,
            feed:80,
            qt:100
        });

        // Structures
        this.data.set('bat3', {
            key: 3,
            x: 352,
            y: -192,
            dataType:'bat',
            type: 'struct',
            typeName:'Infrastructure',
            level: 1,
            tag: 'tank',
            scale: 0.3,
            ref: {}
        });
        this.data.set('bat4', {
            key: 4,
            x: 352,
            y: -448,
            dataType:'bat',
            type: 'struct',
            typeName:'Infrastructure',
            level: 0,
            tag: 'build',
            scale: 0.3,
            ref: {}
        });

        //Champs
        this.data.set('bat5', {
            key: 5,
            x: -784,
            y: -303,
            dataType:'bat',
            type: 'field',
            typeName:'Culture',
            level: 1,
            tag: 'labor',
            scale: 0.5,
            ref: {},
            plant: false,
            seed: {},
            oldseed: [],
            grow: 0,
            dead:false,
            fertility:100,
            weeds:0,
            maxWeeds:10
        });
        this.data.set('bat6', {
            key: 6,
            x: -784,
            y: 175,
            dataType:'bat',
            type: 'field',
            typeName:'Culture',
            level: 0,
            tag: 'build',
            scale: 0.5,
            ref: {},
            plant: false,
            seed: {},
            oldseed: [],
            grow: 0,
            dead:false,
            fertility:100,
            weeds:0,
            maxWeeds:10
        });
        this.data.set('bat7', {
            key: 7,
            x: +784,
            y: 112,
            dataType:'bat',
            type: 'field',
            typeName:'Culture',
            level: 1,
            tag: 'water',
            scale: 0.5,
            ref: {},
            plant: false,
            seed: {},
            oldseed: [],
            grow: 0,
            dead:false,
            fertility:100,
            weeds:0,
            maxWeeds:10
        });
        this.data.set('bat8', {
            key: 8,
            x: +432,
            y: +304,
            dataType:'bat',
            type: 'field',
            typeName:'Culture',
            level: 1,
            tag: 'labor',
            scale: 0.5,
            ref: {},
            plant: false,
            seed: {},
            oldseed: [getByTag('carrot')[0]],
            grow: 0,
            dead:false,
            fertility:90,
            weeds:0,
            maxWeeds:10
        });


        // Maison/labo
        this.data.set('bat9', {
            key: 9,
            x: 768,
            y: -416,
            dataType:'bat',
            type: 'house',
            typeName:'Laboratoire',
            level: 1,
            tag: 'house',
            scale: 0.3,
            ref: {}
        });


        this.data.set('bat10', {
            key: 9,
            x: 0,
            y: 0,
            type: 'river',
            typeName:'Rivière',
            pollution: 0,
            tag: 'river',
            desc:''
        })




        const farm = this.physics.add.image(0, 0, 'europe');

        this.cameras.main.zoom = 0.8;

        // Player
        this.player = this.physics.add.sprite(800, -250, 'farmer').setDepth(2000).setScale(0.7);


        this.physics.add.overlap(this.player, farm, this.closeOverLap, function () { return true; }, this);


        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('farmer', {
                start: 3,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'farmer',
                frame: 0
            }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('farmer', {
                start: 9,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: [{
                key: 'farmer',
                frame: 0
            }],
            frameRate: 20
        });

        this.anims.create({
            key: 'down',
            frames: [{
                key: 'farmer',
                frame: 0
            }],
            frameRate: 20
        });


        // On délimite la map aux bords de l'image
        // On décale la caméra par rapport à la hauteur du header
        this.cameras.main.setBounds(farm.x - farm.width / 2 - 366, farm.y - farm.height / 2 - 60, farm.width + 366, farm.height + 60);
        this.physics.world.setBounds(farm.x - farm.width / 2, farm.y - farm.height / 2, farm.width, farm.height);

        // Pour suivre le joueur avec la camera
        this.cameras.main.startFollow(this.player);

        // Ajoute une collision entre le joueur et les bords de la map
        this.player.setCollideWorldBounds(true);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // Affiche tous les batiments prédéfinis dans la data
        let j = 0;
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if(bat.dataType == 'bat'){
                if (bat.level > 0 && bat.tag != 'build') {
                    if(bat.type != 'field' && bat.type != 'animal') {
                        this.images.push(this.physics.add.image(bat.x, bat.y, bat.tag, bat.level - 1));
                        bat.ref = getByTag(bat.tag)[0];
                        if (bat.rotate) {
                            this.images[j].rotation = 3.141592 / 2;
                        }
                    }
                    if(bat.type == 'animal') {
                        this.images.push(this.physics.add.image(bat.x, bat.y, bat.tag, bat.level - 1));
                        bat.ref = getByTag(bat.tag)[0];
                        if(bat.dead) {
                            this.images[j].setFrame((bat.level - 1) + bat.ref.lvlMax);
                        }
                        if (bat.rotate) {
                            this.images[j].rotation = 3.141592 / 2;
                        }
                    }
                    if(bat.type == 'field') {
                        if(!bat.plant) {
                            let arrayField = [];
                            arrayField['ground'] = this.physics.add.image(bat.x, bat.y, bat.tag, bat.level - 1);
                            arrayField['weeds'] = this.add.image(bat.x, bat.y, 'weeds', bat.weeds);
                            arrayField['plant'] = null;
                            bat.ref = getByTag(bat.tag)[0];
                            this.images.push(arrayField);
                        }
                        else {
                            let seed = getByTag(bat.tag)[0];
                            bat.seed = seed;
                            let arrayField = [];
                            arrayField['ground'] = this.physics.add.image(bat.x, bat.y, seed.ground, bat.level - 1);
                            arrayField['weeds'] = this.add.image(bat.x, bat.y, 'weeds', bat.weeds);
                            arrayField['plant'] = this.add.image(bat.x, bat.y, bat.tag, bat.grow);
                            bat.tag = seed.tag;
                            bat.ref = getByTag(bat.tag)[0];
                            bat.seed = seed;
                            this.images.push(arrayField);
                        }
                    }
                }
                else if(bat.tag != 'river') {
                    this.images.push(this.physics.add.image(bat.x, bat.y, 'build').setScale(bat.scale));
                }
                if(bat.type == 'field' && bat.level > 0 && bat.tag != 'build') {
                    this.physics.add.overlap(this.player, this.images[j]['ground'], this.overlapBat, null, this);
                }
                else {
                    this.physics.add.overlap(this.player, this.images[j], this.overlapBat, null, this);
                }
                j++;
            }
        }
        console.log(this.images);
        console.log(this.data.values);


        //debug
        /*this.debug = this.add.graphics({
            lineStyle: {
                color: 0xffff00
            }
        });*/
        //polygone des hitboxs
        var dataRiv = [window.innerWidth, -540, -325, -540, -960, -540, -960, 540, -390, 540, -390, 470, -330, 470, -330, 400, -270, 400, -270, 140, -320, 125, -540, 125, -540, 300, -640, 390, -680, 390, -700, 430, -780, 430, -790, 460, -840, 460, -860, 490, -960, 490, -960, -80, -620, -80, -560, 5, -515, 10, -370, 10, -370, -50, -430, -100, -430, -385, -590, -385, -590, -210, -620, -210, -620, -80, -960, -80, -960, -536, -570, -536, -570, -503, -335, -503, -320, -536, window.innerWidth, -536, window.innerWidth, -540];
        // The boundary
        this.Bounds = new Phaser.Geom.Polygon(dataRiv);

        // Will represent the player body
        this.playerRect = new Phaser.Geom.Rectangle();

        // Will hold a per-step velocity (distance)
        this.tempVelocity = new Phaser.Math.Vector2();

        // On recupère les scenes annexes
        this.headerScene = this.scene.get('headerScene');
        this.menuScene = this.scene.get('menuScene');


        this.registry.set('money', 100000);
        this.registry.set('moneyPerTick', 0);
        this.registry.set('ecology', 10);
        this.registry.set('animalCare', 60);
        this.registry.set('hunger', 10);


        //Code triche
        this.input.keyboard.on('keydown_W', function(){
            this.registry.set('money', this.registry.get('money') + 10000);
        }, this);
    }

    update() {
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-650);
            this.menuScene.closeSavoirPlus();
            //player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(650);
            this.menuScene.closeSavoirPlus();

            //player.anims.play('down', true);
        } else {
            this.player.setVelocityY(0);
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-650);
            this.menuScene.closeSavoirPlus();

            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(650);
            this.menuScene.closeSavoirPlus();

            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
        }

        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {

            this.player.anims.play('turn', true);
        }
        this.body = this.player.body;

        // Move the player rectangle ahead by one step of the provisional velocity
        this.projectRect(this.playerRect, this.body, 1 / this.physics.world.fps);

        // Check if the player rectangle is within the polygon and "block" the body on any corresponding axes
        this.setBlocked(this.body.blocked, this.playerRect, this.Bounds);

        // Limit the provisional velocity based on the blocked axes
        this.clampVelocity(this.body.velocity, this.body.blocked);

        // Draw the polygons
        //debug
        /*
        this.debug.clear().strokePoints(this.Bounds.points).strokeRectShape(this.playerRect);*/


        this.timerHunger++;
        if (this.timerHunger == 800) {
            console.log('Check weeds');
            this.updateJauge('hunger', -1);
            this.timerHunger = 0 - Phaser.Math.Between(0, 500);
        }

        this.timerWeeds++;
        if (this.timerWeeds == 3000) {
            console.log('Check weeds');
            this.weeds();
            this.timerWeeds = 0 - Phaser.Math.Between(0, 700);
        }

        this.timerGrowth++;
        if (this.timerGrowth == 500) {
            console.log('Check Pousse');
            this.grow();
            this.timerGrowth = 0 - Phaser.Math.Between(0, 200);
        }

        this.timerDead++;
        if (this.timerDead == 500) {
            console.log('Check rotten');
            this.rotten();
            this.timerDead = 0;
        }


        this.timerDeadanimal++;
        if (this.timerDeadanimal == 1500) {
            console.log('Check dead');
            this.dead();
            this.timerDeadanimal = 0 - Phaser.Math.Between(0, 500);
        }

        this.timerMeal++;
        if (this.timerMeal == 1000) {
            console.log('Check eat');
            this.eat();
            this.timerMeal = 0 - Phaser.Math.Between(0, 400);
        }

        if (this.timer % 60 == 0) {
            let moneyPerSec = 0;
            for (let i in this.data.values) {
                let bat = this.data.values[i];
                if (bat.level > 0 && bat.tag != 'build' && bat.type != 'field') {
                    if (typeof bat.ref.money[bat.level] == "number") {
                        moneyPerSec += bat.ref.money[bat.level];
                    }
                }
            }
            this.registry.set('money', this.registry.get('money') + moneyPerSec);
            this.registry.set('moneyPerTick', moneyPerSec);
        }
        this.timer++;
    }

    // Calcul de l'argent
    calcul() {
        let moneyPerTick = 0;
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if (bat.level > 0 && bat.tag != 'build' && bat.type != 'labor') {
                if (typeof bat.ref.money[bat.level] == "number") {
                    moneyPerTick += bat.ref.money[bat.level];
                }
            }
        }
    }

    overlapBat(player, obj) {
        let returnBat;
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if (obj.x == bat.x && obj.y == bat.y) {
                returnBat = bat;
            }
        }
        this.registry.set('bat', 'x : ' + returnBat.x + ', y : ' + returnBat.y);

        this.menuScene.getBatOverlap(returnBat);
    }


    upgradeBat(bat) {
        console.log('Upgrade batiment : ', bat)
        if (bat.type == 'animal' || bat.type == 'struct' || bat.type == 'house') {
            if (bat.level < bat.ref.lvlMax && bat.level != 0) {
                if (this.money() >= bat.ref.upgrade[bat.level]) {
                    if(bat.type != 'animal') {
                        this.registry.set('money', this.registry.get('money') - bat.ref.upgrade[bat.level]);
                        bat.level += 1;
                        console.log('Upgraded !', bat);
                        this.images[bat.key - 1].setFrame(bat.level - 1);
                    }
                    else if(!bat.dead) {
                        this.registry.set('money', this.registry.get('money') - bat.ref.upgrade[bat.level]);
                        bat.level += 1;
                        console.log('Upgraded !', bat);
                        this.images[bat.key - 1].setFrame(bat.level - 1);
                    }
                    if(bat.type == 'animal') {
                        this.updateJauge('animalCare', 10 * bat.level);

                        let textAnimal = this.add.text(bat.x, bat.y, '+'+(10 * bat.level).toString(), { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
                        let animalButton = this.add.image(textAnimal.x + textAnimal.width / 1.5, textAnimal.y, 'animal-care').setScale(0.08).setOrigin(0,0.5);
                        console.log(textAnimal);
                        setTimeout(() => {
                            textAnimal.destroy();
                            animalButton.destroy();
                        }, 2000);
                    }
                }
                else {
                    console.log('Not enought money')
                    this.menuScene.errorText('Not enought money');
                }
            }
        }
    }
    buildBat(bat, ref) {
        console.log('Construction batiment : ', bat);
        if (bat.level == 0 && bat.tag == "build") {
            if (this.money() >= ref.buildCost) {
                bat.level += 1;
                bat.tag = ref.tag;
                bat.ref = ref;
                this.registry.set('money', this.registry.get('money') - ref.buildCost);
                if(bat.type != 'field') {
                    console.log('Builded !', bat);
                    this.images[bat.key - 1] = this.physics.add.image(bat.x, bat.y, bat.tag, bat.level - 1);
                    if (bat.rotate) {
                        this.images[bat.key - 1].rotation = 3.141592 / 2;
                    }
                    if(bat.type == 'animal') {
                        this.updateJauge('animalCare', -30);

                        let textAnimal = this.add.text(bat.x, bat.y, '-30', { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
                        let animalButton = this.add.image(textAnimal.x + textAnimal.width / 1.5, textAnimal.y, 'animal-care').setScale(0.08).setOrigin(0,0.5);
                        console.log(textAnimal);
                        setTimeout(() => {
                            textAnimal.destroy();
                            animalButton.destroy();
                        }, 2000);
                    }
                }
                else {
                    this.images[bat.key - 1]['ground'] = this.physics.add.image(bat.x, bat.y, ref.tag, bat.level - 1);
                    this.images[bat.key - 1]['weeds'] = this.add.image(bat.x, bat.y, 'weeds', bat.weeds);
                    this.images[bat.key - 1]['plant'];
                    bat.ref = getByTag(bat.tag)[0];
                }
            }
            else {
                console.log('Not enought money')
                this.menuScene.errorText('Not enought money');
            }
        }
    }
    plant(bat, seed) {
        console.log('Plantation : ', bat);
        if (bat.type == 'field' && !bat.plant && bat.level == 1 && (bat.tag == 'labor' || bat.tag == 'water')) {
            if (this.money() >= seed.costPlant) {
                if (bat.tag == seed.ground) {
                    this.registry.set('money', this.registry.get('money') - seed.costPlant);
                    bat.plant = true;
                    bat.tag = seed.tag;
                    bat.seed = seed;
                    console.log('Planted !', bat);
                    this.images[bat.key - 1]['plant'] = this.add.image(bat.x, bat.y, seed.tag, bat.grow);
                }
                else {
                    console.log('Can\'t plant riz on dirt or others on water');
                    this.menuScene.errorText('Can\'t plant riz on dirt or others on water');
                }
            }
            else {
                console.log('Not enought money')
                this.menuScene.errorText('Not enought money');
            }
        }
    }
    replant(bat) {
        console.log('Replantation : ', bat);
        if (bat.oldseed[0]) {
            console.log(bat.oldseed[0]);
            this.plant(bat, bat.oldseed[0]);
        }
    }
    grow() {
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if (bat.level == 1 && bat.type == 'field' && bat.tag != 'labor' && bat.plant) {
                if (bat.grow < bat.seed.maxGrow && !bat.dead) {
                    if (Phaser.Math.Between(1, 5) <= 3) {
                        bat.grow++;
                        this.images[bat.key - 1]['plant'].setFrame(bat.grow);
                    }
                }
            }
        }
    }
    rotten(){
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if (bat.level == 1 && bat.type == 'field' && (bat.tag != 'labor' || bat.tag != 'water') && bat.plant && !bat.dead) {
                if (!bat.seed.climat.includes(this.climat)) {
                    bat.dead = true;
                    console.log('Dead plant !', bat);
                    this.images[bat.key - 1]['plant'].setFrame(bat.seed.maxGrow + 1);
                }
            }
        }
    }
    weeds(){
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if (bat.level == 1 && bat.type == 'field') {
                if (Phaser.Math.Between(1, 5) <= 2) {
                    bat.weeds++;
                    if(bat.weeds > bat.maxWeeds) bat.weeds = bat.maxWeeds;
                    console.log('Weeds !', bat);
                    this.images[bat.key - 1]['weeds'].setFrame(bat.weeds);
                }
            }
        }
    }
    clean(bat, lutte){
        console.log('Nettoyage : ', bat);
        if (bat.type == 'field' && bat.level == 1 && bat.weeds > 0) {
            bat.weeds -= lutte.health;
            if(bat.weeds < 0) bat.weeds = 0;
            console.log('Fertilised !', bat);
            this.images[bat.key - 1]['weeds'].setFrame(bat.weeds);
            this.updateJauge('ecology', lutte.ecology);


            let textEcology = this.add.text(bat.x, bat.y, lutte.ecology.toString(), { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
            let ecologyButton = this.add.image(textEcology.x + textEcology.width / 1.5, textEcology.y, 'ecology-care').setScale(0.08).setOrigin(0,0.5);
            console.log(textEcology);
            setTimeout(() => {
                textEcology.destroy();
                ecologyButton.destroy();
            }, 2000);
        }
    }
    recolte(bat) {
        console.log('Recolte : ', bat);
        if (bat.type == 'field' && bat.plant && bat.level == 1 && (bat.tag != 'labor' || bat.tag != 'water') && (bat.grow == bat.seed.maxGrow || bat.dead)) {
            let percent = bat.fertility/100;
            let percent2 = (bat.maxWeeds - bat.weeds)/10;
            console.log(percent, percent2);
            let moneyWin = bat.seed.money*percent*percent2;
            let hungerWin = 5*percent*percent2;

            // Compte l'echainement des graines
            let nbOldSeed = 0;
            while(bat.seed == bat.oldseed[nbOldSeed]){
                nbOldSeed++;
                bat.fertility -= 10*nbOldSeed;
                if(bat.fertility < 0) bat.fertility = 0;
            }
            if(nbOldSeed == 0) {
                bat.fertility -= 5;
                if(bat.fertility < 0) bat.fertility = 0;
            }
            if(!bat.dead) {
                bat.plant = false;
                bat.oldseed.unshift(bat.seed);
                bat.tag = bat.seed.ground;
                bat.grow = 0;
                this.registry.set('money', this.registry.get('money') + moneyWin);
                bat.seed = {};
                this.updateJauge('hunger', hungerWin);
                console.log('Recolté !', bat);
                this.images[bat.key - 1]['plant'].destroy();


                let textMoney = this.add.text(bat.x, bat.y, '+'+moneyWin+'$', { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
                let textHunger = this.add.text(bat.x, textMoney.y + textMoney.height*0.8, hungerWin, { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
                let hungerButton = this.add.image(textHunger.x + textHunger.width / 1.5, textHunger.y, 'hunger-care').setScale(0.08).setOrigin(0,0.5);
                setTimeout(() => {
                    textMoney.destroy();
                    textHunger.destroy();
                    hungerButton.destroy();
                }, 2000);
            }
            else {
                bat.plant = false;
                bat.oldseed.unshift(bat.seed);
                bat.tag = bat.seed.ground;
                bat.grow = 0;
                //this.money() += bat.seed.money;
                bat.seed = {};
                bat.dead = false;
                this.updateJauge('hunger', -10);
                console.log('Nettoyé !', bat);
                this.images[bat.key - 1]['plant'].destroy();


                let textHunger = this.add.text(bat.x, bat.y, '-10', { lineSpacing:10, fontSize:40, color:'#f00020' }).setOrigin(0.5, 0.5);
                let hungerButton = this.add.image(textHunger.x + textHunger.width / 1.5, textHunger.y, 'hunger-care').setScale(0.08).setOrigin(0,0.5);
                setTimeout(() => {
                    textHunger.destroy();
                    hungerButton.destroy();
                }, 2000);
            }
        }
    }
    fertility(bat, engrais) {
        console.log('Fertilisation : ', bat);
        if (bat.type == 'field' && !bat.plant && bat.level == 1 && (bat.tag == 'labor' || bat.tag == 'water') && bat.fertility < 100) {
            bat.fertility += engrais.fertility;
            if(bat.fertility > 100) bat.fertility = 100;
            console.log('Fertilised !', bat);
            this.updateJauge('ecology', engrais.ecology);

            let textEcology = this.add.text(bat.x, bat.y, engrais.ecology.toString(), { lineSpacing:10, fontSize:40, color:'#ffffff' }).setOrigin(0.5, 0.5);
            let ecologyButton = this.add.image(textEcology.x + textEcology.width / 1.5, textEcology.y, 'ecology-care').setScale(0.08).setOrigin(0,0.5);
            console.log(textEcology);
            setTimeout(() => {
                textEcology.destroy();
                ecologyButton.destroy();
            }, 2000);
        }
    }

    dead() {
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if (bat.level > 0 && bat.type == 'animal' && !bat.dead) {
                if (!bat.ref.climat.includes(this.climat)) {
                    bat.dead = true;
                    console.log('Dead animal !', bat);
                    this.images[bat.key - 1].setFrame((bat.level - 1) + bat.ref.lvlMax);

                    this.updateJauge('animalCare', -40);

                    let textAnimal = this.add.text(bat.x, bat.y, '-40', { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
                    let animalButton = this.add.image(textAnimal.x + textAnimal.width / 1.5, textAnimal.y, 'animal-care').setScale(0.08).setOrigin(0,0.5);
                    setTimeout(() => {
                        textAnimal.destroy();
                        animalButton.destroy();
                    }, 2000);
                }
            }
        }
    }

    destroyBat(bat, destroyRef) {
        console.log('Destruction batiment : ', bat);
        if (bat.level > 0 && bat.tag != "build" && bat.type == 'animal' || bat.type == 'struct' || bat.type == 'field') {
            if (this.money() >= destroyRef.cost) {
                if(bat.type == 'animal') {
                    this.images[bat.key - 1].destroy();
                    this.images[bat.key - 1] = this.physics.add.image(bat.x, bat.y, 'build').setScale(bat.scale);
                    if(!bat.dead) {
                        //Si il vend le batiment des animaux pas mort il gagne un bonus bien-être
                        this.updateJauge('animalCare', 20);

                        let textAnimal = this.add.text(bat.x, bat.y, '+20', { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
                        let animalButton = this.add.image(textAnimal.x + textAnimal.width / 1.5, textAnimal.y, 'animal-care').setScale(0.08).setOrigin(0,0.5);
                        setTimeout(() => {
                            textAnimal.destroy();
                            animalButton.destroy();
                        }, 2000);
                    }
                    bat.dead = false;
                    bat.feed = 80;
                    bat.qt = 100;
                }
                bat.level = 0;
                bat.tag = 'build';
                bat.ref = {};
                this.registry.set('money', this.registry.get('money') - destroyRef.cost);
                if(bat.type == 'field') {
                    console.log('Destroy field !', bat);
                    this.images[bat.key - 1]['ground'].destroy();
                    this.images[bat.key - 1]['weeds'].destroy();
                    if(bat.plant) {
                        this.images[bat.key - 1]['plant'].destroy();
                    }
                    this.images[bat.key - 1] = this.physics.add.image(bat.x, bat.y, 'build').setScale(bat.scale);
                    bat.seed = {};
                    bat.oldseed = [];
                    bat.dead = false;
                    bat.grow = 0;
                    bat.weeds = 0;
                    bat.plant = false;
                    bat.fertility = 100;
                }
                if(bat.type == 'struct') {
                    this.images[bat.key - 1].destroy();
                    this.images[bat.key - 1] = this.physics.add.image(bat.x, bat.y, 'build').setScale(bat.scale);
                }

                this.physics.add.overlap(this.player, this.images[bat.key - 1], this.overlapBat, null, this);
            }
            else {
                console.log('Not enought money')
                this.menuScene.errorText('Not enought money');
            }
        }
    }

    feed(bat, meal) {
        console.log('Feed : ', bat);
        if (bat.type == 'animal' && !bat.dead && bat.level > 0 && bat.feed < 100) {
            bat.feed += meal.feed;
            if(bat.feed > 100) bat.feed = 100;
            console.log('Feeded !', bat);
            this.updateJauge('animalCare', meal.care);

            let textAnimal = this.add.text(bat.x, bat.y, meal.care.toString(), { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
            let animalButton = this.add.image(textAnimal.x + textAnimal.width / 1.5, textAnimal.y, 'animal-care').setScale(0.08).setOrigin(0,0.5);
            console.log(textAnimal);
            setTimeout(() => {
                textAnimal.destroy();
                animalButton.destroy();
            }, 2000);
        }
    }

    eat() {
        for (let i in this.data.values) {
            let bat = this.data.values[i];
            if (bat.level > 0 && bat.type == 'animal' && !bat.dead) {
                if (bat.feed > 0) {
                    if (Phaser.Math.Between(1, 5) <= 4) {
                        bat.feed -= 5;
                        console.log('Eat animal !', bat);

                        if(bat.feed <= 0) {
                            bat.feed = 0;
                            setTimeout(() => {
                                bat.dead = true;
                                console.log('Dead animal !', bat);
                                this.images[bat.key - 1].setFrame((bat.level - 1) + bat.ref.lvlMax);

                                this.updateJauge('animalCare', -40);

                                let textAnimal = this.add.text(bat.x, bat.y, '-40', { lineSpacing:10, fontSize:40, color:'#f00020 ' }).setOrigin(0.5, 0.5);
                                let animalButton = this.add.image(textAnimal.x + textAnimal.width / 1.5, textAnimal.y, 'animal-care').setScale(0.08).setOrigin(0,0.5);
                                setTimeout(() => {
                                    textAnimal.destroy();
                                    animalButton.destroy();
                                }, 2000);
                            }, 5000);
                        }
                    }
                }
            }
        }
    }


    updateJauge(jauge, value){
        let result = this.registry.get(jauge) + value;
        if(result > 100) result = 100;
        if(result < 0) result = 0;
        this.registry.set(jauge, result);
    }


    textGain(text){
        let textMoney = this.add.text(bat.x, bat.y, '+'+moneyWin+'$\n+'+hungerWin+' Nourriture', { lineSpacing:10, fontSize:40, color:'#ffffff' }).setOrigin(0.5, 0.5);
        setTimeout(() => {
            textWin.destroy();
        }, 2000);
    }


    money() {
        return this.registry.list.money;
    }

    projectRect(rect, body, time) {
        this.tempVelocity.copy(body.velocity).scale(time);
        Phaser.Geom.Rectangle.CopyFrom(this.body, rect);
        Phaser.Geom.Rectangle.OffsetPoint(rect, this.tempVelocity);
    }
    clampVelocity(velocity, blocked) {
        if (blocked.left) velocity.x = Phaser.Math.Clamp(velocity.x, 0, Infinity);
        if (blocked.right) velocity.x = Phaser.Math.Clamp(velocity.x, -Infinity, 0);
        if (blocked.up) velocity.y = Phaser.Math.Clamp(velocity.y, 0, Infinity);
        if (blocked.down) velocity.y = Phaser.Math.Clamp(velocity.y, -Infinity, 0);
    }
    setBlocked(blocked, rect, bounds) {
        if (bounds.contains(rect.left, rect.top)) {
            blocked.left = true;
            blocked.up = true;
        }
        if (bounds.contains(rect.left, rect.bottom)) {
            blocked.left = true;
            blocked.down = true;
        }
        if (bounds.contains(rect.right, rect.top)) {
            blocked.right = true;
            blocked.up = true;
        }
        if (bounds.contains(rect.right, rect.bottom)) {
            blocked.right = true;
            blocked.down = true;
        }
        blocked.none = !blocked.left && !blocked.right && !blocked.up && !blocked.down;
    }
}