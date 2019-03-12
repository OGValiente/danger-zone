module BoilerPlate {
    export class Levelselect extends Phaser.State implements Phaser.State {
        //Variables here
        private btn1: Phaser.Button;
        private btn2: Phaser.Button;
        private btn3: Phaser.Button;
        private btn4: Phaser.Button;
        private btn5: Phaser.Button;
        private btn6: Phaser.Button;
        private bg1: Phaser.Image;
        private bg2: Phaser.Image;
        private bg3: Phaser.Image;
        private bg4: Phaser.Image;
        private bg5: Phaser.Image;
        private bg6: Phaser.Image;
        private levelPassed: number;
        private lives: number;

        constructor() {
            super();
        }
        public init(): void {
            //
        }
        public preload(): void {
            //
        }

        public create(): void {
            super.create();
            SoundManager.getInstance(this.game);
            this.camera.flash(0, 1000);
            //this.game.state.start('titleScreen');
            //this.game.add.image(0, 0, Images.TitleScreen);
            this.lives = Save.Game.getInstance().lives;
            this.levelPassed = Save.Game.getInstance().level;
            if (this.levelPassed === 0) {
                this.bg1 = this.game.add.image(0, 0, Images.levelselect1);
                this.btn1 = this.game.add.button(265, 500, Images.button1, this.changeLevel);
                this.btn1.scale.set(0.95, 0.95);
            } else if (this.levelPassed === 1) {
                this.bg2 = this.game.add.image(0, 0, Images.levelselect2);
                this.btn2 = this.game.add.button(265, 355, Images.button2, this.changeLevel2);
                this.btn2.scale.set(0.95, 0.95);
            } else if (this.levelPassed === 2) {
                this.bg3 = this.game.add.image(0, 0, Images.levelselect3);
                this.btn3 = this.game.add.button(258, 218, Images.bossButton, this.changeLevel3);
            } else if (this.levelPassed === 3) {
                this.bg4 = this.game.add.image(0, 0, Images.levelselect4);
                this.btn4 = this.game.add.button(420, 218, Images.button3, this.changeLevel4);
                this.btn4.scale.set(0.95, 0.95);
            } else if (this.levelPassed === 4) {
                this.bg5 = this.game.add.image(0, 0, Images.levelselect5);
                this.btn5 = this.game.add.button(422, 52, Images.button4, this.changeLevel5);
                this.btn5.scale.set(0.95, 0.95);
            } else if (this.levelPassed === 5) {
                this.bg6 = this.game.add.image(0, 0, Images.levelselect6);
                this.btn6 = this.game.add.button(577, 46, Images.bossButton, this.changeLevel6);
            }
            let k: Phaser.Text = this.game.add.text(16, 16, 'Lives: ' + this.lives.valueOf(), {font: '48px Times New Roman', fill: '#ff0000'});
               // this.btn4 = this.game.add.button(420, 218, Images.button3, this.changeLevel4);
                //this.btn4.scale.set(0.95, 0.95);
            //this.bg5 = this.game.add.image(0, 0, Images.levelselect5);
            //this.bg6 = this.game.add.image(0, 0, Images.levelselect6);
        }

        public update(): void {
            //this.game.state.start('titleScreen');
        }

        public createButton(btnPlay: LabeledButton, btnExit: LabeledButton): void {
           //
        }

        public changeLevel(): void {
            this.game.state.start('Gameplay', true, false);
        }
        public changeLevel2(): void {
            this.game.state.start('Level3', true, false);
        }
        public changeLevel3(): void {
            this.game.state.start('Boss', true, false);
        }
        public changeLevel4(): void {
            this.game.state.start('Level4', true, false);
        }
        public changeLevel5(): void {
            this.game.state.start('Level5', true, false);
        }
        public changeLevel6(): void {
            this.game.state.start('Boss2', true, false);
        }
        public gameOver(): void {
            this.game.state.destroy();
        }
    }
}
