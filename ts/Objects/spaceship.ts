const PLAYER_MAX_HEALTH: number = 2;

class Spaceship extends Phaser.Sprite {
    private playerShip: Phaser.Sprite;
    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key, undefined);
        this.playerShip = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Images.playerShip, 60);
        this.playerShip.anchor.set(0.5);
        this.playerShip.scale.setTo(0.8, 0.8);
        this.game.physics.enable(this.playerShip, Phaser.Physics.ARCADE);
        this.playerShip.body.angularDrag = 800;
        this.playerShip.body.drag.set(1550);
        this.playerShip.body.maxAngular = 200;
        this.playerShip.body.maxVelocity.set(900);
        this.playerShip.body.collideWorldBounds = true;
    }
}
