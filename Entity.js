// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

};

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();
    
    // I am not dead yet!
    this._isDeadNow = false;
};

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

Entity.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};

Entity.prototype.getRadius = function () {
    return 0;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    if (this.power === undefined)
        entityManager.generateExplosion(this.cx, this.cy);
    this._isDeadNow = true;
};

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};

Entity.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Entity.prototype.enemyMaybeFireBullet = function (chance=0.002, bulletStartX = 0, bulletStartY = 0) { // TODO: Kannski breyta?!
    var speed = 4; // FIXME: ??? maybe the speed is not constat will look at later

    bulletStartX += this.cx;
    bulletStartY += this.cy;
    
    var yVel = entityManager._ships[0].cy-bulletStartY;
    var xVel = entityManager._ships[0].cx-bulletStartX;
    
    var angleRadians = Math.atan2(
        entityManager._ships[0].cy-this.cy,
        entityManager._ships[0].cx-this.cx
    );

    var yfinal = speed*yVel/Math.sqrt((yVel*yVel)+(xVel*xVel));
    var xfinal = speed*xVel/Math.sqrt((yVel*yVel)+(xVel*xVel));

    if (chance > Math.random()) {
        entityManager.fireBulletEnemy(
            bulletStartX, 
            bulletStartY,
            xfinal,
            yfinal,
            0);
    }

};