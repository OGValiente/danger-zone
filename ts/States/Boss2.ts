module BoilerPlate {
    export class Boss2 extends Phaser.State implements Phaser.State {
        private playerShip: Phaser.Sprite;
        private fireBalls: Phaser.Group;
        private sfx: Phaser.Sound;
        private sfx2: Phaser.Sound;
        private sfx3: Phaser.Sound;
        private sfx4: Phaser.Sound;
        private sfx5: Phaser.Sound;
        private sfx6: Phaser.Sound;
        private cursors: Phaser.CursorKeys;
        public fireRate: number = 750;
        public bossFire: number = 100;
        public nextFire: number = 0;
        public nextFireB: number = 0;
        public enemyBoss2: Phaser.Sprite;
        private endText: Phaser.Text;
        private winText: Phaser.Text;
        private bullets: Phaser.Group;
        private lasers: Phaser.Group;
        private retryButton: LabeledButton;
        private nextLevel: LabeledButton;
        private backBtn: LabeledButton;
        private remLives: Phaser.Text;
        private dangers: Phaser.Group;
        private enemyLaser: Phaser.Sprite;
        private hitCount: number = 0;
        private i: number = 0;
        private k: number = 0;
        private l: number = 0;
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
            this.enemyBoss2 = this.game.add.sprite(this.game.width / 2, 75, Images.enemyBoss2, 60);
            this.game.add.existing(this.enemyBoss2);
            this.enemyBoss2.anchor.set(0.5);
            this.enemyBoss2.physicsEnabled = true;
            this.game.physics.enable(this.enemyBoss2, Phaser.Physics.ARCADE);
            this.enemyBoss2.body.immovable = true;
            //Borders
            this.dangers = this.game.add.group();
            this.dangers.enableBody = true;
            this.dangers.physicsBodyType = Phaser.Physics.ARCADE;
            let danger: Phaser.Sprite;
            danger = this.dangers.create(100, 150, Images.enemyPlanet);
            danger.anchor.setTo(0.5, 0.5);
            danger.body.collideWorldBounds = true;
            danger.scale.set(0.5);
            danger.body.setCircle(45, 92, 92);
            //
            danger = this.dangers.create(700, 150, Images.enemyPlanet);
            danger.anchor.setTo(0.5, 0.5);
            danger.body.collideWorldBounds = true;
            danger.scale.set(0.5);
            danger.body.setCircle(45, 92, 92);
            //Boss Bullets
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(25, Images.bossBullet);
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);
            //Boss Lasers
            this.lasers = this.game.add.group();
            this.lasers.enableBody = true;
            this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
            this.lasers.createMultiple(20, Images.bossLaser);
            this.lasers.setAll('checkWorldBounds', true);
            this.lasers.setAll('outOfBoundsKill', true);
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
            this.sfx4 = this.game.add.audio(Sounds.bossBullet);
            this.sfx5 = this.game.add.audio(Sounds.laserShot);
            this.sfx.addMarker('explosion', 0, 1, 0.15, false);
            this.sfx2.addMarker('fireball', 0, 1, 0.3, false);
            this.sfx3.addMarker('playerExpSFX', 0.2, 1, 0.5, false);
            this.sfx4.addMarker('bossBullet', 0, 1, 0.5, false);
            this.sfx5.addMarker('laserShot', 0 , 1, 0.7, false);
            this.sfx6 = this.game.add.audio(Sounds.inLevel);
            this.sfx6.addMarker('inLevel', 0, 65, 0.7, true);
            this.sfx6.play('inLevel');
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
            this.game.physics.arcade.collide(this.bullets, this.playerShip, this.bulletCollision, null, this);
            this.game.physics.arcade.collide(this.fireBalls, this.enemyBoss2, this.bossCollision, null, this);
            this.game.physics.arcade.collide(this.playerShip, this.enemyBoss2, this.deadCollision, null, this);
            this.game.physics.arcade.collide(this.playerShip, this.lasers, this.laserCollision, null, this);
            this.game.physics.arcade.collide(this.playerShip, this.dangers, this.dangerCollision, null, this);
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
        public bossCollision(boss: Phaser.Sprite, fireball: Phaser.Sprite): void {
            this.game.camera.shake(0.005, 250);
            let explosion: Phaser.Sprite = this.game.add.sprite(fireball.x, fireball.y, GFX.playerExp);
            explosion.anchor.set(0.5);
            explosion.animations.add(GFX.playerExp, [0, 1, 2, 3, 4, 5]);
            explosion.animations.play(GFX.playerExp, 10, false, true);
            this.sfx3.play('playerExpSFX');
            //enemyBoss.kill();
            fireball.kill();
            this.k ++;
            this.bossNextBullet(0);
            this.hitCount ++;
            if (this.hitCount === 5) {
                this.wingame(0);
            }
            if (this.hitCount % 2 === 0) {
                this.bossLaser(0);
            }
        }
        public deadCollision(player: Phaser.Sprite, boss: Phaser.Sprite): void {
            this.game.camera.shake(0.05, 250);
            let explosion: Phaser.Sprite = this.game.add.sprite(boss.x, boss.y, GFX.playerExp);
            explosion.anchor.set(0.5);
            explosion.animations.add(GFX.playerExp, [0, 1, 2, 3, 4, 5]);
            explosion.animations.play(GFX.playerExp, 10, false, true);
            this.sfx3.play('playerExpSFX');
            player.kill();
            Save.Game.getInstance().lives --;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy(true);
            this.gameOver();
        }
        /*private shootAll()
        {
            for (let i = 0; i < 20; i++) {
                this.game.time.events.add(50 * i, this.bossNextBullet, this, i);
            }
        }*/
        public bossNextBullet(x: number): void {
            let bullet: Phaser.Sprite = <Phaser.Sprite>this.bullets.getAt(x);
            bullet.reset(this.enemyBoss2.x, this.enemyBoss2.y + 100);
            bullet.body.setCircle(8);
            /*let rand: number = (-1 + (Math.random() * 2)) * 500;
            this.game.physics.arcade.moveToXY(bullet, this.playerShip.x + rand, this.playerShip.y, 500);*/
            let rand: number = -1 + Math.random() * 10;
            if (this.k % 2 === 0) {
                this.game.physics.arcade.moveToXY(bullet, 100 + this.i + rand, this.game.world.centerY - 60, 750);
                if (x < 24) {
                    this.game.time.events.add(50, this.bossNextBullet, this, x + 1);
                    this.i += 25;
                } else {
                    this.i = 0;
                }
            } else {
                this.game.physics.arcade.moveToXY(bullet, 700 - this.i + rand, this.game.world.centerY - 60, 750);
                if (x < 24) {
                    this.game.time.events.add(50, this.bossNextBullet, this, x + 1);
                    this.i += 25;
                } else {
                    this.i = 0;
                }
            }
        }
        public bossLaser(y: number): void {
            let laser: Phaser.Sprite = <Phaser.Sprite>this.lasers.getAt(y);
            laser.reset(this.enemyBoss2.x, this.enemyBoss2.y + 300);
            laser.physicsEnabled = true;
            this.game.physics.enable(laser, Phaser.Physics.ARCADE);
            laser.body.immovable = true;
            laser.anchor.set(0.5);
            laser.scale.set(0.5);
            laser.lifespan = 1000;
            this.sfx5.play('laserShot');
            this.game.camera.shake(0.005, 350);
            this.game.physics.arcade.angleToXY(laser, 700 - this.l, 300, true);
            if (y < 19) {
                this.game.time.events.add(50, this.bossLaser, this, y + 1);
                this.l += 60;
            } else {
                this.l = 0;
            }
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
        public laserCollision(playerShip: Phaser.Sprite, enemyLaser: Phaser.Sprite): void {
            this.game.camera.shake(0.005, 250);
            this.sfx3.play('playerExpSFX');
            playerShip.kill();
            enemyLaser.kill();
            Save.Game.getInstance().lives --;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy(true);
            this.gameOver();
        }
        public dangerCollision(playerShip: Phaser.Sprite, danger: Phaser.Sprite): void {
            danger.kill();
            playerShip.kill();
            this.game.camera.shake(0.005, 250);
            this.sfx3.play('playerExpSFX');
            Save.Game.getInstance().lives --;
            this.remLives.text = 'LIVES: ' + Save.Game.getInstance().lives.valueOf();
            this.fireBalls.destroy(true);
            this.gameOver();
        }
        public restart(): void {
            this.sfx6.stop();
            this.hitCount = 0;
            this.game.state.restart(true);
        }
        public next(): void {
            this.sfx6.stop();
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
            //Lowering the player health every time it gets hit, 5 healths total. Game over when 0
        }
        public return(): void {
            this.sfx6.stop();
            Save.Game.getInstance().level = 0;
            Save.Game.getInstance().lives = 5;
            this.game.state.start('Menu', true, false);
        }
        public wingame(j: number): void {
                let rand: number = -1 + Math.random() * 150;
                let expRed: Phaser.Sprite = this.game.add.sprite(this.enemyBoss2.x + rand, this.enemyBoss2.y + rand, GFX.redExp);
                expRed.anchor.set(0.5);
                expRed.scale.set(5);
                expRed.animations.add('expRed', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
                expRed.animations.play('expRed', 8, false, true);
                this.sfx.play('explosion');
                if (j < 4) {
                    this.game.time.events.add(750, this.wingame, this, j + 1);
                }
                if (expRed.animations.getAnimation('expRed').onComplete) {
                    this.enemyBoss2.kill();
                    this.winText.visible = true;
                }
        }
    }
}
