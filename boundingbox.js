class BoundingBox {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });

        this.left = x;
        this.top = y;
        this.midx = x + width/2;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;

        this.cx = x + width/2;
        this.cy = y + height/2;
    };

    collide(oth) {
        if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) return true;
        return false;
    };


    overlapDist(oth) {
        const sumHalf = {
            w: this.width / 2 + oth.width / 2,
            h: this.height / 2 + oth.height / 2
        };
        const centerDist = {
            x: this.x + this.width/2 - (oth.x + oth.width / 2),
            y: this.y + this.height/2 - (oth.y + oth.height / 2)
        };
        const overlap = {
            x: sumHalf.w - Math.abs(centerDist.x),
            y: sumHalf.h - Math.abs(centerDist.y)
        };
        if(overlap.x < overlap.y) {
            if(overlap.x > 0) {
                overlap.y = 0;
            }
        }
        else if(overlap.y > 0) {
            overlap.x = 0
        }
        if(centerDist.x < 0) {
            overlap.x *= -1;
        }
        if(centerDist.y < 0) {
            overlap.y *= -1;
        }
        return overlap;
    }

    inRange(oth, dist, lg) {
        if (lg) {
            console.log(this.midx + ' ' + oth.midx);
        }
        if (Math.abs(this.midx - oth.midx) < dist) {
            return true;
        }
        return false;
    };
};
