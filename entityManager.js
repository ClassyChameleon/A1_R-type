/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks       : [],
_bullets     : [],
_ships       : [],
_blocks      : [],
_enemies     : [],
_enemyBullets: [],
_powerUps    : [],
_explosions  : [],
_powerUpsFire: [],

_bShowRocks : true,
_bossSpawned: false,

_timeStampSpawner    : 1000,
_timeStampSpawnerMEM : 1000, //memory
_timeStamps          : [0, 0, 0],
// _timeStamps to keep track on how long ago an enemy spawned,
// [0]: worm, [1]: red, [2]: walker

// "PRIVATE" METHODS

_generateRocks : function() {
    var i,
        NUM_ROCKS = 4;

    for (i = 0; i < NUM_ROCKS; ++i) {
        this.generateRock();
    }
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [
        this._rocks, this._bullets, 
        this._ships, this._enemies, 
        this._blocks, this._enemyBullets, 
        this._explosions, this._powerUps, 
        this._powerUpsFire];
},

init: function() {
    //this._generateRocks();
    //this._generateShip();
    //this.generateEnemy();
    //this.generatePowerUp();
},

fireBullet: function(cx, cy, rotation, power) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,

        rotation : rotation,
        power    : power
    }));
},

fireBulletEnemy: function(cx, cy, velX, velY, rotation) {
    this._enemyBullets.push(new EnemyBullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        rotation : rotation,
    }));
},

fireEnemyLazer: function(cx, cy) {
    this._enemyBullets.push(new EnemyLazer({
        cx   : cx,
        cy   : cy,
    }));
},

generateRock : function(descr) {
    this._rocks.push(new Rock(descr));
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

generateBlock : function(descr) {
    this._blocks.push(new Block(descr));
},

maybeGenerateEnemy: function() {
    var spawn = Math.floor(util.randRange(0,this._timeStampSpawner));
    if (spawn === 0) this.generateAllEnemies();
    if (spawn === 1) this.generateWormShipWave();
    if (spawn === 2) this.generateRedShipWave();
    if (spawn === 3) this.generateWalker();
    if (spawn < 4) this.resetTimeSpawner();
    this._timeStampSpawner -= 1;
},

generateAllEnemies: function() {
    this.generateWormShipWave();
    this.generateRedShipWave();
    this.generateWalker();
},

generateEnemy: function() {
    var whatShouldSpawn = Math.floor(util.randRange(0,2));
    if (whatShouldSpawn === 0) this.generateWormShipWave();
    if (whatShouldSpawn === 1) this.generateRedShipWave();
    if (whatShouldSpawn === 2) this.generateWalker();
    /*
    let ship = new WormShip({
        cx : g_canvas.width,
        cy : 200
    });
    ship.init();
    entityManager._enemies.push(new WalkingEnemy());
    entityManager._enemies.push(new SoloEnemy());*/
},

generateWormShipWave: function(descr) {
    if (this._timeStamps[0] > 0) return;
    if (descr === undefined) descr = {};
    let moveType = Math.floor(util.randRange(0,2));
    if (moveType === 0) {
        descr.cy = 200;
        descr.moveType = 0;
    } else {
        descr.cy = 200;
        descr.moveType = 2;
    }
    let ship = new WormShip(descr);
    ship.init();
    this._timeStamps[0] = 60;
},

generateRedShipWave: function(descr) {
    if (this._timeStamps[1] > 0) return;
    let ship = new SoloEnemy(descr);
    ship.init();
    this._timeStamps[1] = 60;
},

generateWalker: function(descr) {
    if (this._timeStamps[2] > 0) return;
    entityManager._enemies.push(new WalkingEnemy(descr));
    this._timeStamps[2] = 100;
},

generateBoss: function(descr) {
    if (this._bossSpawned) return;
    this._bossSpawned = true;

    entityManager._enemies.push(new Boss(descr));
},

resetTimeSpawner: function() {
    if (g_envVel === 0) {
        if (this._timeStampSpawnerMEM > 200)
            this._timeStampSpawnerMEM -= 10;
    }
    this._timeStampSpawner = this._timeStampSpawnerMEM;
},

generatePowerUp: function(cx, cy) {
    this._powerUps.push(new PowerUp({
        cx : cx,
        cy : cy
    }))
},

fireRocket: function(cx, cy) {
    this._powerUpsFire.push(new RocketPower({
        cx   : cx,
        cy   : cy,
    }))
},

generateExplosion: function(x, y) {
    this._explosions.push(new Explosion({
        cx : x,
        cy : y
    }));
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},



resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

update: function(du) {

    g_Background.update(du);

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

    for (let i = 0; i<=2; i++) {
        this._timeStamps[i] -= du;
    }
    //this.maybeGenerateEnemy();
    //if (this._rocks.length === 0) this._generateRocks();
    //if (this._enemies.length === 0) this.generateAllEnemies();

},

render: function(ctx) {

    g_Background.render(ctx);

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }

    g_interface.render(ctx);
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

