module BoilerPlate {
    export class Boss extends Phaser.State implements Phaser.State {
        private playerShip: Phaser.Sprite;
        private fireBalls: Phaser.Group;
        private spikes: Phaser.Group;
        private sfx: Phaser.Sound;
        private sfx2: Phaser.Sound;
        private sfx3: Phaser.Sound;
        private sfx4: Phaser.Sound;
        private sfx5: Phaser.Sound;
        private cursors: Phaser.CursorKeys;
        public fireRate: number = 750;
        public bossFire: number = 100;
        public nextFire: number = 0;
        public nextFireB: number = 0;
        public enemyBoss: Phaser.Sprite;
        public bossShield1: Phaser.Sprite;
        public bossShield2: Phaser.Sprite;
        public bossShield3: Phaser.Sprite;
        public bossShield4: Phaser.Sprite;
        public bossShield5: Phaser.Sprite;
        public bossShield6: Phaser.Sprite;
        public shields: Phaser.Group;
        private endText: Phaser.Text;
        private winText: Phaser.Text;
        private bullets: Phaser.Group;
        private retryButton: LabeledButton;
        private nextLevel: LabeledButton;
        private backBtn: LabeledButton;
        private remLives: Phaser.Text;
        constructor() {
            super();
        }
        public preload(): void {
            //
        }
        public create(): void {
            super.create();
            this.camera.flash(0, 1000);
            this.game.add.image(0, 0, Images.gameBG2);
            //SpaceShip config
            this.playerShip = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 200, Images.playerShip, 60);
            this.game.add.existing(this.playerShip);
            this.playerShip.anchor.setTo(0.5, 0.5);
            this.playerShip.scale.setTo(0.8, 0.8);
            this.playerShip.physicsEnabled = true;
            this.game.physics.enable(this.playerShip, Phaser.Physics.ARCADE);
            this.playerShip.body.angularDrag = 800;
            this.playerShip.body.drag.set(1550);
            this.playerShip.body.maxAngular = 200;
            this.playerShip.body.maxVelocity.set(900);
            this.playerShip.body.collideWorldBounds = true;
            //Boss config
            this.enemyBoss = this.game.add.sprite(this.game.width / 2, this.game.height / 2 - 200, Images.enemyBoss, 60);
            this.game.add.existing(this.enemyBoss);
            this.enemyBoss.anchor.set(0.5);
            this.enemyBoss.scale.setTo(1.2, 1.2);
            this.enemyBoss.physicsEnabled = true;
            this.game.physics.enable(this.enemyBoss, Phaser.Physics.ARCADE);
            this.enemyBoss.body.setCircle(45);
            //Boss Shields
            this.shields = this.game.add.group();
            this.shields.enableBody = true;
            this.shields.physicsBodyType = Phaser.Physics.ARCADE;
            let bossShield: Phaser.Sprite;
            bossShield = this.shields.create(this.game.width / 2, this.game.height / 2 - 200, Images.bossShield3, 60);
            bossShield.anchor.set(0.5);
            bossShield.scale.set(1.125);
            bossShield.body.immovable = true;
            bossShield.body.setCircle(45);
            this.bossShield3 = bossShield;
            //
            bossShield = this.shields.create(this.game.width / 2, this.game.height / 2 - 200, Images.bossShield6, 60);
            bossShield.anchor.set(0.5);
            bossShield.body.immovable = true;
            bossShield.body.setCircle(45);
            this.bossShield6 = bossShield;
            //
            bossShield = this.shields.create(this.game.width / 2, this.game.height / 2 - 200, Images.bossShield2, 60);
            bossShield.anchor.set(0.5);
            bossShield.scale.set(1.1875);
            bossShield.body.immovable = true;
            bossShield.body.setCircle(45);
            this.bossShield2 = bossShield;
            //
            bossShield = this.shields.create(this.game.width / 2, this.game.height / 2 - 200, Images.bossShield5, 60);
            bossShield.anchor.set(0.5);
            bossShield.body.immovable = true;
            bossShield.body.setCircle(45);
            this.bossShield5 = bossShield;
            //
            bossShield = this.shields.create(this.game.width / 2, this.game.height / 2 - 200, Images.bossShield1, 60);
            bossShield.anchor.set(0.5);
            bossShield.scale.set(1.25);
            bossShield.body.immovable = true;
            bossShield.body.setCircle(140, - 75, - 75);
            this.bossShield1 = bossShield;
            //
            bossShield = this.shields.create(this.game.width / 2, this.game.height / 2 - 200, Images.bossShield4, 60);
            bossShield.anchor.set(0.5);
            bossShield.body.immovable = true;
            bossShield.body.setCircle(120, -60, -60);
            this.bossShield4 = bossShield;
            //Boss Bullets
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(20, Images.bossBullet);
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);
            //Fireball config
            this.fireBalls = this.game.add.group();
            this.fireBalls.enableBody = true;
            this.fireBalls.physicsBodyType = Phaser.Physics.ARCADE;
            this.fireBalls.createMultiple(10, Images.redBall);
            this.fireBalls.createMultiple(10, Images.blueBall);
            this.fireBalls.setAll('checkWorldBounds', true);
            this.fireBalls.setAll('outOfBoundsKill', true);
            //Spikes config
            this.spikes = this.game.add.group();
            this.spikes.enableBody = true;
            this.spikes.physicsBodyType = Phaser.Physics.ARCADE;
            this.spikes.setAll('checkWorldBounds', true);
            let spike: Phaser.Sprite;
            spike = this.spikes.create(this.game.world.centerX / 4, this.game.world.centerY / 4, Images.Spike, 30);
            spike.anchor.set(0.5);
            spike.body.collideWorldBounds = true;
            spike.body.gravity.y = 150;
            spike.body.bounce.y = 1;
            //
            spike = this.spikes.create(700, this.game.world.centerY / 4, Images.Spike, 30);
            spike.anchor.set(0.5);
            spike.body.collideWorldBounds = true;
            spike.body.gravity.y = 150;
            spike.body.bounce.y = 1;
            //Adding the sound effects
            this.sfx = this.game.add.audio(Sounds.Explosion);
            this.sfx2 = this.game.add.audio(Sounds.Fireball);
            this.sfx3 = this.game.add.audio(Sounds.playerDeath);
            this.sfx4 = this.game.add.audio(Sounds.bossBullet);
            this.sfx.addMarker('explosion', 0, 1, 0.15, false);
            this.sfx2.addMarker('fireball', 0, 1, 0.3, false);
            this.sfx3.addMarker('playerExpSFX', 0.2, 1, 0.5, false);
            this.sfx4.addMarker('bossBullet', 0, 1, 0.5, false);
            this.sfx5 = this.game.add.audio(Sounds.Boss);
            this.sfx5.addMarker('Boss', 0, 73, 0.7, true);
            this.sfx5.play('Boss');
            //
            this.cursors = this.game.input.keyboard.createCursorKeys();
            //
            this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'YOU DIED!', {font: '48px Papyrus', fill: '#ff0000', fontStyle: 'bold'});
            this.endText.anchor.set(0.5);
            this.endText.visible = false;
            this.winText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'YOU WON!', {font: '48px Papyrus', fill: '#ff0000', fontStyle: 'bold'});
            this.winText.anchor.set(0.5);
            this.winText.visible = false;
            this.remLives = this.game.add.text(675, 16, 'LIVES: ' + Save.Game.getInstance().lives.valueOf(), {font: '24px Times New Roman', fill: '#ff0000'});
            let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};
            this.retryButton = new LabeledButton(this.game, this.game.world.centerX - 125, this.game.world.centerY + 200, 'RETRY', textStyle, this.restart, this, 300, 100);
            this.nextLevel = new LabeledButton(this.game, this.game.world.centerX, this.game.world.centerY + 200, 'Next Level', textStyle, this.next, this, 300, 100);
            this.nextLevel.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            this.nextLevel.scale.set(.7);
            this.nextLevel.visible = false;
            this.retryButton.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            this.retryButton.scale.set(.7);
            this.retryButton.visible = false;
            this.backBtn = new LabeledButton(this.game, this.game.world.centerX + 125, this.game.world.centerY + 200, 'RETURN', textStyle, this.return, this, 300, 100);
            this.backBtn.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            this.backBtn.scale.set(.7);
            this.backBtn.visible = false;
        }
        public update(): void {
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
            /*this.shields.forEachAlive((bossShield: Phaser.Sprite) => {
                this.game.physics.arcade.collide(bossShield, this.playerShip, this.collisionHandler, null, this);
            }, this);*/
            this.game.physics.arcade.collide(this.shields, this.playerShip, this.collisionHandler, null, this);
            this.game.physics.arcade.overlap(this.fireBalls, this.shields, this.collisionHandler2, null, this);
            this.game.physics.arcade.collide(this.spikes, this.playerShip, this.spikeCollision, null, this);
            this.game.physics.arcade.collide(this.bullets, this.playerShip, this.bulletCollision, null, this);
            if (this.shields.countDead() === 6) {
                this.game.physics.arcade.collide(this.enemyBoss, this.fireBalls, this.collisionHandler3, null, this);
            }
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
        public collisionHandler(playerShip: Phaser.Sprite): void {
            let explosion: Phaser.Sprite = this.game.add.sprite(playerShip.x - 8, playerShip.y - 8, GFX.redExp);
            explosion.anchor.set(0.5);
            explosion.animations.add(GFX.redExp, [0, 2, 4, 2, 0, 1]);
            explosion.animations.play(GFX.redExp, 10, false);
            this.sfx3.play('playerExpSFX');
            playerShip.kill();
            Save.Game.getInstance().lives --;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy();
            //this.game.paused = true;
            this.gameOver();
        }
        public collisionHandler2(fireball: Phaser.Sprite, rings: Phaser.Sprite): void {
            rings = this.shields.getFirstAlive();
            let index: number = this.shields.children.indexOf(rings);
            // 0 === blue, 1 === red;
            let color: number = index  % 2;
            let fireBallColor: number = ((fireball.key as string).indexOf('blue') !== -1) ? 0 : 1;

            if (color === fireBallColor) {
                //Hit!
                rings.body.setCircle(1);
                this.sfx4.play('bossBullet');
                rings.kill();
                this.bossBullet();
                /////// TRY 1
                /*this.bullets.forEachAlive((bullet: Phaser.Sprite) => {
                    for (let i: number = 1; i < 11; i++) {
                        bullet.reset(this.enemyBoss.x, this.enemyBoss.y);
                        let rand: number = (-1 + (Math.random() * 2)) * 100;
                        this.game.physics.arcade.moveToXY(bullet, this.enemyBoss.x + rand, this.game.world.centerY + 300, 100);
                    }
                }, this);*/
                //////// TRY 2
                /*if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                    this.nextFireB = this.game.time.now + this.bossFire;
                    let bullet: Phaser.Sprite = this.bullets.getFirstDead(undefined, undefined, undefined, Images.bossBullet);
                    for (let i: number = 1; i < 11; i++) {
                        bullet.reset(this.enemyBoss.x, this.enemyBoss.y);
                        let rand: number = (-1 + (Math.random() * 2)) * 100;
                        this.game.physics.arcade.moveToXY(bullet, this.enemyBoss.x + rand, this.game.world.centerY + 300, 100);
                    }*/
                /////// TRY 3
                   /*bullet.reset(this.enemyBoss.x, this.enemyBoss.y);
                bullet.rotation = this.game.physics.arcade.angleToPointer(bullet);
                this.game.physics.arcade.moveToPointer(bullet, 1000);*/
            }
            fireball.kill();
        }
        public collisionHandler3(enemyBoss: Phaser.Sprite, fireball: Phaser.Sprite): void {
            this.game.camera.shake(0.05, 250);
            this.game.time.slowMotion = 2;
            let explosion: Phaser.Sprite = this.game.add.sprite(enemyBoss.x, enemyBoss.y, GFX.playerExp);
            explosion.anchor.set(0.5);
            explosion.scale.set(2.5);
            explosion.animations.add(GFX.playerExp, [0, 1, 2, 3, 4, 5]);
            explosion.animations.play(GFX.playerExp, 10, false, true);
            this.sfx3.play('playerExpSFX');
            enemyBoss.kill();
            fireball.kill();
            Save.Game.getInstance().lives ++;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.winText.visible = true;
            this.spikes.destroy(true);
            this.nextLevel.visible = true;
        }
        public bossBullet(): void {
            this.bullets.forEach((bullet: Phaser.Sprite) => {
                for (let i: number = 1; i < 21; i++) {
                    bullet.reset(this.enemyBoss.x, this.enemyBoss.y);
                    bullet.body.setCircle(8);
                    let rand: number = (-1 + (Math.random() * 2)) * 500;
                    this.game.physics.arcade.moveToXY(bullet, this.playerShip.x + rand, this.playerShip.y, 500);
                }
            }, this);
        }
        public spikeCollision (spike: Phaser.Sprite, playerShip: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(playerShip.x - 8, playerShip.y - 8, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.scale.set(2.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.game.camera.shake(0.005, 250);
            this.sfx3.play('playerExpSFX');
            //this.game.paused = true;
            spike.kill();
            playerShip.kill();
            Save.Game.getInstance().lives --;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy(true);
            this.gameOver();
        }
        public bulletCollision (bullet: Phaser.Sprite, playerShip: Phaser.Sprite): void {
            let expRed: Phaser.Sprite = this.game.add.sprite(playerShip.x, playerShip.y, GFX.redExp);
            expRed.anchor.set(0.5);
            expRed.scale.set(2.5);
            expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
            expRed.animations.play('expRed', 8, false, true);
            this.game.camera.shake(0.005, 250);
            this.sfx3.play('playerExpSFX');
            //this.game.paused = true;
            bullet.kill();
            playerShip.kill();
            Save.Game.getInstance().lives --;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy(true);
            this.gameOver();
        }
        public restart(): void {
            this.sfx5.stop();
            this.game.state.restart(true);
        }
        public next(): void {
            this.sfx5.stop();
            this.game.time.slowMotion = 1;
            //this.game.paused = false;
            console.log(Save.Game.getInstance().level);
            Save.Game.getInstance().level ++;
            this.game.camera.fade(0, 1000);
            this.game.camera.onFadeComplete.add(this.fadeComplete, this);
        }
        public fadeComplete(): void {
            this.game.state.start('Levelselect', true, false);
        }
        public gameOver(): void {
            //this.game.paused = true;
            if (Save.Game.getInstance().lives === 0) {
                this.endText.visible = true;
                this.backBtn.position.set(this.game.world.centerX, this.game.world.centerY + 200);
                this.backBtn.visible = true;
            } else {
                this.endText.visible = true;
                this.retryButton.visible = true;
                this.backBtn.visible = true;
            }
            //Lowering the tank health every time it gets hit, 3 healths total. Game over when 0
        }
        public return(): void {
            this.sfx5.stop();
            Save.Game.getInstance().level = 0;
            Save.Game.getInstance().lives = 5;
            this.game.state.start('Menu', true, false);
        }
    }
}
