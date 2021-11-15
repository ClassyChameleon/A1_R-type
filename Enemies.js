"use strict";

function WormShip(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.isAlive = true;
    this.hp = this.hp || 1;
    this.oldY = this.cy;


    this.sprite = this.sprite || g_spriteAnimations.brownEnemy[0];
    this.scale  = this.scale  || 1.75;
    this.rotation = this.rotation || Math.PI * (-2/4);
};

WormShip.prototype = new Entity();

WormShip.prototype.deathSound = new Audio(
    "sounds/enemyDeath.ogg"
);
WormShip.prototype.angle = 0;
WormShip.prototype.angleSpeed = 0.01;
WormShip.prototype.celNo = 0;

WormShip.prototype.init = function() { // Creates the six ships, maybe this belongs in entityManager. Like the _generateRocks method?!?!?!?
    let randStart = util.randRange(20, g_canvas.height-20);
    let cx = g_canvas.width;
    let newEnemy;
    for (let index = 0; index < 6; index++) {
        if (index % 2 === 0) {
            newEnemy = new WormShip({
                cx : cx + (index * 60),
                cy : randStart + 20
            });
        }
        else {
            newEnemy = new WormShip({
                cx : cx + (index * 60),
                cy : randStart - 20,
            });
        }
        entityManager._enemies.push(newEnemy);
    }
};

WormShip.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

WormShip.prototype.takeBulletHit = function () {
    this.hp -= 1;
    if (this.hp === 0) {
        this.deathSound.play();
        this.kill();
    }
};

WormShip.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    var halfWidth = this.sprite.width*this.scale/2;

    if (this.cx + halfWidth < 0) return entityManager.KILL_ME_NOW;

    this.cx -= 4*du;
    this.angle += this.angleSpeed * du;
    this.cy = (this.oldY + Math.sin(this.angle) * 100);
    
    this.enemyMaybeFireBullet();

    spatialManager.register(this);

    // Animation
    // TODO: Make animation not dependant on real time.
    this.celNo = Date.now()%1000;
    this.celNo = parseInt((this.celNo*9/1000));
    if (this.celNo >= g_spriteAnimations.brownEnemy.length) this.celNo = 0;
};

WormShip.prototype.render = function (ctx) {
    /*
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
    */
    var cel = g_spriteAnimations.brownEnemy[0]; // TODO: Make this more like in the game and not just a static image!
    cel.scale = this.scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
};

function WalkingEnemy(descr) {
    this.setup(descr);

    this.isAlive = true;
    this.hp = this.hp || 1;

    this.sprite = this.sprite || g_spriteAnimations.walkingEnemy[0];
    this.scale  = this.scale  || 1.75;
    this.rotation = this.rotation || Math.PI * (-2/4);
}

WalkingEnemy.prototype = new Entity();
WalkingEnemy.prototype.deathSound = new Audio(
    "sounds/enemyDeath.ogg"
);

WalkingEnemy.prototype.angle = 0;
WalkingEnemy.prototype.angleSpeed = 0.01;
WalkingEnemy.prototype.celNo = 0;
WalkingEnemy.prototype.cx = g_canvas.width;
WalkingEnemy.prototype.cy = g_canvas.height - 60;

WalkingEnemy.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

WalkingEnemy.prototype.takeBulletHit = function () {
    this.hp -= 1;
    if (this.hp === 0) {
        this.deathSound.play();
        this.kill();
    }
};

WalkingEnemy.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    var halfWidth = this.sprite.width*this.scale/2;

    if (this.cx + halfWidth < 0) return entityManager.KILL_ME_NOW;

    if (this.celNo !== 0) this.cx -= 2.5*du;    
    this.enemyMaybeFireBullet();

    spatialManager.register(this);

    // Animation
    // TODO: Make animation not dependant on real time.
    this.celNo = Date.now()%1000;
    this.celNo = parseInt(Math.floor(this.celNo*6/1000));
    if (this.celNo >= g_spriteAnimations.walkingEnemy.length) this.celNo = 0;
};

WalkingEnemy.prototype.render = function (ctx) {
    /*
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
    */
    var cel = g_spriteAnimations.walkingEnemy[this.celNo];
    cel.scale = this.scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
};

function SoloEnemy(descr) {
    this.setup(descr);

    this.isAlive = true;
    this.hp = this.hp || 1;

    this.oldY = this.cy;

    this.sprite = this.sprite || g_spriteAnimations.redEnemy[0];
    this.scale = this.scale || 1.75;
    this.rotation = this.rotation || Math.PI * (-2/4);
};

SoloEnemy.prototype = new Entity();
SoloEnemy.prototype.deathSound = new Audio(
    "sounds/enemyDeath.ogg"
);
SoloEnemy.prototype.angle = 0;
SoloEnemy.prototype.angleSpeed = 0.03;
SoloEnemy.prototype.celNo = 0;
SoloEnemy.prototype.cx = g_canvas.width;
SoloEnemy.prototype.cy = 100;

SoloEnemy.prototype.getRadius = function () {
    return (this.sprite.width / 2 );
};

SoloEnemy.prototype.takeBulletHit = function () {
    this.hp -= 1;
    if (this.hp === 0) {
        this.deathSound.play();
        this.kill();
    }
};

SoloEnemy.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    var halfWidth = this.sprite.width*this.scale/2;

    if (this.cx + halfWidth < 0) return entityManager.KILL_ME_NOW;

    this.cx -= 4*du;
    this.angle += this.angleSpeed * du;
    this.cy = (this.oldY + Math.sin(this.angle) * 100);

    this.enemyMaybeFireBullet();
    
    spatialManager.register(this);

    this.celNo = Date.now()%1000;
    this.celNo = parseInt(Math.floor(this.celNo*9/1000));
    if (this.celNo >= g_spriteAnimations.redEnemy.length) this.celNo = 0;
};

SoloEnemy.prototype.render = function (ctx) {
    var cel = g_spriteAnimations.redEnemy[this.celNo];
    cel.scale = this.scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
}