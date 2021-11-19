// =========================
// Background (level sprite)
// =========================
// Rendered first (in the back)

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Background(descr) {

    for (var property in descr) {
        this[property] = descr[property];
    }

}

// For when we're reaching the boss enemy
var  g_StopEnemySpawn = false;

// Initial, inheritable, default values
Background.prototype.cx = 4678;
Background.prototype.cy = g_canvas.height/2-15;

Background.prototype.update = function (du) {
    // If we're close to boss, stop enemy spawn
    if(this.cx < 2470) g_StopEnemySpawn = true;
    if(this.cx > 1558){
        this.cx += g_envVel;
    } else {
        // Boss reached
        g_envVel = 0;
        entityManager.generateBoss();
    }
}

Background.prototype.render = function (ctx) {

    g_sprites.level.drawCentredAt(ctx, this.cx, this.cy);

};

// One and only instance of Background.
var g_Background = new Background();