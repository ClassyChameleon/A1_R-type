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
};

var g_blockVisibility = 0.3;

Block.prototype.render = function (ctx) {
    ctx.fillStyle = "#FF0000";
    ctx.globalAlpha = g_blockVisibility;
    ctx.fillRect(this.cx, this.cy, this.width, this.height);
    ctx.globalAlpha = 1.0;
};