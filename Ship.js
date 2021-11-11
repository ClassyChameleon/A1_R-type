// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = g_spriteAnimations.ship[2];
    
    // Set normal drawing scale, and warp state off
    this._scale = 1.75;
    this._isWarping = false;
};

Ship.prototype = new Entity();

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_UP = 'W'.charCodeAt(0);
Ship.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Ship.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;
Ship.prototype.speed = 3;
// Firepower
Ship.prototype.power = 0;
Ship.prototype.powerTime = 0;
Ship.prototype.ready2Fire = false;
// Animation stuff
Ship.prototype.celNo = 2;
Ship.prototype.timestampUP = 0;
Ship.prototype.timestampUPSTOP = 0;
Ship.prototype.timestampDOWN = 0;
Ship.prototype.timestampDOWNSTOP = 0;

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");

Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    this.warpSound.play();
    
    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;
    
    if (this._scale < 0.2) {
    
        this._moveToASafePlace();
        this._scaleDirn = 1;
        
    } else if (this._scale > 1.75) {
    
        this._scale = 1.75;
        this._isWarping = false;
        
        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
        
    }
};

Ship.prototype._moveToASafePlace = function () {

    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {
    
        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;
        
        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);
        
        this.wrapPosition();
        
        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;
        
    }
};
    
Ship.prototype.update = function (du) {

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    
    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // Perform movement substeps
    this.handleMovement(du);

    // Handle firing
    this.maybeFireBullet(du);

    // TODO: YOUR STUFF HERE! --- Warp if isColliding, otherwise Register
    if (this.isColliding()) {
        this.warp();
    } else {
        spatialManager.register(this);
    }

    // Display power on interface
    g_interface.beamMeter = this.power;
};

Ship.prototype.handleMovement = function (du) {
    var origSpeed = this.speed;
    this.speed *= du;
    
    this._movementInputs(du);

    // Handle screen boundaries
    var halfWidth = this.sprite.width*this._scale/2;
    var halfHeight = this.sprite.height*this._scale/2;
    if (this.cx+halfWidth > g_canvas.width) this.cx = g_canvas.width-halfWidth;
    if (this.cy+halfHeight > g_canvas.height-30) this.cy = g_canvas.height-halfHeight-30;
    if (this.cx-halfWidth < 0) this.cx = halfWidth;
    if (this.cy-halfHeight < 0) this.cy = halfHeight;

    this._movementAnimation(du);

    this.speed = origSpeed;
};

Ship.prototype._movementInputs = function (du) {
    // Movement inputs
    if (keys[this.KEY_UP]) {
        this.timestampUPSTOP = Date.now();
        this.cy -= this.speed;
        if (this.celNo < 2) {
            this.timestampUP = Date.now();
        } else {
            if (Date.now() - this.timestampUP > 100) this.celNo = 3;
            if (Date.now() - this.timestampUP > 200) this.celNo = 4;
        }
    }
    if (keys[this.KEY_DOWN]) {
        this.timestampDOWNSTOP = Date.now();
        this.cy += this.speed;
        if (this.celNo > 2) {
            this.timestampDOWN = Date.now();
        } else {
            if (Date.now() - this.timestampDOWN > 100) this.celNo = 1;
            if (Date.now() - this.timestampDOWN > 200) this.celNo = 0;
        }
    }
    if (keys[this.KEY_LEFT]) this.cx -= this.speed;
    if (keys[this.KEY_RIGHT]) this.cx += this.speed;
};

Ship.prototype._movementAnimation = function (du) {
    // Animation timestamps
    if (!keys[this.KEY_UP]) {
        this.timestampUP = Date.now();
        if (this.celNo > 2) {
            if (Date.now() - this.timestampUPSTOP > 100) {
                this.celNo--;
                this.timestampUPSTOP = Date.now();
            }
        }
    }
    if (!keys[this.KEY_DOWN]) {
        this.timestampDOWN = Date.now();
        if (this.celNo < 2) {
            if (Date.now() - this.timestampDOWNSTOP > 100) {
                this.celNo++;
                this.timestampDOWNSTOP = Date.now();
            }
        }
    }
}


Ship.prototype.maybeFireBullet = function (du) {

    if (keys[this.KEY_FIRE]) {
        this.ready2Fire = true;
        if(this.power < 100) {
            this.power += du;
            if(this.power > 100) this.power = 100;
        }
        // For charge animation
        this.powerTime += du;
    }

    if(!keys[this.KEY_FIRE]){
            
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;
        
        if(!this.ready2Fire) return;
        else {
            entityManager.fireBullet(
                this.cx + dX * launchDist + this.sprite.width, 
                this.cy + dY,
                this.rotation,
                this.power);
            console.log("this.power: " + this.power);
            this.ready2Fire = false;
            this.power = 0;
            this.powerTime = 0;
        }
    }
    
};

Ship.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Ship.prototype.takeBulletHit = function () {
    this.warp();
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};


Ship.prototype.render = function (ctx) {
    // Previous sprite code
    /*
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
    */
    var cel = g_spriteAnimations.ship[this.celNo];
    cel.scale = this._scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
    if(this.power) {
        var powerLevel = Math.floor(this.powerTime * 7/25);
        powerLevel = powerLevel%8;
        var cel = g_spriteAnimations.charge[powerLevel];
        cel.scale = this._scale;
        var xPos = this.cx + this.sprite.width/2 + g_spriteAnimations.charge[0].width;
        cel.drawCenteredAt(ctx, xPos, this.cy+4, 0);
    }
};
