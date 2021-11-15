"use strict";

function PowerUp(descr) {
    this.setup(descr);

    this.sprite = g_spriteAnimations.ship[2];
    this.scale = 1.5;
};

PowerUp.prototype = new Entity();

PowerUp.prototype.cx = 200;
PowerUp.prototype.cy = 200;
PowerUp.prototype.type = 1; //type 1 = rockets, type 2 = , type 3 = 

PowerUp.prototype.getRadius = function () {
    return (this.sprite.width / 2);
};

PowerUp.prototype.update = function (du) {
    spatialManager.unregister(this);

    if(this.cx + this.sprite.width*this.scale/2 < 0) return entityManager.KILL_ME_NOW;

    this.cx -= 1*du;

    let hitEntity = this.findHitEntity();
    if(hitEntity) {
        var canTakePower = hitEntity.takePowerUp;
        if(hitEntity instanceof Ship && canTakePower) {
            canTakePower.call(hitEntity, this.type);
            return entityManager.KILL_ME_NOW;
        }
    }

    spatialManager.register(this);
};

PowerUp.prototype.render = function (ctx) {
    var cel = g_spriteAnimations.ship[2];
    cel.scale = this.scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
};