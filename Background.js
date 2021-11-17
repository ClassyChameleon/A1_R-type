// =============================
// Background (score, lives etc.)
// =============================

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

    
// Initial, inheritable, default values
// _attribute means private attribute
Background.prototype.cx = 4678;
Background.prototype.cy = g_canvas.height/2-15;

Background.prototype.update = function (du) {
    if(this.cx > 1560){
        this.cx += g_envVel;
    } else {
        g_envVel = 0;
        entityManager.generateBoss();
    }
}

Background.prototype.render = function (ctx) {

    g_sprites.level.drawCentredAt(ctx, this.cx, this.cy);

};

var g_Background = new Background();