module BoilerPlate {
    export class Boot extends Phaser.State implements Fabrique.IState {
        public name: string;
        //public game: Phaser.Game;
        public game: Fabrique.IGame;
        private wasPaused: boolean;

        constructor() {
            super();
        }

        public init(): void {
            Save.Game.getInstance(this.game);
            //input pointers limited to 1
            this.game.input.maxPointers = 1;

            //Disable contextual menu
            this.game.canvas.oncontextmenu = function (e: Event): void {
                e.preventDefault();
            };

            //Enable scaling
            if (this.game.device.desktop) {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.pageAlignHorizontally = true;
                this.game.scale.windowConstraints.bottom = 'visual';

                this.game.onBlur.add((data: any) => {
                    this.game.sound.mute = true;
                });
                this.game.onFocus.add((data: any) => {
                    this.game.sound.mute = false;
                });
            } else {
                this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
                //Resize because it's better than any of the Phaser provided resizes
                window.addEventListener('resize', (e: Event) => Boot.mobileResizeCallback(this.game.scale));
                this.game.scale.onSizeChange.add(
                    () => {
                        if (Constants.LANDSCAPE_LOCKED) {
                            if (this.game.width > this.game.height) {
                                this.handleCorrect();
                            } else {
                                this.handleIncorrect();
                            }
                        } else if (Constants.PORTRAIT_LOCKED) {
                            if (this.game.width < this.game.height) {
                                this.handleCorrect();
                            } else {
                                this.handleIncorrect();
                            }
                        }
                        this.game.state.getCurrentState().resize();
                    },
                    this
                );
                Boot.mobileResizeCallback(this.game.scale);

                if (Fabrique.Utils.isOnDevice(this.game)) {
                    //game pause/focus events only go for the game canvas, we need to check if the entire document is paused due to ads
                    document.addEventListener('pause', () => {
                        this.game.sound.mute = true;
                    });
                    document.addEventListener('resume', () => {
                        this.game.sound.mute = false;
                    });
                } else {
                    this.stage.disableVisibilityChange = false;
                    this.game.onPause.add((data: any) => {
                        this.game.sound.mute = true;
                    });
                    this.game.onResume.add((data: any) => {
                        this.game.sound.mute = false;
                    });
                }
            }
        }

        public static mobileResizeCallback(manager: Phaser.ScaleManager): void {
            let width: number = window.innerWidth;
            let height: number = window.innerHeight;

            Boot.setScaling(manager.game);

            let usedWidth: number = Constants.GAME_WIDTH * Constants.GAME_SCALE;
            let usedHeight: number = Constants.GAME_HEIGHT * Constants.GAME_SCALE;

            let scaleFactor: number = 1;

            //So first we check if the game is beeing played in landscape
            if (width > height) {
                scaleFactor /= height / usedHeight;
            } else {
                scaleFactor /= height / usedWidth;
            }

            Constants.CALCULATED_WIDTH = Math.ceil(width * scaleFactor);
            Constants.CALCULATED_HEIGHT = Math.ceil(height * scaleFactor);

            manager.setGameSize(Constants.CALCULATED_WIDTH, Constants.CALCULATED_HEIGHT);
            manager.setUserScale(1 / scaleFactor, 1 / scaleFactor);
        }

        private static setScaling(game: Phaser.Game): void {
            //Check if the device is in portrait mode, and if so, override the width with the innerHeight.
            //We want to determine the scaling based on the the biggest side.
            let width: number = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
            width *= game.device.pixelRatio;

            if (width < 400) {
                Constants.GAME_SCALE = 0.5;
            } else if (width > 799) {
                Constants.GAME_SCALE = 1;
            } else {
                Constants.GAME_SCALE = 0.75;
            }
        }

        public preload(): void {
            this.game.load.cacheBuster = (typeof version === 'undefined') ? null : version;

            //Load the assets based on the game scale.
            let scale: string = 'x' + Constants.GAME_SCALE + '/';
            Images.preloadList.forEach((assetName: string) => {
                this.game.load.image(assetName, 'assets/images/' + scale + assetName + '.png');
            });
            Atlases.preloadList.forEach((assetName: string) => {
                this.game.load.atlas(assetName, 'assets/atlases/' + scale + assetName + '.png', 'assets/atlases/' + scale + assetName + '.json');
            });
            Sounds.preloadList.forEach((assetName: string) => {
                if (this.game.device.iOS) {
                    this.game.load.audio(assetName, ['assets/audio/' + assetName + '.m4a']);
                } else {
                    this.game.load.audio(assetName, ['assets/audio/' + assetName + '.ogg', 'assets/audio/' + assetName + '.mp3']);
                }
            });
        }

        public create(): void {
            Fabrique.LoaderHelper.hide();

            //TODO: If you DON'T want a custom preloader, uncomment this piece and preload the assets lists in the Boot or in the Menu states
            this.game.state.start(Fabrique.SplashScreen.Preloader.Name, true, false, {
                nextState: 'Menu',

                preloadHandler: (): void => {
                    this.game.sound.muteOnPause = true;

                    //Load the assets based on the game scale.
                    let scale: string = ''; //'x' + Constants.GAME_SCALE + '/';

                    Images.list.forEach((assetName: string) => {
                        this.game.load.image(assetName, 'assets/images/' + scale + assetName + '.png');
                    });

                    GFX.list.forEach((assetName: string) => {
                        this.game.load.spritesheet(assetName, 'assets/gfx/' + scale + assetName + '.png', 16, 14, 8);
                    });

                    Atlases.list.forEach((assetName: string) => {
                        this.game.load.atlas(assetName, 'assets/atlases/' + scale + assetName + '.png', 'assets/atlases/' + scale + assetName + '.json');
                    });

                    Sounds.list.forEach((assetName: string) => {
                        if (this.game.device.iOS) {
                            this.game.load.audio(assetName, ['assets/audio/' + assetName + '.m4a']);
                        } else {
                            this.game.load.audio(assetName, ['assets/audio/' + assetName + '.ogg', 'assets/audio/' + assetName + '.mp3']);
                        }
                    });

                    Fabrique.Branding.preloadImages(this.game);
                }
            });
        }

        /**
         * Hides rotate device image and shows game.
         */
        private handleCorrect(): void {
            if (!this.wasPaused) {
                // Gameplay.pause = false;
                this.game.paused = false;
            }

            document.getElementById('orientation').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        }

        /**
         * Hides game and shows an image asking to rotate device.
         */
        private handleIncorrect(): void {
            //this.wasPaused = Gameplay.pause;
            this.wasPaused = this.game.paused;

            if (!this.wasPaused) {
                // Gameplay.pause = true;
                this.game.paused = false;
            }

            document.getElementById('orientation').style.display = 'block';
            document.getElementById('content').style.display = 'none';
        }
    }
}
