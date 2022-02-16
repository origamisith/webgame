//a handy pencil to redraw lost health

class powerUp {
    constructor(game, x_pos, y_pos) {
        this.game = game;

        this.animation = new Animator(ASSET_MANAGER.getAsset("./assets/powerUp/spritesheet.png"), 0, 0, 200, 640, 3, 0.1);
        this.x = x_pos;
        this.y = y_pos;
    }

    update(ctx) {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y -this.game.camera.y, 0.2);
    };
}