//main player object

//PARAMS:
//game is the game engine that the player will be placed into
//player is a string representing the player type
//x and y are positional coordinates in pixels, can be used for various purposes.
class Player {

    constructor(game, player_type, x, y, x_vel, y_vel, x_left_camera_limit, x_right_cameraLimit, y_lower_cameraLimit, y_upper_cameraLimit, show_bb) {
        Object.assign(this, { game, player_type, x, y, x_vel, y_vel, x_left_camera_limit, x_right_cameraLimit, y_lower_cameraLimit, y_upper_cameraLimit, show_bb});

        //assign the game engine to this object
        this.game = game;

        //debug optional boolean
        this.bb_enable = show_bb;

        this.x_vel = x_vel;
        this.y_vel =y_vel;

        this.x_left_cameraLimit = x_left_camera_limit;
        this.x_right_cameraLimit = x_right_cameraLimit;
        this.y_lower_cameraLimit = y_lower_cameraLimit;
        this.y_upper_cameraLimit = y_upper_cameraLimit;


        this.scale = 1;

        // updates / initializes the bounding box
        this.BB = new BoundingBox(this.x, this.y+20, 200, 200);

        // update x and y position, use velocity values passed in from calling function
        this.velocity = { x: x_vel, y: y_vel };
        this.gravity = 2;
        this.onGround = true;
        this.jumping = false;
        this.falling = false;
        this.canFire = true;
        this.player_type = player_type;
        this.removeFromWorld = false;
        this.hp = 20;
        this.damage = false;

        //sets size of submarine and its BB
        this.scale = 0.5;
        this.dead = false;

        // assign hearts to storm's hp
        this.hearts = new Hearts(this.game, this, 50, 50);

        // Player animation states: 0=idle. 1=moving left/right. 2=duck_slide. 3=jump.
        this.state = 0;
        // Player facing: 0=right. 1=left.
        this.facing = 0;

        if (this.player_type === "submarine"){this.birthPoof = new Poof(this.game, this.x - 400, this.y - 400, 1.2);}
        else if(this.player_type === "default") {this.birthPoof = new Poof(this.game, this.x - 350, this.y + 100, 0.8);}

        this.game.addEntity(this.birthPoof);
        this.loadAnimations();
        this.elapsedTime = 0;
        this.damage = false;

        this.update();
        this.updateCollisions();
        this.onGround = false;
        this.onCeiling = false;
        this.bumpedCeiling = false;
        this.onSide = false;
        this.sideDir = 0;
    };

    /** Assigns the correct animation states to each movement. (update with new spritesheets as needed) */
    loadAnimations() {
        this.leftFacingAnimation = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet.png"), 4200, 200, 200, 200, 21, 0.1, false, true);
        this.rightFacingAnimation = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet.png"), 0, 200, 200, 200, 21, 0.1, false, true);
        this.jumpingRightAnimation = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet.png"), 0, 0, 200, 200, 18, 0.07, false, true);
        this.jumpingLeftAnimation = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet.png"), 3600, 0, 200, 200, 18, 0.07, false, true);
        this.ceilingStickRightAnimation = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/ceiling_stick/spritesheet_right.png"), 0, 0, 200, 67, 6, 0.1, false, true);
        this.ceilingStickLeftAnimation = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/ceiling_stick/spritesheet_left.png"), 0, 0, 200, 67, 6, 0.1, false, true);

        // Damage animations
        this.leftFacingAnimationDamage = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet_red.png"), 4200, 200, 200, 200, 21, 0.1, false, true);
        this.rightFacingAnimationDamage = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet_red.png"), 0, 200, 200, 200, 21, 0.1, false, true);
        this.jumpingRightAnimationDamage = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet_red.png"), 0, 0, 200, 200, 18, 0.07, false, true);
        this.jumpingLeftAnimationDamage = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/sprite_sheet_red.png"), 3600, 0, 200, 200, 18, 0.07, false, true);
        this.ceilingStickRightAnimationDamage = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/ceiling_stick/spritesheet_right_red.png"), 0, 0, 200, 67, 6, 0.1, false, true);
        this.ceilingStickLeftAnimationDamage = new Animator(ASSET_MANAGER.getAsset("./assets/characters/storm/ceiling_stick/spritesheet_left_red.png"), 0, 0, 200, 67, 6, 0.1, false, true);
    };

    updateBB() {

        if(this.state === 4){this.BB = new BoundingBox(this.x- 100, this.y, 150, 67)}
        else{this.BB = new BoundingBox(this.x- 50, this.y, 100, 139)}
    }

    updateAnimations() {
        if (this.damage) {
            if(this.state === 0 && this.facing === 1) this.animation = this.leftFacingAnimationDamage;
            else if(this.state === 0 && this.facing === 0) this.animation = this.rightFacingAnimationDamage;
            else if(this.state === 3 && this.facing === 0) this.animation = this.jumpingRightAnimationDamage;
            else if(this.state === 3 && this.facing === 1) this.animation = this.jumpingLeftAnimationDamage;
            else if(this.state === 4 && this.facing === 0) this.animation = this.ceilingStickRightAnimationDamage;
            else if(this.state === 4 && this.facing === 1) this.animation = this.ceilingStickLeftAnimationDamage;
        } else {
            if(this.state === 0 && this.facing === 1) this.animation = this.leftFacingAnimation;
            else if(this.state === 0 && this.facing === 0) this.animation = this.rightFacingAnimation;
            else if(this.state === 3 && this.facing === 0) this.animation = this.jumpingRightAnimation;
            else if(this.state === 3 && this.facing === 1) this.animation = this.jumpingLeftAnimation;
            else if(this.state === 4 && this.facing === 0) this.animation = this.ceilingStickRightAnimation;
            else if(this.state === 4 && this.facing === 1) this.animation = this.ceilingStickLeftAnimation;
        }

    }
    /** Updates state frame by frame */
    update() {
        // console.log(this.game.shift_left_key);
        this.updateAnimations()
        this.updateBB();

        // console.log(this.x)
        // a constant TICK to sync with the game's timer
        const TICK = this.game.clockTick;
        this.elapsedTime += TICK

        /** Damage animation cooldown */
        if (this.damageCountdown > 0) {
            this.damageCountdown -= 12*TICK;
            // console.log(this.damageCountdown);
        } else if (this.damageCountdown <= 0) {
            this.damage = false;
        }


        /** DIE */
        if (this.hp <= 0 || (this.y >= 1500 && this.game.camera.level === 1)) this.dead = true;


        if(this.velocity.y > 0) {
            this.falling = true;} //Convenience variable for other classes

        // If no key pressed and not in air, no horizontal movement
        if(!this.game.right && !this.game.left && (this.onGround)) {
            this.velocity.x = 0;
            this.updateState(0);
        }

        // Key inputs
        // Normal speed on ground


        if(this.game.left) this.facing = 1;
        if(this.game.right) this.facing = 0;
        if(this.onGround && !this.onCeiling) {
            if(this.game.space && !this.onCeiling) {
                this.updateState(3);
                this.velocity.y = -15;
                this.onGround = false;
            }
            // Disable horizontal controls if side collision detected and going same direction as initial collision
            if(!(this.onSide && this.facing === this.sideDir)) {
                if(this.game.left) {
                    this.velocity.x = -this.x_vel;
                }
                else if(this.game.right) {
                    this.velocity.x = this.x_vel
                }

            }
        }

        //stop jump animation after landing on tile
        if(this.onGround && !this.game.space && !this.onCeiling &&(this.game.right || this.game.left)){this.updateState(0);}

        else if(this.onCeiling) {
            //Slow in air or on ceiling
            if(this.game.left) this.x -= this.x_vel/3 * params.blockSize * TICK;
            else if(this.game.right) this.x += this.x_vel/3 * params.blockSize * TICK;
        }
        else { // in the air
            //Currently, arrow keys provide more boost against the current velocity.
            //When pressing left but going right
            if(this.game.left && this.velocity.x > 0) this.x -= this.x_vel/2 * params.blockSize * TICK;
            //When pressing left and going left
            else if(this.game.left && this.velocity.x <= 0) this.x -= this.x_vel/4 * params.blockSize * TICK;
            //When pressing right and going left
            else if(this.game.right && this.velocity.x < 0) this.x += this.x_vel/2 * params.blockSize * TICK;
            //When pressing right and going right
            else if(this.game.right && this.velocity.x >= 0) this.x += this.x_vel/4 * params.blockSize * TICK;
        }

        //If sticking to ceiling, use a bit of reverse gravity to prevent falling off
        if(this.game.sticking && this.onCeiling && this.y > params.blockSize/2) {
            console.log("sticking! " + this.y + " " + params.blockSize/2);
            this.velocity.y = -1;
            this.updateState(4);
            // console.log(this.onCeiling);
            // console.log(this.state);
        }
        //Otherwise, use normal gravity
        else {this.velocity.y += this.gravity;}


        // Maximum speeds
        if(this.velocity.x >= 7) this.velocity.x = 7;
        if(this.velocity.x <= -7) this.velocity.x = -7;
        if(this.velocity.y >= 15) this.velocity.y  = 15;
        if(this.velocity.y <= -15) this.velocity.y = -15;

        /** UNIVERSAL POSITION UPDATE **/
        let dx = this.velocity.x *params.blockSize * TICK;
        let dy = this.velocity.y * params.blockSize * TICK;
        this.x += dx
        this.y += dy
        this.updateBB(); //VERY important, otherwise lots of jitter
        this.updateCollisions();
        if(this.hp === 0) this.dead = true;
        // Prevents the animation from falling through the window, prob should remove once levels designed?


        /** SPAWN SCRIBBLE ON FIRE **/
        if (this.game.shooting && this.canFire) {

            if(this.facing === 0) {
                this.game.addEntity(new Scribble(this.game, this.x + this.BB.width/2, this.y + this.BB.height/2, this.facing, 0));
                this.canFire = false;}
            else if(this.facing === 1){
                this.game.addEntity(new Scribble(this.game, this.x - this.BB.width/2, this.y + this.BB.height/2, this.facing, 0));
                this.canFire = false;}

        }
        else if (!this.game.shooting) {
            this.canFire = true;
        }

    };

    updateCollisions() {
        const that = this;
        let change = {x: 0, y: 0}
        let onGround = false;
        let onCeiling = false;
        let bumpedCeiling = false;
        let onSide = false;
        this.game.entities.forEach(function (entity) {
            //Don't collide with self, only check entity's with bounding boxes
            if (entity !== that && entity.BB && that.BB.collide(entity.BB)) {
                // Currently only handling map block collisions, no entity collisions yet
                if (entity instanceof Terrain) {
                    const {x: ox, y: oy} = that.BB.overlapDist(entity.BB);
                    let d = Math.sqrt(ox*ox + oy*oy)
                    const {x: vx, y: vy} = that.velocity;
                    let speed = vx*ox/d + vy*oy/d;
                    if(oy !== 0) {
                        if(oy > 0) {
                            if(that.game.sticking && !that.onCeiling) {

                                that.velocity.y = 0;
                                onCeiling = true;
                            }
                            else if(!that.onCeiling && !that.bumpedCeiling && that.velocity.y < 0) {
                                that.velocity.y = that.velocity.y * -0.5; //Can change this factor to make ceiling more bouncy
                                bumpedCeiling = true;
                            }
                        }
                        else if(oy < 0){
                            onGround = true;
                            bumpedCeiling = false;
                            onCeiling = false;
                        }
                    }
                    if(ox !== 0 && !(that.velocity.x === 0)) {

                        that.velocity.x = 0;
                        that.sideDir = that.facing;
                        onSide = true;
                    }
                    if(speed <= 0) { //Only apply changes if actually heading towards the block
                        if(ox !== 0) change.x = ox;
                        if(oy !== 0) change.y = oy
                    }
                    // console.log(ox + ", " + oy)
                }
                else if (entity instanceof Miniraser || entity instanceof Meteor || entity instanceof CeilBlob ) {

                    if (that.BB.topCollide(entity.BB)) {
                        // take no damage.
                    } else {
                        //only take damage if erasir is not stunned
                        if (that.elapsedTime > 0.8) {
                            if ((entity instanceof Miniraser && entity.state !== 1) || entity instanceof Meteor || entity instanceof CeilBlob) {
                                that.hp -= 5;
                                that.damage = true;
                                that.damageCountdown = 10;
                                that.elapsedTime = 0;
                            }
                        }
                    }
                }
                else if (entity instanceof LevelMarker){
                    if(that.BB.collide(entity.BB)){entity.loadNext = true;}
                }
                if (entity instanceof powerUp) {
                    if (that.BB.collide(entity.BB)) {
                        entity.removeFromWorld = true;
                        that.hp += 20;
                    }
                }
            }
        });

        this.onSide = onSide;
        this.onGround = onGround;
        this.bumpedCeiling = bumpedCeiling
        this.onCeiling = onCeiling;
        if(this.onCeiling) {
            this.velocity.x = 0;
        }

        if(this.onGround) {
            this.velocity.y = 0;
            this.bumpedCeiling = false;
        }
        if(this.onSide) {
            this.velocity.x = 0;
        }
        // console.log(this.onGround + ", " + this.onCeiling + ", " + this.onSide)
        that.x += change.x;
        that.y += change.y;
        that.updateBB();
    }

    remove(removeMe) {

        if(removeMe){
            this.removeFromWorld = true
            this.birthPoof.removeFromWorld = true;
        }
    }
    //draw method will render this entity to the canvas
    draw(ctx) {

        if(this.birthPoof.lifetime <= 2) {
            if (this.state === 4) {this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.x - 100 - this.game.camera.x), this.y - this.game.camera.y, 1);}
            else {this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.x - 100 - this.game.camera.x), this.y - 65 - this.game.camera.y, 1);}
            this.hearts.draw(ctx);
        }
    };

    /** Helper method to update the player type */
    updateState(state) {
        if (this.state !== state) {
            this.state = state;
            this.loadAnimations();
        }
    }
}
