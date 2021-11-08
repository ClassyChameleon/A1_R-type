// =============================
// INTERFACE (score, lives etc.)
// =============================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Interface(descr) {

    for (var property in descr) {
        this[property] = descr[property];
    }

}

    
// Initial, inheritable, default values
Interface.prototype.score = 1234567890;
Interface.prototype.lives = 2;
Interface.prototype.beamMeter = 0;

Interface.prototype.render = function (ctx) {
    ctx.save()

    // draw black background for interface
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, g_canvas.height-30, g_canvas.width, 30);
    ctx.fill();

    // TODO: draw images indicating lives
    // TODO: write player and score text
    ctx.beginPath();
    ctx.font = "20px ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.fillText("" + this.score, 163, g_canvas.height);
    // TODO: draw beam meter
    // TODO: (optional) Write hi-score text

    ctx.restore();
};

var g_interface = new Interface();