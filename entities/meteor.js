//this code is happily borrowed from https://github.com/algorithm0r/RobotTag/blob/master/circle.js

class Meteor {
    constructor(game, levelWidth) {
        this.game = game;
        this.radius = 30;
        this.levelWidth = levelWidth;
        this.x = this.radius + Math.random() * (this.levelWidth - this.radius * 2);
        this.y = this.radius + Math.random() * (this.game.surfaceHeight - this.radius * 2);
        this.friction = 1;
        this.acceleration = 10000000;
        this.maxSpeed = 0;
        this.visualRadius = 0;
        this.colors = ["White", "White"];

        this.setNotIt();

        this.scale = 0.05;
        this.velocity = { x: 1000, y: 1000 };
        this.elapsedTime = 0;
        this.animation = new Animator(ASSET_MANAGER.getAsset("./assets/meteor/spritesheet.png"), 0, 0, 1200, 1200, 3, 0.1);
        this.BB = new BoundingBox(this.x, this.y, 1200 * this.scale , 1200 * this.scale);
        this.updateBB();
        this.testSpeed();
    };

    testSpeed() {
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            const ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
    };

    setIt() {
        this.it = true;
        this.color = 0;
        this.paused = 1;
    };

    setNotIt() {
        this.it = false;
        this.color = 1;
    };

    collide(other) {return distance(this, other) < this.radius + other.radius;};
    collideLeft() {return (this.x - this.radius) < 0;};
    collideRight() {return (this.x + this.radius) > this.levelWidth;};
    topCollide() {return (this.y - this.radius) < 0;};
    collideBottom() {return (this.y + this.radius) > this.game.surfaceHeight;};
    updateBB() {this.BB = new BoundingBox(this.x, this.y, 1200 * this.scale , 1200 * this.scale);};


    update() {
        this.updateBB();

        const TICK = this.game.clockTick;
        this.elapsedTime += TICK;
        let difY;
        let difX;
        this.friction = document.getElementById("friction").value;
        if (this.it) {
            this.visualRadius = document.getElementById("itradius").value;
            this.maxSpeed = document.getElementById("itspeed").value;
        } else {
            this.visualRadius = document.getElementById("notradius").value;
            this.maxSpeed = document.getElementById("notspeed").value;
        }
            // move
            this.x += (this.velocity.x * this.game.clockTick);
            this.y += (this.velocity.y * this.game.clockTick);

            // collision with left or right walls
            if (this.collideLeft() || this.collideRight()) {
                this.velocity.x += this.velocity.x * -1000;
                if (this.collideLeft()) this.x = this.radius;
                if (this.collideRight()) this.x = this.game.surfaceWidth - this.radius;

            }

            // collision with top or bottom walls
            if (this.topCollide() || this.collideBottom()) {
                this.velocity.y += this.velocity.y * -1000;
                if (this.topCollide()) this.y = this.radius;
                if (this.collideBottom()) this.y = this.game.surfaceHeight - this.radius;
            }

            // collision with other circles
            for (var i = 0; i < this.game.entities.length; i++) {
                const ent = this.game.entities[i];

                if (ent !== this && this.collide(ent)) {

                    // push away from each other
                    const dist = distance(this, ent);
                    const delta = this.radius + ent.radius - dist;
                    difX = (this.x - ent.x) / dist;
                    difY = (this.y - ent.y) / dist;

                    this.x += difX * delta / 2;
                    this.y += difY * delta / 2;
                    ent.x -= difX * delta / 2;
                    ent.y -= difY * delta / 2;

                    // swap velocities
                    const temp = {x: this.velocity.x, y: this.velocity.y};
                    this.velocity.x = ent.velocity.x;
                    this.velocity.y = ent.velocity.y;
                    ent.velocity.x = temp.x;
                    ent.velocity.y = temp.y;
                    //
                    // // play tag
                    if (this.it) {
                        this.setNotIt();
                        ent.setIt();
                    }
                }


                if (ent !== this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
                    const dist = distance(this, ent);
                    if (this.it) {
                        difX = (ent.x - this.x) / dist;
                        difY = (ent.y - this.y) / dist;
                        this.velocity.x += difX * this.acceleration / (dist * dist);
                        this.velocity.y += difY * this.acceleration / (dist * dist);
                    }
                    if (ent.it) {
                        difX = (ent.x - this.x) / dist;
                        difY = (ent.y - this.y) / dist;
                        this.velocity.x -= difX * this.acceleration / (dist * dist);
                        this.velocity.y -= difY * this.acceleration / (dist * dist);
                    }
                }
            }

            this.testSpeed();

            this.velocity.x -= (1 - this.friction) * this.game.clockTick * this.velocity.x;
            this.velocity.y -= (1 - this.friction) * this.game.clockTick * this.velocity.y;

    };

    draw(ctx) {

        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y -this.game.camera.y, 0.05);
        // ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        if (document.getElementById("visual").checked) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = this.colors[this.color];
            ctx.arc(this.x, this.y, this.visualRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
        }
    };

}