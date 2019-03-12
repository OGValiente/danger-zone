module BoilerPlate {
    export class Gameplay extends Phaser.State implements Fabrique.IState  {
        //public static Name: string = 'gameplay';
        public static pause: boolean = false;
        //
        public name: string;
        public game: Fabrique.IGame;

        private background: Phaser.Image;
        private text: Label;
        private backBtn: LabeledButton;
        private playerShip: Phaser.Sprite;

        public fireRate: number = 750;
        public nextFire: number = 0;

        private enemyBoss: Phaser.Sprite;
        private playerShield: Phaser.Sprite;
        private cursors: Phaser.CursorKeys;

        private blueBalls: Phaser.Group;
        private fireBalls: Phaser.Group;
        private lasers: Phaser.Group;
        private enemies: Phaser.Group;

        private sfx: Phaser.Sound;
        private sfx2: Phaser.Sound;
        private sfx3: Phaser.Sound;
        private sfx4: Phaser.Sound;
        private expRed: Phaser.Sprite;
        private expBlue: Phaser.Sprite;
        private scoreText: Phaser.Text;
        private winText: Phaser.Text;
        private levelComplete: Phaser.Text;
        private remLives: Phaser.Text;
        private score: number = 10;
        private nextLevel: LabeledButton;
        private retryButton: LabeledButton;
        private powerup: Phaser.Sprite;
        private levels: number;
        private lives: number;
        //private gameStartText: Phaser.Text;
        constructor() {
            super();
        }
        public init(): void {
            //
        }
        public preload(): void {
            //
        }
        public render(): void {
           // this.game.debug.spriteBounds(this.playerShip);
        }
        public create(): void {
            super.create();
            //The Background
            this.camera.flash(0, 1000);
            this.game.add.image(0, 0, Images.gameBG);
            //SpaceShip config
            /*this.playerShip = new Spaceship(this.game, this.game.world.centerX, this.game.world.centerY, Images.playerShip);
            this.game.add.existing(this.playerShip);*/
            this.lives = Save.Game.getInstance().lives;
            this.levels = Save.Game.getInstance().level;
            this.playerShip = this.game.add.sprite(this.game.width / 2, this.game.height / 2, Images.playerShip, 60);
            this.playerShip.anchor.setTo(0.5, 0.5);
            this.playerShip.scale.setTo(0.8, 0.8);
            this.game.physics.enable(this.playerShip, Phaser.Physics.ARCADE);
            this.playerShip.body.angularDrag = 800;
            this.playerShip.body.drag.set(1550);
            this.playerShip.body.maxAngular = 200;
            this.playerShip.body.maxVelocity.set(900);
            this.playerShip.body.collideWorldBounds = true;
            //Fireball config
            this.fireBalls = this.game.add.group();
            this.fireBalls.enableBody = true;
            this.fireBalls.physicsBodyType = Phaser.Physics.ARCADE;
            this.fireBalls.createMultiple(10, Images.redBall);
            this.fireBalls.createMultiple(10, Images.blueBall);
            this.fireBalls.setAll('checkWorldBounds', true);
            this.fireBalls.setAll('outOfBoundsKill', true);
            //Adding the sound effects
            this.sfx = this.game.add.audio(Sounds.Explosion);
            this.sfx2 = this.game.add.audio(Sounds.Fireball);
            this.sfx3 = this.game.add.audio(Sounds.playerDeath);
            this.sfx4 = this.game.add.audio(Sounds.inLevel);
            this.sfx.addMarker('explosion', 0, 1, 0.15, false);
            this.sfx2.addMarker('fireball', 0, 1, 0.3, false);
            this.sfx3.addMarker('playerExpSFX', 0.2, 1, 0.5, false);
            this.sfx4.addMarker('inLevel', 0, 65, 0.7, true);
            this.sfx4.play('inLevel');
            //
            this.enemies = this.game.add.group();
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
            //
            this.cursors = this.game.input.keyboard.createCursorKeys();
            //
            let myEnemy: Phaser.Sprite;

            myEnemy = this.enemies.create(100, 100, Images.enemyBlue);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);

            myEnemy = this.enemies.create(700, 500, Images.enemyBlue);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);

            myEnemy = this.enemies.create(100, 500, Images.enemyRed);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);

            myEnemy = this.enemies.create(700, 100, Images.enemyRed);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);
            //
            this.lasers = this.game.add.group();
            this.lasers.enableBody = true;
            this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
            this.lasers.setAll('checkWorldBounds', true);
            this.lasers.setAll('outOfBoundsKill', true);
            //
            this.enemies.forEachAlive((enemy: Phaser.Sprite) => {
                    let textureName: string = (enemy.frameName.indexOf(Images.enemyBlue) !== -1) ? Images.laserBlue : Images.laserRed;
                    this.lasers.create(enemy.x, enemy.y, textureName);
                }
                , this);
            //Adding the texts
            this.levelComplete = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'LEVEL COMPLETED!', {font: '48px Papyrus', fill: '#ff0000', fontStyle: 'bold'});
            this.levelComplete.anchor.set(0.5);
            this.levelComplete.visible = false;
            this.score = 10;
            this.scoreText = this.game.add.text(16, 16, 'ENEMIES LEFT: 10', {font: '24px Times New Roman', fill: '#ff0000'});
            this.scoreText.inputEnabled = true;
            this.winText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Game Over!', {font: '48px Times New Roman', fill: '#ff0000'});
            this.winText.anchor.set(0.5);
            this.winText.inputEnabled = true;
            this.winText.visible = false;
            this.remLives = this.game.add.text(675, 16, 'LIVES: ' + Save.Game.getInstance().lives.valueOf(), {font: '24px Times New Roman', fill: '#ff0000'});
            let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};
            this.nextLevel = new LabeledButton(this.game, this.game.world.centerX, this.game.world.centerY + 200, 'Next Level', textStyle, this.next, this, 300, 100);
            this.nextLevel.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            this.nextLevel.scale.set(.7);
            this.nextLevel.visible = false;
            this.retryButton = new LabeledButton(this.game, this.game.world.centerX - 125, this.game.world.centerY + 200, 'RETRY', textStyle, this.restart, this, 300, 100);
            this.retryButton.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            this.retryButton.scale.set(.7);
            this.retryButton.visible = false;
            this.backBtn = new LabeledButton(this.game, this.game.world.centerX + 125, this.game.world.centerY + 200, 'RETURN', textStyle, this.return, this, 300, 100);
            this.backBtn.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            this.backBtn.scale.set(.7);
            this.backBtn.visible = false;
            /*this.gameStartText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'GET READY!', {font: '48px Times New Roman', fill: '#ff0000'});
            this.gameStartText.anchor.set(0.5);
            this.game.time.events.add(2000, function(): void {
                this.gameStartText.visible = false;
            }, this);*/
           // this.nextLevel.exists = false;
        }
        public update(): void {
            if (this.enemies.countDead() === 10) {
                //this.game.paused = true;
                this.levelComplete.visible = true;
                this.lasers.destroy();
                //this.nextLevel.exists = true;
                this.nextLevel.visible = true;
            }
            this.lasers.forEachAlive((laser: Phaser.Sprite) => {
                this.game.physics.arcade.moveToObject(laser, this.playerShip, 75);
                laser.rotation = this.game.physics.arcade.angleToXY(laser, this.playerShip.x, this.playerShip.y, true);
            }, this);
            //
            if (this.cursors.down.isDown) {
                this.playerShip.rotation = this.game.physics.arcade.angleToPointer(this.playerShip);
            } else {
                let distance_to_mouse: number = Phaser.Math.distance(this.game.input.activePointer.x, this.game.input.activePointer.y, this.playerShip.x, this.playerShip.y);
                if (distance_to_mouse > 60) {
                    this.playerShip.rotation = this.game.physics.arcade.moveToPointer(this.playerShip, 60, this.game.input.activePointer, 500);
                } else {
                    this.playerShip.rotation = this.game.physics.arcade.angleToPointer(this.playerShip);
                }
            }
            if (this.game.input.activePointer.leftButton.isDown) {
                this.fire(Images.redBall);
            }
            if (this.game.input.activePointer.rightButton.isDown) {
                this.fire(Images.blueBall);
            }
            this.game.physics.arcade.overlap(this.fireBalls, this.enemies, this.collisionHandler, null, this);

            this.lasers.forEachAlive((laser: Phaser.Sprite) => {
                this.game.physics.arcade.collide(laser, this.playerShip, this.col3, null, this);
            }, this);
            this.game.physics.arcade.collide(this.playerShip, this.powerup, this.powerK, null, this);
        }
        public fire(texture: string): void {
            if (this.game.time.now > this.nextFire && this.fireBalls.countDead() > 0) {
                this.sfx2.play('fireball');
                this.nextFire = this.game.time.now + this.fireRate;
                let ball: Phaser.Sprite = this.fireBalls.getFirstDead(undefined, undefined, undefined, texture);
                ball.reset(this.playerShip.x, this.playerShip.y);
                ball.rotation = this.game.physics.arcade.angleToPointer(ball);
                this.game.physics.arcade.moveToPointer(ball, 1000);
            }
        }
        public collisionHandler(fireball: Phaser.Sprite, enemy: Phaser.Sprite): void {
            if (((enemy.key as string).toLowerCase().indexOf('red') !== -1 && (fireball.key as string).indexOf('blue') !== -1) ||
                ((enemy.key as string).toLowerCase().indexOf('blue') !== -1 && (fireball.key as string).indexOf('red') !== -1)
            ) {
                return;
            }
            if ((enemy.key as string).toLowerCase().indexOf('red') !== -1) {
                let expRed: Phaser.Sprite = this.game.add.sprite(enemy.x - 8, enemy.y - 8, GFX.redExp);
                expRed.anchor.set(0.5);
                expRed.scale.set(2);
                expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
                expRed.animations.play('expRed', 8, false, true);
            } else if ((enemy.key as string).toLowerCase().indexOf('blue') !== -1) {
                let expBlue: Phaser.Sprite = this.game.add.sprite(enemy.x - 8, enemy.y - 8, GFX.blueExp);
                expBlue.anchor.set(0.5);
                expBlue.scale.set(2);
                expBlue.animations.add('expBlue', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
                expBlue.animations.play('expBlue', 8, false, true);
            }
            this.sfx.play('explosion');
            enemy.kill();
            fireball.kill();
            this.score --;
            this.scoreText.text = 'ENEMIES LEFT: ' + this.score.valueOf();
            this.winText.text = 'Game Over!';
            //Adding more enemies as they die
            if (this.enemies.countDead() === 5) {
                this.powerUp();
            }
            if (this.enemies.countLiving() < 3 && this.enemies.countDead() < 8) {
                let x: number = -1;
                let y: number;
                while (true) {
                    x = this.game.width * 0.1 + Math.random() * this.game.width * 0.8;
                    y = this.game.height * 0.1 + Math.random() * this.game.height * 0.8;
                    let offsetX: number = this.playerShip.x - x;
                    let offsetY: number = this.playerShip.y - y;
                    let distance: number = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
                    console.log(distance);
                    if (distance > 100) {
                        break;
                    }
                }
                //
                if (this.enemies.countDead() % 2 === 0) {
                    enemy = this.enemies.create(x, y, Images.enemyRed);
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                    this.lasers.create(enemy.x, enemy.y, Images.laserRed);
                } else {
                    enemy = this.enemies.create(x, y, Images.enemyBlue);
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                    this.lasers.create(enemy.x, enemy.y, Images.laserBlue);
                }
                /*let rand: number = Math.random();
                while (Math.abs(Math.random() * 600 - this.playerShip.y) < 100) {
                    rand = Math.random();
                }
                if (rand > 0.3 && rand < 0.7) {
                    enemy = this.enemies.create( 100, Math.random() * 600, Images.enemyBlue);
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                    this.lasers.create(enemy.x, enemy.y, Images.laserBlue);
                } else if (rand > 0.7) {
                    enemy = this.enemies.create( 700, Math.random() * 600, Images.enemyRed);
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                    this.lasers.create(enemy.x, enemy.y, Images.laserRed);
                } else {
                    enemy = this.enemies.create( 400, Math.random() * 600, Images.enemyRed);
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                    this.lasers.create(enemy.x, enemy.y, Images.laserRed);
                }*/
            }
        }
        public col3(laser: Phaser.Sprite, playerShip: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(playerShip.x - 8, playerShip.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.scale.set(2.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.game.camera.shake(0.005, 250);
            this.sfx3.play('playerExpSFX');
            laser.kill();
            playerShip.kill();
            Save.Game.getInstance().lives --;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.lasers.destroy();
            this.fireBalls.destroy();
            this.gameOver();
            //Lowering the tank health every time it gets hit, 3 healths total. Game over when 0
        }
        public gameOver(): void {
            //this.game.paused = true;
            if (Save.Game.getInstance().lives === 0) {
                this.winText.visible = true;
                this.backBtn.position.set(this.game.world.centerX, this.game.world.centerY + 200);
                this.backBtn.visible = true;
            } else {
                this.winText.visible = true;
                this.retryButton.visible = true;
                this.backBtn.visible = true;
            }
            //Lowering the tank health every time it gets hit, 3 healths total. Game over when 0
        }
        public next(): void {
            this.sfx4.stop();
            //this.game.paused = false;
            console.log(Save.Game.getInstance().level);
            Save.Game.getInstance().level ++;
            this.game.camera.fade(0, 1000);
            this.game.camera.onFadeComplete.add(this.fadeComplete, this);
        }
        public fadeComplete(): void {
            this.game.state.start('Levelselect', true, false);
        }
        public restart(): void {
            this.sfx4.stop();
            this.game.state.restart(true);
        }
        public powerUp(): void {
            this.powerup = this.game.add.sprite(Math.random() * 700, Math.random() * 500, GFX.powerupAnim);
            this.powerup.anchor.set(0.5);
            this.game.physics.enable(this.powerup, Phaser.Physics.ARCADE);
            this.powerup.scale.set(2);
            this.powerup.animations.add('powerUp', [0, 1, 2, 3, 4, 5], 10, true);
            this.powerup.animations.play('powerUp', 10, true);
        }
        public powerK(playerShip: Phaser.Sprite, powerUp: Phaser.Sprite): void {
            this.sfx.play('explosion', undefined, 2);
            this.game.camera.shake(0.035, 250);
            this.lasers.removeBetween(0, 4, true);
            powerUp.kill();
            this.fireRate -= 350;
        }
        /**
         * Called every time the rotation or game size has changed.
         * Rescales and repositions the objects.
         */
        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;
            this.text.alignIn(this.world.bounds, Phaser.CENTER);
        }
        public shutdown(): void {
            super.shutdown();
            this.background = null;
            this.text = null;
        }
        public return(): void {
            this.sfx4.stop();
            Save.Game.getInstance().level = 0;
            Save.Game.getInstance().lives = 5;
            this.game.state.start('Menu', true, false);
        }
    }
}
