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

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Block.prototype = new Entity();
Block.prototype.celNo = 0;

Block.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    //spatialManager.unregister(this);

    this.cx += g_envVel;

    //spatialManager.register(this);
};

Block.prototype.render = function (ctx) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.cx, this.cy, this.length, this.width);
};
