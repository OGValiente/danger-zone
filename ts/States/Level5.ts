module BoilerPlate {
    export class Level5 extends Phaser.State implements Fabrique.IState {
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
        private l5enemies: Phaser.Group;
        private l5enemies2: Phaser.Group;
        private l5enemies3: Phaser.Group;
        //
        private sfx: Phaser.Sound;
        private sfx2: Phaser.Sound;
        private sfx3: Phaser.Sound;
        private winText: Phaser.Text;
        private levelComplete: Phaser.Text;
        private nextLevel: LabeledButton;
        private retryButton: LabeledButton;
        private timer: Phaser.Timer;
        private milliseconds: number = 0;
        private seconds: number = 0;
        private minutes: number = 0;
        private remLives: Phaser.Text;
        private bodytest: Phaser.Sprite;
        private sfx4: Phaser.Sound;
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
            this.l5enemies = this.game.add.group();
            this.l5enemies.enableBody = true;
            this.l5enemies.physicsBodyType = Phaser.Physics.ARCADE;
            this.l5enemies2 = this.game.add.group();
            this.l5enemies2.enableBody = true;
            this.l5enemies2.physicsBodyType = Phaser.Physics.ARCADE;
            this.l5enemies3 = this.game.add.group();
            this.l5enemies3.enableBody = true;
            this.l5enemies3.physicsBodyType = Phaser.Physics.ARCADE;
            //
            this.cursors = this.game.input.keyboard.createCursorKeys();
            //
            let myEnemy: Phaser.Sprite;

            myEnemy = this.l5enemies.create(100, 100, Images.enemyPlanet);
            myEnemy.anchor.setTo(0.5, 0.5);
            myEnemy.body.collideWorldBounds = true;
            myEnemy.body.bounce.set(1);
            myEnemy.body.velocity.x = 150;
            myEnemy.body.velocity.y = 150;
            myEnemy.scale.set(0.5);
            myEnemy.body.setCircle(65, 92, 92);
            this.bodytest = myEnemy;
            //
            myEnemy = this.l5enemies.create(100, 500, Images.enemyPlanet);
            myEnemy.anchor.setTo(0.5, 0.5);
            myEnemy.body.collideWorldBounds = true;
            myEnemy.body.bounce.set(1);
            myEnemy.body.velocity.x = 150;
            myEnemy.body.velocity.y = 150;
            myEnemy.scale.set(0.5);
            myEnemy.body.setCircle(65, 92, 92);
            //
            myEnemy = this.l5enemies.create(700, 100, Images.enemyPlanet);
            myEnemy.anchor.setTo(0.5, 0.5);
            myEnemy.body.collideWorldBounds = true;
            myEnemy.body.bounce.set(1);
            myEnemy.body.velocity.x = 150;
            myEnemy.body.velocity.y = 150;
            myEnemy.scale.set(0.5);
            myEnemy.body.setCircle(65, 92, 92);
            //
            myEnemy = this.l5enemies.create(700, 500, Images.enemyPlanet);
            myEnemy.anchor.setTo(0.5, 0.5);
            myEnemy.body.collideWorldBounds = true;
            myEnemy.body.bounce.set(1);
            myEnemy.body.velocity.x = 150;
            myEnemy.body.velocity.y = 150;
            myEnemy.scale.set(0.5);
            myEnemy.body.setCircle(65, 92, 92);
            //Adding the texts
            this.levelComplete = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'LEVEL COMPLETED!', {font: '48px Papyrus', fill: '#ff0000', fontStyle: 'bold'});
            this.levelComplete.anchor.set(0.5);
            this.levelComplete.visible = false;
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
            this.updateTimer();
            if (this.l5enemies3.countDead() === 16) {
                this.game.paused = true;
                this.levelComplete.visible = true;
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
            this.game.physics.arcade.collide(this.l5enemies, this.playerShip, this.enemyCollision, null, this);
            this.game.physics.arcade.collide(this.l5enemies2, this.playerShip, this.enemyCollision, null, this);
            this.game.physics.arcade.collide(this.l5enemies3, this.playerShip, this.enemyCollision, null, this);
            this.game.physics.arcade.overlap(this.fireBalls, this.l5enemies, this.crumble, null, this);
            this.game.physics.arcade.overlap(this.fireBalls, this.l5enemies2, this.crumble2, null, this);
            this.game.physics.arcade.overlap(this.fireBalls, this.l5enemies3, this.crumble3, null, this);
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
        public enemyCollision(player: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(player.x - 8, player.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.sfx3.play('playerExpSFX');
            //this.game.paused = true;
            player.kill();
            Save.Game.getInstance().lives --;
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
        public crumble(fireball: Phaser.Sprite, enemy: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(enemy.x - 8, enemy.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.scale.set(1.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.game.camera.shake(0.005, 250);
            this.sfx.play('explosion');
            let x: Phaser.Sprite;
            x = this.l5enemies2.create(enemy.x + 10, enemy.y + 10, Images.enemyPlanet);
            x.scale.set(.3);
            x.anchor.setTo(0.5, 0.5);
            x.body.collideWorldBounds = true;
            x.body.bounce.set(1);
            x.body.velocity.x = 212;
            x.body.velocity.y = 212;
            x.body.setCircle(40, 92, 92);
            //
            x = this.l5enemies2.create(enemy.x - 10, enemy.y - 10, Images.enemyPlanet);
            x.scale.set(.3);
            x.anchor.setTo(0.5, 0.5);
            x.body.collideWorldBounds = true;
            x.body.bounce.set(1);
            x.body.velocity.x = - 212;
            x.body.velocity.y = - 212;
            x.body.setCircle(40, 92, 92);
            enemy.kill();
            fireball.kill();
        }
        public crumble2(fireball: Phaser.Sprite, enemy: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(enemy.x - 8, enemy.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.scale.set(1.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.game.camera.shake(0.005, 250);
            this.sfx.play('explosion');
            let x: Phaser.Sprite;
            x = this.l5enemies3.create(enemy.x + 10, enemy.y + 10, Images.enemyPlanet);
            x.scale.set(.15);
            x.anchor.setTo(0.5, 0.5);
            x.body.collideWorldBounds = true;
            x.body.bounce.set(1);
            x.body.velocity.x = 225;
            x.body.velocity.y = 225;
            x.body.setCircle(20, 92, 92);
            //
            x = this.l5enemies3.create(enemy.x - 10, enemy.y - 10, Images.enemyPlanet);
            x.scale.set(.15);
            x.anchor.setTo(0.5, 0.5);
            x.body.collideWorldBounds = true;
            x.body.bounce.set(1);
            x.body.velocity.x = - 225;
            x.body.velocity.y = - 225;
            x.body.setCircle(20, 92, 92);
            enemy.kill();
            fireball.kill();
        }
        public crumble3(fireball: Phaser.Sprite, enemy: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(enemy.x - 8, enemy.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.scale.set(1.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.game.camera.shake(0.005, 250);
            this.sfx.play('explosion');
            enemy.kill();
            fireball.kill();
        }
    }
}
