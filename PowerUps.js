"use strict";

// Power uppið sjálft. S.s það sem að skipið þarf að ná í
function PowerUp(descr) {
    this.setup(descr);

    this.sprite = g_sprites.Rocket;
    this.flameSprite = g_spriteAnimations.rocketFire;
    this.scale = 1.75;
};

PowerUp.prototype = new Entity();

PowerUp.prototype.cx = 200;
PowerUp.prototype.cy = 200;
PowerUp.prototype.fireCelNo = 0;
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

    this.fireCelNo = Date.now()%1000;
    this.fireCelNo = parseInt(Math.floor(this.fireCelNo*6/1000));
    if (this.fireCelNo >= this.flameSprite.length) this.fireCelNo = 0;
};

PowerUp.prototype.render = function (ctx) {
    var cel = this.sprite;
    cel.scale = this.scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);

    var flame = this.flameSprite[Math.floor(this.fireCelNo)];
    flame.scale = this.scale;
    flame.drawCenteredAt(ctx, this.cx - cel.width, this.cy, 0);
};

// Rocket power up-ið. Þetta eru skotin sjálf
function RocketPower(descr) {
    this.setup(descr);

    this.sprite = g_sprites.Rocket;
    this.flameSprite = g_spriteAnimations.rocketFire;
}

RocketPower.prototype = new Entity();

RocketPower.prototype.cx = 200;
RocketPower.prototype.cy = 200;
RocketPower.prototype.velX = 0.01;
RocketPower.prototype.scale = 1;
RocketPower.prototype.life = 1;
RocketPower.fireCelNo = 0;


RocketPower.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.velX > 20) this.velX = 20;
    this.cx += this.velX * du;
    if (this.velX < 20) this.velX *= 1.5;

    var hitEntity = this.findHitEntity();
    if (hitEntity && !(hitEntity instanceof EnemyBullet) && !(hitEntity instanceof Bullet) && !(hitEntity instanceof Ship)) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) {
            canTakeHit.call(hitEntity);
            g_interface.addScore(100);
        }
        this.life--;
        if(this.life < 1) return entityManager.KILL_ME_NOW;
    }

    if (this.cx > g_canvas.width) {
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);

    this.fireCelNo = Date.now()%1000;
    this.fireCelNo = parseInt(Math.floor(this.fireCelNo*6/1000));
    if (this.fireCelNo >= this.flameSprite.length) this.fireCelNo = 0;

}

RocketPower.prototype.getRadius = function () {
    return this.sprite.height*this.sprite.scale;
};

RocketPower.prototype.render = function (ctx) {
    var cel = this.sprite;
    cel.scale = this.sprite.scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);

    var flame = this.flameSprite[Math.floor(this.fireCelNo)];
    flame.scale = 1.75;
    flame.drawCenteredAt(ctx, this.cx - cel.width, this.cy, 0);
}