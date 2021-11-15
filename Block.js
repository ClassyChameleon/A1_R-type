// ====
// ROCK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Block(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

};

Block.prototype = new Entity();
Block.prototype.celNo = 0;


Block.prototype.update = function (du) {
    this.cx += g_envVel;
    if(this.cx < 0 - this.width){
        var index = entityManager._blocks.indexOf(this);
        if (index > -1) {
            entityManager._blocks.splice(index, 1);
        }
        return entityManager.KILL_ME_NOW;
    }
};

Block.prototype.render = function (ctx) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.cx, this.cy, this.width, this.height);
};
