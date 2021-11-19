// =========================
// Explosion (visual effect)
// =========================
// Instantiate this to create an explosion effect.
// Requires descr parameter with cx and cy coordinates.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


"use-strict";

function Explosion(descr) {
    this.cx = descr.cx;
    this.cy = descr.cy;
}

// If we see an explosion in top-left corner,
// then we know an explosion was instantiated incorrectly.
Explosion.prototype.cx = 0;
Explosion.prototype.cy = 0;
Explosion.prototype.celNo = 0;

Explosion.prototype.update = function(du) {
    this.celNo += 0.25;
    if (this.celNo >= g_spriteAnimations.explosion.length) {
        return entityManager.KILL_ME_NOW;
    }
}

Explosion.prototype.render = function(ctx) {
    var cel = g_spriteAnimations.explosion[Math.floor(this.celNo)];
    cel.scale = 1.75;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
}