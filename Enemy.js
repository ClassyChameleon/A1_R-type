// ======
// ENEMY
// ======

"use strict";
/* jshint browser: true, devel: true, globalstrict: true */


function Enemy(descr) {
    
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    this.oldY = this.cy;

    // TODO: Sprite setup
    this.sprite = this.sprite || g_sprites.enemy;
    this.scale  = this.scale  || 1;
    this.rotation = this.rotation || Math.PI * (-2/4);
}

Enemy.prototype = new Entity();

Enemy.prototype.velX = -1;
Enemy.prototype.angle = 0;
Enemy.prototype.angleSpeed = 0.01;

Enemy.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Enemy.prototype.Movement = function (du) { // TODO: Makes it so that the enemy does
                                           //       not float out of the screen
    let tempCy = this.cy;
    var halfHeight = this.sprite.height*this._scale/2;

    this.cx += this.velX * du;
    this.angle += this.angleSpeed;
    this.cy = (this.oldY + Math.sin(this.angle) * 100); // multiplying with du makes it bug.

}

Enemy.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.Movement(du);

    spatialManager.register(this);
};

Enemy.prototype.takeBulletHit = function () {
    this.kill();
};

Enemy.prototype.wrapPosition = function () {
    return 0;
}

Enemy.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};


