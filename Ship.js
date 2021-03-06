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
// Power Ups
Ship.prototype.rocketPU = false;
Ship.prototype.rocketPUCooldown = 0;
Ship.prototype.baseCooldown = 40;
// Animation stuff
Ship.prototype.celNo = 2;
Ship.prototype.timestampUP = 0;
Ship.prototype.timestampUPSTOP = 0;
Ship.prototype.timestampDOWN = 0;
Ship.prototype.timestampDOWNSTOP = 0;
Ship.prototype.timestampWAIT = 0;
Ship.prototype.timestampINVULNERABLE = 0;
Ship.prototype.timestampFIRE = 0;
Ship.prototype.invulnFrame = false;
Ship.prototype.dyingNow = false;
Ship.prototype.dyingNowInitalize = false;

// HACKED-IN AUDIO (no preloading)
Ship.prototype.shipSounds = {
    death : new Audio("sounds/shipDeath.ogg"),
    charge: new Audio("sounds/chargeUp.ogg")
};
    
Ship.prototype.update = function (du) {
    spatialManager.unregister(this);

    // Ship is dead and needs to wait out the timestamp.
    if (this.timestampWAIT>0) {
        this.timestampWAIT -= du;
        if (this.timestampWAIT<0) this.respawn();;
        return;
    }
    
    // Ship has been marked dead. Death initalizes
    if (this.dyingNowInitialize) {
        this.initiateDeath(du);
        return;
    }

    // Death initalized. Play death animation. Set timestampWAIT.
    if (this.dyingNow) {
        this.celNo += 0.25;
        if (this.celNo >= g_spriteAnimations.shipDeath.length) {
            this.dyingNow = false;
            this.celNo = 2;
            this.timestampWAIT = 120;
        }
        return;
    }

    // Perform movement substeps
    this.handleMovement(du);

    // Handle firing
    this.maybeFireBullet(du);

    // Ship just respawned. It's invulnerable for a while.
    if (this.timestampINVULNERABLE > 0) {
        this.timestampINVULNERABLE -= du;
        this.invulnFrame = !this.invulnFrame;
        if (this.timestampINVULNERABLE < 0) {
            this.timestampINVULNERABLE = 0;
            this.invulnFrame = false;
        }
    } else {
        // Checks if ship is colliding with any of the env-blocks
        for(var i = 0; i < entityManager._blocks.length; i++){
            if(util.boxBoxCollision(this, entityManager._blocks[i])){
                this.dyingNowInitialize = true;
            }
        }

        // Checks if ship is hit
        let hitEntity = this.findHitEntity();
        if (this.isColliding() && !(hitEntity instanceof PowerUp) && !(hitEntity instanceof RocketPower)) {
            this.dyingNowInitialize = true;
        } else {
            spatialManager.register(this);
        }
    }

    // Display power on interface
    g_interface.beamMeter = this.power;
};

Ship.prototype.respawn = function () {
    g_interface.lives--;
    this.timestampWAIT = 0;
    this.reset();
    this.timestampINVULNERABLE = 120;
}

Ship.prototype.initiateDeath = function (du) {
    // Set variables to prepare for death
    this.power = 0;
    this.rocketPU = false;
    g_interface.beamMeter = this.power;
    this.celNo = 0;
    this.dyingNow = true;
    this.dyingNowInitialize = false;
    if (!g_muted) this.shipSounds.death.play();
}

Ship.prototype.handleMovement = function (du) {
    // If ship is dead, don't handle movement
    if (this.dyingNow) {
        return;
    }
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
    // Movement inputs.
    // Sets celNo in accordance to what sprite should be displayed.
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
    // Animation timestamps for when buttons are no longer pressed.
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

//fires bullets and rockets
Ship.prototype.maybeFireBullet = function (du) {

    var launchDist = this.getRadius() * 1.2;

    if (this.rocketPUCooldown > 0) this.rocketPUCooldown -= du;
    if (this.rocketPUCooldown < 0) this.rocketPUCooldown = 0;

    if (keys[this.KEY_FIRE]) {
        if (!this.ready2Fire) {
            if(this.rocketPU && this.rocketPUCooldown === 0){
                this.maybeFireRocket();
                this.rocketPUCooldown = this.baseCooldown;
            } 
            entityManager.fireBullet(
                this.cx + this.sprite.width, 
                this.cy, 
                this.rotation,
                this.power);
        }
        this.ready2Fire = true;
        if(this.power < 100) {
            this.power += du;
            if (this.power > 20 && !g_muted) this.shipSounds.charge.play();
            if(this.power > 100) this.power = 100;
        }
        // For charge animation
        this.powerTime += du;
    }

    if(!keys[this.KEY_FIRE]){
        
        if(!this.ready2Fire) return;
        else {
            this.ready2Fire = false;
            this.shipSounds.charge.pause();
            this.shipSounds.charge.currentTime = 0;
            this.powerTime = 0;
            if (this.power < 20) {
                this.power = 0;
                return;
            }
            if(this.rocketPU && this.rocketPUCooldown === 0){
                this.maybeFireRocket();
                this.rocketPUCooldown = this.baseCooldown;
            } 
            entityManager.fireBullet(
                this.cx + this.sprite.width, 
                this.cy,
                this.rotation,
                this.power);
            this.power = 0;
        }
    }
    
};

//Fire 2 rockets
Ship.prototype.maybeFireRocket = function () {
    entityManager.fireRocket(
        this.cx + this.sprite.width,
        this.cy + this.sprite.width/2
    )
    entityManager.fireRocket(
        this.cx + this.sprite.width,
        this.cy - this.sprite.width/2
    )
}

Ship.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

// Mark ship as dead
Ship.prototype.takeBulletHit = function () {
    this.dyingNowInitialize = true;
};

// Function for getting the power ups, open for expansion
Ship.prototype.takePowerUp = function (type) {
    switch(type){
        case 1:
            this.rocketPU = true;
            break;
        default:
            break;
    }
}

// Sets ship in spawn location
Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};


Ship.prototype.render = function (ctx) {
    // Conditions for when we shouldn't render anything.
    if (this.timestampWAIT) return;
    if (g_interface.lives<0) return;

    // Death animation
    if (this.dyingNow) {
        var cel = g_spriteAnimations.shipDeath[Math.floor(this.celNo)];
        cel.scale = this._scale;
        cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
        return;
    }

    // Render ship
    // While invulnerable, invulnFrame flickers between true and false.
    if (!this.invulnFrame) {
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
    }
    
};
