// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.type = Math.floor(this.power / 20);
    this.life = this.type + 1;

    switch(this.type){
        case 0:
            break;
        case 1:
            this.sprite = g_spriteAnimations.bullet1;
            break;
        case 2:
            this.sprite = g_spriteAnimations.bullet2;
            break;
        case 3:
            this.sprite = g_spriteAnimations.bullet3;
            break;
        case 4:
            this.sprite = g_spriteAnimations.bullet4;
            break;
        case 5:
            this.sprite = g_spriteAnimations.bullet5;
            break;
        default:
            break;
    }

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 20;
Bullet.prototype.checkStuff = true;
Bullet.prototype.scale = 1.75;
Bullet.prototype.life = 1;
Bullet.prototype.power = 0;
Bullet.prototype.type = 0;

// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
    if (this.checkStuff) {
        this.checkStuff = false;
        console.log("pos: (" + this.cx + ", " + this.cy + ")");
        console.log("vel: (" + this.velX + ", " + this.velY + ")");
        console.log("du: " + du);
    }
    this.cx += this.velX * du;

    this.rotation += 1 * du;
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) {
            canTakeHit.call(hitEntity);
            g_interface.addScore(100);
        }
        this.life--;
        if(this.life < 1) return entityManager.KILL_ME_NOW;
    }
    // If off-screen
    if (this.cx > g_canvas.width) {
        return entityManager.KILL_ME_NOW;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4*this.scale;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.bullet.drawCenteredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
