import SpriteSheetLoader = PIXI.SpriteSheetLoader;

class GFX {
    public static fireAnim: string = 'red';
    public static redExp: string = 'redExp';
    public static blueExp: string = 'blueExp';
    public static playerExp: string = 'playerExp';
    public static bossExp: string = 'bossExp';
    public static powerupAnim: string = 'powerupAnim';
    //
    public static preloadList: string[] = [
        //Add preloader audio
    ];

    /**
     * A list of all audio we need after the preloader.
     */
    public static list: string[] = [
        GFX.fireAnim,
        GFX.bossExp,
        GFX.playerExp,
        GFX.blueExp,
        GFX.redExp,
        GFX.powerupAnim
    ];
}
