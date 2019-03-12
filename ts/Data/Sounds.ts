class Sounds {
    //Background music
    public static GameMusic: string = 'overworld';

    //Sound effects
    public static Click: string = 'click';
    public static Explosion: string = 'explosion';
    public static Fireball: string = 'fireball';
    public static playerExp: string = 'Explosion1';
    public static bossBullet: string = 'bossBullet';
    public static playerDeath: string = 'playerDeath';
    public static laserShot: string = 'laserShot';
    public static mainMenu: string = 'MainMenu';
    public static inLevel: string = 'inLevel';
    public static Boss: string = 'Boss';

    /**
     * A list of all audio we need for the preloader.
     */
    public static preloadList: string[] = [
       //Add preloader audio
    ];

    /**
     * A list of all audio we need after the preloader.
     */
    public static list: string[] = [
        Sounds.GameMusic,
        Sounds.Click,
        Sounds.Explosion,
        Sounds.Fireball,
        Sounds.playerExp,
        Sounds.bossBullet,
        Sounds.playerDeath,
        Sounds.laserShot,
        Sounds.mainMenu,
        Sounds.inLevel,
        Sounds.Boss
    ];
}
