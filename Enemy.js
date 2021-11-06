// ======
// ENEMY
// ======

"use strict";
/* jshint browser: true, devel: true, globalstrict: true */


function Enemy(descr) {
    
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.randomiseEntry();


    // TODO: Sprite setup
    this.sprite = this.sprite || g_sprites.enemy;
    this.scale  = this.scale  || 1;
}

Enemy.prototype = new Entity();

Enemy.prototype.randomiseEntry = function () {
    this.cx = this.cx || g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
    this.rotation = this.rotation || 0;
}

Enemy.prototype.velX = -1;
Enemy.prototype.velY = 0;

Enemy.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
};

Enemy.prototype.takeBulletHit = function () {
    this.kill();
};

Enemy.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
