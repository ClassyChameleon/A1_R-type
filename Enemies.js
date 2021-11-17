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
WormShip.prototype.speed = 4;
WormShip.prototype.moveType = 2;
WormShip.prototype.timestampMove = 0;
WormShip.prototype.celNo = 0;
WormShip.prototype.chanceOfDrop = 5;

WormShip.prototype.init = function() { // Creates the six ships, maybe this belongs in entityManager. Like the _generateRocks method?!?!?!?
    let randStart = this.cy || util.randRange(120, g_canvas.height-20);
    let cx = g_canvas.width;
    let newEnemy;
    for (let index = 0; index < 6; index++) {
        newEnemy = new WormShip({
            cx            : cx + (index * 50),
            cy            : randStart + 20,
            timestampMove : (index * 10),
            moveType      : this.moveType
        });
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
        util.powerChance(this.chanceOfDrop, this.cx, this.cy);
    }
};

WormShip.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // Move according to moveType
    var move = this.speed*this.speed;
    if (this.moveType%2 === 1) {
        var moveX = Math.sqrt(3*move/4);
        var moveY = Math.sqrt(1*move/4);
        this.cx -= (moveX - g_envVel)*du;
        this.cy -= moveY*du*(this.moveType-2);
    } else {
        this.cx -= (this.speed - g_envVel)*du;
    }

    // Change moveType on time intervals
    this.timestampMove -= du;
    if (this.timestampMove <= 0) {
        this.timestampMove += 75;
        this.moveType++;
        if (this.moveType>3) this.moveType = 0;
    }

    // Calculate off-screen deletion
    var halfWidth = this.sprite.width*this.scale/2;
    if (this.cx + halfWidth < 0) return entityManager.KILL_ME_NOW;
    
    this.enemyMaybeFireBullet();

    spatialManager.register(this);
};

WormShip.prototype.render = function (ctx) {

    var celNo = 8;
    if (this.moveType === 1) celNo = 7;
    if (this.moveType === 3) celNo = 9;
    var cel = g_spriteAnimations.brownEnemy[celNo]; // TODO: Make this more like in the game and not just a static image!
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
WalkingEnemy.prototype.cy = g_canvas.height - 100;
WalkingEnemy.prototype.chanceOfDrop = 20;
WalkingEnemy.prototype.stop = false;

WalkingEnemy.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

WalkingEnemy.prototype.takeBulletHit = function () {
    this.hp -= 1;
    if (this.hp === 0) {
        this.deathSound.play();
        this.kill();
        util.powerChance(this.chanceOfDrop, this.cx, this.cy);
    }
};

WalkingEnemy.prototype.update = function (du) {
    spatialManager.unregister(this);
    var walkerSpeed = 2.5*du;

    this.oldX = this.cx + 5;
    for(var i = 1; i < entityManager._blocks.length; i++){
        if(util.boxWalkerCollision(this, entityManager._blocks[i])){
            this.cx = this.oldX;
            walkerSpeed = 0;
            this.stop = true;
        }
    }

    for(var i = 1; i < entityManager._blocks.length; i++){
        let box = entityManager._blocks[i];
        while(
            util.boxWalkerCollision(this, box) && 
            util.boxWalkerFixSpawn(this, box) 
        ){
            return entityManager.KILL_ME_NOW;
        }
    }

    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    var halfWidth = this.sprite.width*this.scale/2;

    if (this.cx + halfWidth < 0) return entityManager.KILL_ME_NOW;


    this.cx += g_envVel;
    if (this.celNo !== 0) this.cx -= walkerSpeed;
    this.enemyMaybeFireBullet();

    spatialManager.register(this);

    // Animation
    // TODO: Make animation not dependant on real time.
    if (this.stop) {
        this.celNo = 0;
        return;
    }
    this.celNo = Date.now()%1000;
    this.celNo = parseInt(Math.floor(this.celNo*6/1000));
    if (this.celNo >= g_spriteAnimations.walkingEnemy.length) this.celNo = 0;
};

WalkingEnemy.prototype.render = function (ctx) {
    var cel = g_spriteAnimations.walkingEnemy[this.celNo];
    cel.scale = this.scale;
    // Walker looks at ship
    var scale = this.scale;
    if (this.cx < entityManager._ships[0].cx) scale *= -1;
    console.log(scale);
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0, scale);
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
SoloEnemy.prototype.angleSpeed = 0.09;
SoloEnemy.prototype.celNo = 0;
SoloEnemy.prototype.cx = g_canvas.width;
SoloEnemy.prototype.cy = 100;
SoloEnemy.prototype.chanceOfDrop = 10;

SoloEnemy.prototype.init = function() { 
    let randStart = util.randRange(120, g_canvas.height-200);
    let cx = g_canvas.width;
    let newEnemy;
    for (let index = 0; index < 4; index++) {
        if (index % 2 === 0) {
            newEnemy = new SoloEnemy({
                cx : cx + (index * 60),
                cy : randStart + 20
            });
        }
        else {
            newEnemy = new SoloEnemy({
                cx : cx + (index * 60),
                cy : randStart - 20,
            });
        }
        entityManager._enemies.push(newEnemy);
    }
};

SoloEnemy.prototype.getRadius = function () {
    return (this.sprite.width / 2 );
};

SoloEnemy.prototype.takeBulletHit = function () {
    this.hp -= 1;
    if (this.hp === 0) {
        this.deathSound.play();
        this.kill();
        util.powerChance(this.chanceOfDrop, this.cx, this.cy);
    }
};

SoloEnemy.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    var halfWidth = this.sprite.width*this.scale/2;

    if (this.cx + halfWidth < 0) return entityManager.KILL_ME_NOW;

    this.cx -= (3.5-g_envVel)*du;
    this.angle += this.angleSpeed * du;
    this.cy = (this.oldY + Math.sin(this.angle) * 50);

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
};

function Boss(descr) {
    this.setup(descr);
    this.isAlive = true;
    this.hp = 100;

    this.sprite = this.sprite || g_spriteAnimations.boss[0];
    this.scale = 3;
    this.rotation = Math.PI * (-2/4)
}

Boss.prototype = new Entity();
Boss.prototype.deathSound = new Audio(
    "sounds/enemyDeath.ogg"
);

Boss.prototype.angle = 0;
Boss.prototype.angleSpeed = 0.01;
Boss.prototype.celNo = 0;
Boss.prototype.cx = g_canvas.width - 150;
Boss.prototype.cy = g_canvas.height - 200;
Boss.prototype.velY = 0;
Boss.prototype.jumping = false;
Boss.prototype.floatTime = 0;

Boss.prototype.getRadius = function () {
    return (this.sprite.height / 2) * this.scale * 0.5;
};

Boss.prototype.takeBulletHit = function () {
    this.hp -= 1;
    if (this.hp === 0) {
        this.deathSound.play();
        this.kill();
        g_interface.bossCount -= 1;
    }
};

Boss.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    var halfWidth = this.sprite.width*this.scale/2;

    if (this.cx + halfWidth < 0) return entityManager.KILL_ME_NOW;

    // this.cx += g_envVel;
    // if (this.celNo !== 0) this.cx -= 2.5*du;
    if(this.jumping) {
        this.enemyMaybeFireBullet(0.01, -85, -15);    
        this.maybeFireLazer(55, 50);
    } 
    else {
        this.enemyMaybeFireBullet(0.01, -65, 15);
        this.maybeFireLazer(30, 20);
        
    } 
    this.maybeJump(du);

    spatialManager.register(this);

    // Animation
    // TODO: Make animation not dependant on real time.
};

Boss.prototype.maybeFireLazer = function (cx, cy) {
    if (0.01 > Math.random()) {
        entityManager.fireEnemyLazer(
            this.cx - cx, 
            this.cy - cy
            );
    }
}

//The ugliest code I have ever made, but it works™
Boss.prototype.maybeJump = function (du) {
    if (this.jumping){
        if(this.velY > 0){
            this.cy -= this.velY;
            this.velY -= 0.5*du;
            if(this.cy < g_canvas.height/3){
                this. cy = g_canvas.height/3;
                this.velY = 0;
            }
            if(this.velY < 0) this.velY = 0;
        }
        else if(this.floatTime > 0){
            this.celNo = 1
            this.floatTime -= du;
        }
        else if(this.cy < g_canvas.height - 200){
            this.cy -= this.velY;
            this.velY -= 0.5*du;
            this.celNo = 2;
            if(this.cy >= g_canvas.height - 200){
                this.velY = 0;
                this.cy = g_canvas.height - 200;
                this.jumping = false;
                this.celNo = 0;
            }
        }
    }
    if(0.005 > Math.random() && !this.jumping) {
        this.celNo = 2;
        this.jumping = true;
        this.velY = util.randRange(5, 11);
        this.floatTime = util.randRange(100, 301);
    }
}

Boss.prototype.render = function (ctx) {
    var cel = g_spriteAnimations.boss[this.celNo];
    cel.scale = this.scale;
    cel.drawCenteredAt(ctx, this.cx, this.cy, 0);
};