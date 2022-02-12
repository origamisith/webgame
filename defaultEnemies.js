class Miniraser {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        
        this.game = game;
        this.speed = 3;
        this.gravity = 28;
        this.falling = false;
        this.onGround = false;
        this.velocity = { x: 0, y: 0 }
        // spritesheet
        this.spritesheet = ASSET_MANAGER.getAsset();
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/characters/dino/idle_1.png"), 0, 0, 400, 400, 1, 0.12, false, true);
        this.updateBB();
        this.agro = false;
        this.agroDistance = 400;
        this.walkSpeed = 4;
    };

    updateBB() {
        this.BB = new BoundingBox(this.x+200, this.y+50, 200, 200);
        
    };
    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, 1);
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
    };

    update() {

        this.updateBB();
        const TICK = this.game.clockTick;
        this.onGround = false;

        const that = this;
        this.game.entities.forEach(function (entity) {
            //Don't collide with self, only check entity's with bounding boxes
            if (entity !== that && entity.BB && that.BB.collide(entity.BB)) {
                // Currently only handling map block collisions, no entity collisions yet
                if (entity instanceof Terrain) {
                    // Case 1: Jumping up while hitting the side
                    // Case 2: Walking into the side while on the ground
                    if((!that.onGround && that.velocity.y < 0) || (that.BB.bottom >= entity.BB.bottom)) {
                        that.side = true;
                    }
                    // Case 3: Falling onto flat ground
                    else {
                        that.onGround = true;
                    }
                }
            }
        });
        //console.log('from Miniraser: Player.x' + this.game.player.x + 'Player.y' + this.game.player.y);

        /** FALLING */
        if (!this.onGround) {
            this.falling = true;
        }
        else {
            this.falling = false;
            this.velocity.y = 0;
        }
        if (this.falling && !this.onGround) {
            this.velocity.y += this.gravity;
        }

        /** BECOME AGGRO'D */
        let {x, y} = this.game.camera.player;

        // console.log("enemy x=" + this.x + ", player x=" + x);

        if (Math.abs(x - (this.x+100)) < this.agroDistance || Math.abs((this.x+100) - x) < this.agroDistance) {
            // player is on the left
            if (x < this.x) {
                this.x -= this.walkSpeed;
            }
            // player is on the right
            else if (x > this.x) {
                this.x += this.walkSpeed;
            }
            else {
                this.velocity.x = 0;
            }
        }
        else {
            this.velocity.x = 0;
        }

        
        // Don't walk through blocks.
        if (this.side) {
            this.velocity.x = 0;
        }


         /** UNIVERSAL POSITION UPDATE **/
         this.x += this.velocity.x * TICK;
         this.y += this.velocity.y * TICK;
    };
};