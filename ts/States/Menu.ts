module BoilerPlate {
    const levelPassed: number = 0;
    export class Menu extends Phaser.State implements Phaser.State {
        //Variables here
        private btnPlay: LabeledButton;
        private btnExit: LabeledButton;
        private btnReset: LabeledButton;
        private titleS: Phaser.Sprite;
        private gameplay: Phaser.State;
        private background: Phaser.Image;
        private logo: Phaser.Image;
        private title: Phaser.Image;
        private controls: Phaser.Image;
        private lives: number;
        private levels: number;
        private sfx: Phaser.Sound;

        constructor() {
            super();
        }

        public preload(): void {
            //
        }

        public create(): void {
            super.create();
            SoundManager.getInstance(this.game);
            //this.game.state.start('titleScreen');
            //this.game.add.image(0, 0, Images.TitleScreen);
            this.sfx = this.game.add.audio(Sounds.mainMenu);
            this.sfx.addMarker('mainMenu', 0, 53, 0.7, true);
            this.sfx.play('mainMenu');
            this.lives = Save.Game.getInstance().lives;
            this.levels = Save.Game.getInstance().level;
            this.background = this.game.add.image(0, 0, Images.gameBG);
            this.logo = this.game.add.image(0, 0, Images.Logo);
            this.logo.anchor.set(0.5);
            this.title = this.game.add.image(this.game.world.centerX, 70, Images.titleText);
            this.title.anchor.set(0.5);
            this.controls = this.game.add.image(this.game.world.centerX, 510, Images.controls);
            this.controls.anchor.set(0.5);
            //this.createButton(this.btnPlay, this.btnExit);
            let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};
            this.btnPlay = new LabeledButton(this.game, 0, 0, 'START', textStyle, this.changeLevel, this, 300, 100);
            this.btnPlay.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            this.btnExit = new LabeledButton(this.game, 0, 0, 'EXIT', textStyle, this.gameOver, this);
            this.btnExit.setFrames('btn_blue', 'btn_blue', 'btn_blue_onpress', 'btn_blue');
            this.btnReset = new LabeledButton(this.game, 0, 0, 'RESET', textStyle, this.reset, this, 300, 100);
            this.btnReset.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
            //this.btnExit.createTexture(0xf98f25);
            this.resize();
        }

        public update(): void {
            //this.game.state.start('titleScreen');
        }
        public createButton(btnPlay: LabeledButton, btnExit: LabeledButton): void {
            //
        }
        public changeLevel(): void {
            this.sfx.stop();
            this.game.state.start('Levelselect', true, false);
        }
        public gameOver(): void {
            this.game.state.destroy();
        }
        public reset(): void {
            Save.Game.getInstance().lives = 5;
            Save.Game.getInstance().level = 0;
        }

        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;
            this.logo.scale.set(1);
            //New Scaling
            let assetsScaling: number = 1;
            if (this.game.width > this.game.height) {
                assetsScaling = this.game.width / (this.logo.width * 1.5);
            } else {
                assetsScaling = this.game.width / this.logo.width;
            }
            //If the scaling is bigger than 1
            assetsScaling = assetsScaling > 1 ? 1 : assetsScaling;
            //Set new scaling and repos the logo
            this.logo.scale.set(assetsScaling);
            this.logo.alignIn(this.world.bounds, Phaser.CENTER, 0, -80 * Constants.GAME_SCALE);

            //Doing the same for buttons
            this.btnPlay.updateScaling(assetsScaling);
            this.btnPlay.x = this.logo.x / 2 - 25;
            this.btnPlay.y = this.logo.y + this.logo.height * 0.65;

            this.btnExit.updateScaling(assetsScaling);
            this.btnExit.x = this.logo.x + this.logo.x / 2 + 25;
            this.btnExit.y = this.btnPlay.y;

            this.btnReset.updateScaling(assetsScaling);
            this.btnReset.x = this.logo.x;
            this.btnReset.y = this.btnPlay.y;
        }
    }
}
