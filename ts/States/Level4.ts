module BoilerPlate {
    export class Level4 extends Phaser.State implements Fabrique.IState {
        public static pause: boolean = false;
        public name: string;
        public game: Fabrique.IGame;
        //
        private background: Phaser.Image;
        private text: Label;
        private backBtn: LabeledButton;
        private playerShip: Phaser.Sprite;
        //
        public fireRate: number = 750;
        public nextFire: number = 0;
        private cursors: Phaser.CursorKeys;
        //
        private fireBalls: Phaser.Group;
        private spikes: Phaser.Group;
        private l4enemies: Phaser.Group;
        //
        private sfx: Phaser.Sound;
        private sfx2: Phaser.Sound;
        private sfx3: Phaser.Sound;
        private sfx4: Phaser.Sound;
        private scoreText: Phaser.Text;
        private winText: Phaser.Text;
        private levelComplete: Phaser.Text;
        private score: number = 17;
        private nextLevel: LabeledButton;
        private retryButton: LabeledButton;
        private timer: Phaser.Timer;
        private milliseconds: number = 0;
        private seconds: number = 0;
        private minutes: number = 0;
        private remLives: Phaser.Text;

        constructor() {
            super();
        }

        public init(): void {
            // this.game.world.removeAll();
            //Play background music
            //SoundManager.getInstance().playMusic(Sounds.GameMusic);
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
            this.sfx.addMarker('explosion', 0, 1, 0.15, false);
            this.sfx2.addMarker('fireball', 0, 1, 0.3, false);
            this.sfx3.addMarker('playerExpSFX', 0.2, 1, 0.5, false);
            this.sfx4 = this.game.add.audio(Sounds.inLevel);
            this.sfx4.addMarker('inLevel', 0, 65, 0.7, true);
            this.sfx4.play('inLevel');
            //
            this.l4enemies = this.game.add.group();
            this.l4enemies.enableBody = true;
            this.l4enemies.physicsBodyType = Phaser.Physics.ARCADE;
            //
            this.cursors = this.game.input.keyboard.createCursorKeys();
            //
            //Spikes config
            this.spikes = this.game.add.group();
            this.spikes.enableBody = true;
            this.spikes.physicsBodyType = Phaser.Physics.ARCADE;
            this.spikes.setAll('checkWorldBounds', true);
            let spike: Phaser.Sprite;
            spike = this.spikes.create(this.game.world.centerX / 4, this.game.world.centerY / 4, Images.Spike, 30);
            spike.anchor.set(0.5);
            spike.body.collideWorldBounds = true;
            spike.body.gravity.y = 200;
            spike.body.bounce.y = 1;
            //
            spike = this.spikes.create(700, this.game.world.centerY / 4, Images.Spike, 30);
            spike.anchor.set(0.5);
            spike.body.collideWorldBounds = true;
            spike.body.gravity.y = 200;
            spike.body.bounce.y = 1;
            //
            let myEnemy: Phaser.Sprite;

            myEnemy = this.l4enemies.create(100, 100, Images.l4enemy);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);
            //
            myEnemy = this.l4enemies.create(100, 500, Images.l4enemy);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);
            //
            myEnemy = this.l4enemies.create(700, 100, Images.l4enemy);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);
            //
            myEnemy = this.l4enemies.create(700, 500, Images.l4enemy);
            myEnemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(myEnemy, Phaser.Physics.ARCADE);
            //Adding the texts
            this.levelComplete = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'LEVEL COMPLETED!', {font: '48px Papyrus', fill: '#ff0000', fontStyle: 'bold'});
            this.levelComplete.anchor.set(0.5);
            this.levelComplete.visible = false;
            this.score = 17;
            this.scoreText = this.game.add.text(16, 16, 'ENEMIES LEFT: 17', {font: '24px Times New Roman', fill: '#ff0000'});
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
        }

        public update(): void {
            this.l4enemies.forEach((enemy: Phaser.Sprite) => {
                if (this.l4enemies.countDead() < 10) {
                    this.game.physics.arcade.moveToObject(enemy, this.playerShip, 100);
                } else {
                    this.game.physics.arcade.moveToObject(enemy, this.playerShip, 175);
                }
                enemy.rotation = this.game.physics.arcade.angleToXY(enemy, this.playerShip.x, this.playerShip.y, true);
            }, this);
            //
            this.updateTimer();
            if (this.l4enemies.countDead() === 17) {
                this.game.paused = true;
                this.levelComplete.visible = true;
                //this.nextLevel.exists = true;
                this.nextLevel.visible = true;
            }
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
            this.game.physics.arcade.overlap(this.fireBalls, this.l4enemies, this.collisionHandler, null, this);
            this.game.physics.arcade.collide(this.spikes, this.playerShip, this.spikeCollision, null, this);
            this.game.physics.arcade.collide(this.l4enemies, this.playerShip, this.enemyCollision, null, this);
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
            let expRed: Phaser.Sprite = this.game.add.sprite(enemy.x - 8, enemy.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.scale.set(1.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.game.camera.shake(0.005, 250);
            this.sfx.play('explosion');
            enemy.kill();
            fireball.kill();
            this.score--;
            this.scoreText.text = 'ENEMIES LEFT: ' + this.score.valueOf();
            this.winText.text = 'Game Over!';
            //Adding more enemies as they die
            if (this.l4enemies.countLiving() < 3 && this.l4enemies.countDead() < 15) {
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
                //
                enemy = this.l4enemies.create(x, y, Images.l4enemy);
                enemy.anchor.setTo(0.5, 0.5);
                this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                /*let rand: number = Math.random();
                while (Math.abs(Math.random() * 600 - this.playerShip.y) < 100) {
                    rand = Math.random();
                }
                if (rand > 0.3 && rand < 0.7) {
                    enemy = this.l4enemies.create(100, Math.random() * 600, Images.l4enemy);
                    /!*while (Phaser.Math.distance(enemy.x, enemy.y, this.playerShip.x, this.playerShip.y) < 25) {
                        enemy.kill();
                    }*!/
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                } else if (rand > 0.7) {
                    enemy = this.l4enemies.create(700, Math.random() * 600, Images.l4enemy);
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                } else {
                    enemy = this.l4enemies.create(400, Math.random() * 600, Images.l4enemy);
                    enemy.anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                }*/
            }
        }

        public spikeCollision(spike: Phaser.Sprite, playerShip: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(spike.x - 8, spike.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.sfx3.play('playerExpSFX');
            //this.game.paused = true;
            spike.kill();
            playerShip.kill();
            this.l4enemies.destroy();
            Save.Game.getInstance().lives--;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy(true);
            this.gameOver();
        }

        public enemyCollision(enemy: Phaser.Sprite, player: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(enemy.x - 8, enemy.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.sfx3.play('playerExpSFX');
            //this.game.paused = true;
            enemy.kill();
            player.kill();
            this.l4enemies.destroy();
            Save.Game.getInstance().lives--;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy(true);
            this.gameOver();
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

        /**
         * Called every time the rotation or game size has changed.
         * Rescales and repositions the objects.
         */
        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;
            this.text.alignIn(this.world.bounds, Phaser.CENTER);
            /*this.backBtn.x = this.game.width / 2;
            this.backBtn.y = this.text.y + this.text.height + this.backBtn.height;*/
        }

        public shutdown(): void {
            super.shutdown();
            this.background = null;
            this.text = null;
        }

        public updateTimer(): void {
            this.minutes = Math.floor(this.game.time.time / 60000) % 60;
            this.seconds = Math.floor(this.game.time.time / 1000) % 60;
            this.milliseconds = Math.floor(this.game.time.time) % 100;
        }

        public return(): void {
            this.sfx4.stop();
            Save.Game.getInstance().level = 0;
            Save.Game.getInstance().lives = 5;
            this.game.state.start('Menu', true, false);
        }
    }
}
