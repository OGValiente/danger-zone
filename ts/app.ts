//Module name should equal the game name
module BoilerPlate {
    export class Game extends Phaser.Game {

        constructor() {
            //We use Phaser's config object to create the game, since this is the only way to disable debugging
            super(<Phaser.IGameConfig>{
                enableDebug: true,
                width: Constants.GAME_WIDTH,
                height: Constants.GAME_HEIGHT,
                renderer: Phaser.AUTO,
                parent: 'content',
                transparent: true,
                antialias: true,
                preserveDrawingBuffer: false,
                physicsConfig: null,
                seed: '',
                state: null,
                forceSetTimeOut: false
            });
            this.clearBeforeRender = false;

            //Here we adjust some stuff to the game that we need, before any state is being run
            Phaser.Device.whenReady(() => {
                //Fix for mobile portals and IE
                this.stage.disableVisibilityChange = true; //This will make sure the game runs out-of-focus
                let event: string = this.device.desktop ? 'click' : 'touchstart';
                document.getElementById('content').addEventListener(event, (e: Event) => {
                    //This will make sure the game will rerun, when focus was lost
                    this.gameResumed(e);
                });
            });

            this.state.add('game', {create: this.stateCreator.bind(this), preload: this.statePreloader.bind(this)}, true);
        }

        /**
         * Here we load all the orange games scripts we need
         */
        private statePreloader(): void {
            libs.forEach((library: string) => {
                this.load.script(library, library);
            });
        }

        private stateCreator(): void {
            //Here we load all the plugins
            this.plugins.add(Fabrique.Plugins.GameEvents);
            this.plugins.add(Fabrique.Plugins.GoogleAnalytics);
            this.plugins.add(Fabrique.Plugins.GameAnalytics);
            this.plugins.add(PhaserAds.AdManager);
            this.plugins.add(<any>PhaserSuperStorage.StoragePlugin);
            this.plugins.add(PhaserCachebuster.CacheBuster);
            this.plugins.add(PhaserSpine.SpinePlugin);

            (<any>this).storage.forcePromises = true;

            //Here we load all the states, but they shouldn't start automatically
            this.state.add('Boot', BoilerPlate.Boot, false);
            this.state.add(Fabrique.SplashScreen.Preloader.Name, Fabrique.SplashScreen.Preloader, false);
            this.state.add('Menu', BoilerPlate.Menu, false);
            this.state.add('Gameplay', BoilerPlate.Gameplay, false);
            this.state.add('Boss', BoilerPlate.Boss, false);
            this.state.add('Level3', BoilerPlate.Level3, false);
            this.state.add('Level4', BoilerPlate.Level4, false);
            this.state.add('Levelselect', BoilerPlate.Levelselect, false);
            this.state.add('Level5', BoilerPlate.Level5, false);
            this.state.add('Boss2', BoilerPlate.Boss2, false);

            let updateText: () => void = (): void => {
                this.recursiveUpdateText(this.stage);
            };

            //Load the fonts
            WebFont.load(<WebFont.Config>{
                custom: <WebFont.Custom>{
                    families: ['Aller Display'],
                    urls: [
                        'assets/css/AllerDisplay.css'
                    ]
                },
                active: updateText,
                inactive: updateText
            });

            //start the game
            this.state.start('Boot');
            this.state.remove('game');
        }

        /**
         * This function will set the dirty property to true on all text objects in the current active stage
         *
         * @param obj
         */
        public recursiveUpdateText(obj: Phaser.Text | PIXI.DisplayObjectContainer): void {
            if (obj instanceof Phaser.Text) {
                (<any>obj).dirty = true;
            }

            if (obj.children && obj.children.length > 0) {
                obj.children.forEach((child: PIXI.DisplayObjectContainer) => {
                    this.recursiveUpdateText(child);
                });
            }
        }
    }
}
