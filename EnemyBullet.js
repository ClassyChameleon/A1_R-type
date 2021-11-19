"use strict";

// A generic contructor which accepts an arbitrary descriptor object
//=====================
// Generic Enemy Bullet
//=====================
function EnemyBullet(descr) {
    
    // Common inherited setup logic from Entity
    this.setup(descr);
    this.sprite = g_sprites.bullet;

    if (!g_muted) this.fireSound.play();
};

EnemyBullet.prototype = new Entity();

EnemyBullet.prototype.fireSound = new Audio(
    "sounds/enemyBullet.ogg");

EnemyBullet.prototype.rotation = 0;
EnemyBullet.prototype.cx = 200;
EnemyBullet.prototype.cy = 200;
EnemyBullet.prototype.velX = 20;
EnemyBullet.prototype.velY = 20;
EnemyBullet.prototype.celNo = 0;

EnemyBullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

EnemyBullet.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    
    this.cx += this.velX * du;
    this.cy += this.velY * du;
    
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (hitEntity instanceof Ship && canTakeHit) {
            canTakeHit.call(hitEntity);
            return entityManager.KILL_ME_NOW;
        }
    }
    // If off-screen
    if (this.cx > g_canvas.width) {
        return entityManager.KILL_ME_NOW;
    }
    
    spatialManager.register(this);

    this.celNo += 0.2;
    if (this.celNo >= g_spriteAnimations.enemyBullet.length) this.celNo = 0;
};

EnemyBullet.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

EnemyBullet.prototype.render = function (ctx) {
    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    var cel = g_spriteAnimations.enemyBullet[Math.floor(this.celNo)];
    cel.scale = 1.75;
    cel.drawCenteredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};

// A generic contructor which accepts an arbitrary descriptor object
//===============
// The Boss Laser
//===============
function EnemyLazer(descr) {
    
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_spriteAnimations.enemyLazer;
    this.scale = 0.4;
    this.celNo = this.sprite.length - 1;
}

EnemyLazer.prototype = new Entity();

EnemyLazer.prototype.rotation = 0;
EnemyLazer.prototype.cx = 200;
EnemyLazer.prototype.cy = 200;
EnemyLazer.prototype.velX = 10;

EnemyLazer.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

EnemyLazer.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    
    this.cx -= this.velX * du;
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    // Can only kill a Ship entity (i.e. the player)
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (hitEntity instanceof Ship && canTakeHit) {
            canTakeHit.call(hitEntity);
        }
    }
    // If off-screen
    if (this.cx > g_canvas.width) {
        return entityManager.KILL_ME_NOW;
    }
    
    spatialManager.register(this);

    this.celNo -= 0.2;
    if (this.celNo <= 0) this.celNo = this.sprite.length - 1;
};

EnemyLazer.prototype.getRadius = function () {
    return (this.sprite[0].width / 2) * this.scale;
};

EnemyLazer.prototype.render = function (ctx) {
    var cel = this.sprite[Math.floor(this.celNo)];
    cel.scale = 0.90;
    cel.drawCenteredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};