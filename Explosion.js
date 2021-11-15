// Instantiate this to create an explosion effect

"use-strict";

function Explosion(descr) {
    this.cx = descr.cx;
    this.cy = descr.cy;
}

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