class Title {
    constructor(game, x, y) {
        this.game = game;
        this.x = x*1; //Arbitrary scaling factor
        this.y = y*1;
        // this.animation = new Animator(ASSET_MANAGER.getAsset("./sprites/cloud.png"), 0, 0, 800, 800, 1, 0);
    }

    update(ctx) {

    }

    draw(ctx) {
        // this.animation.drawFrame(ctx.clockTick, ctx, this.x-this.game.camera.x, this.y, 1);
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/title.png"), 100, 400,2096 / 2, 625 /2);
    }
}
