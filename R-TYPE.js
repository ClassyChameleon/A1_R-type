// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip({
        cx : 200,
        cy : 200
    });
    
}

function createInitialEnvironment(){
    entityManager.generateBlock({
        cx : 0,
        cy : 410,
        width: 3800,
        height: 40
    });

    entityManager.generateBlock({
        cx : 370,
        cy : 370,
        width: 130,
        height: 40
    });

    entityManager.generateBlock({
        cx : 500,
        cy : 390,
        width: 130,
        height: 20
    });

    entityManager.generateBlock({
        cx : 1245,
        cy : 390,
        width: 130,
        height: 20
    });

    entityManager.generateBlock({
        cx : 1495,
        cy : 370,
        width: 130,
        height: 40
    });

    entityManager.generateBlock({
        cx : 2615,
        cy : 390,
        width: 130,
        height: 20
    });

    entityManager.generateBlock({
        cx : 3490,
        cy : 390,
        width: 130,
        height: 20
    });

    entityManager.generateBlock({
        cx : 3615,
        cy : 370,
        width: 130,
        height: 40
    });

    //tunnel1
    entityManager.generateBlock({
        cx : 2910,
        cy : 265,
        width: 210,
        height: 145
    });

    //tunnel2
    entityManager.generateBlock({
        cx : 2910,
        cy : 0,
        width: 210,
        height: 185
    });


    entityManager.generateBlock({
        cx : 3120,
        cy : 0,
        width: 800,
        height: 40
    });

    entityManager.generateBlock({
        cx : 3490,
        cy : 40,
        width: 130,
        height: 20
    });

    entityManager.generateBlock({
        cx : 3615,
        cy : 40,
        width: 130,
        height: 40
    });
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

    // Prevent perpetual firing!
    //eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    //if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    // Cheats to demonstrate some features
    // Add 10'000 score
    if (eatKey(KEY_1)) g_interface.addScore(10000);
    // Faster scrolling
    if (eatKey(KEY_2)) g_envVel -= 0.5;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        playerSheet  : "imgs/R-type.gif",
        redEnemy     : "imgs/r-redEnemy.gif",
        walkingEnemy : "imgs/r-walkingEnemy.gif",
        brownEnemy   : "imgs/r-brownEnemy.gif",
        boss         : "imgs/r-smallBoss.gif",
        enemyBullet  : "imgs/r-enemyBullet.gif",
        explosions   : "imgs/r-explosions.gif",
        level        : "imgs/level1.png",
        lazers       : "imgs/r-laserFire.gif",
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_spriteAnimations = {}

function preloadDone() {

    g_sprites.level = new Sprite(g_images.level);
    g_sprites.level.scale = 2.6;
    //g_sprites.bullet = new Sprite(g_images.ship);
    //g_sprites.bullet.scale = 0.25;
    g_sprites.bullet = new SpriteAnimated(247, 88, 20, 7, g_images.playerSheet);
    g_sprites.bullet.scale = 1.75;
    g_sprites.Rocket = new SpriteAnimated(335, 255, 15, 5, g_images.playerSheet);
    g_sprites.Rocket.scale = 1.75;

    // 2 frames, [1]
    g_spriteAnimations.bullet1 = animate(19, 14, 2, 1, 2, g_images.playerSheet, 230, 102);
    g_spriteAnimations.bullet2 = animate(34, 14, 2, 1, 2, g_images.playerSheet, 199, 119);
    g_spriteAnimations.bullet3 = animate(49, 16, 2, 1, 2, g_images.playerSheet, 167, 136);
    g_spriteAnimations.bullet4 = animate(66, 16, 2, 1, 2, g_images.playerSheet, 135, 152);
    g_spriteAnimations.bullet5 = animate(82, 16, 2, 1, 2, g_images.playerSheet, 103, 169);

    g_spriteAnimations.enemyBullet = animate(7+10, 7, 4, 1, 4, g_images.enemyBullet, 136-5, 6);
    g_spriteAnimations.enemyLazer = animate(66, 34, 4, 2, 8, g_images.lazers, 300, 469);

    // 2 frames, [1]
    g_spriteAnimations.fireBullet = animate(19, 15, 2, 1, 2, g_images.playerSheet, 214, 83);
    // 8 frames, [7]
    g_spriteAnimations.charge = animate(33, 35, 8, 1, 8, g_images.playerSheet, 2, 50);

    g_spriteAnimations.ship = animate(33, 17, 5, 1, 5, g_images.playerSheet, 100.5, 0);
    g_spriteAnimations.shipDeath = animate(32.6, 30, 8, 1, 8, g_images.playerSheet, 69-2*32.5, 342);
    g_spriteAnimations.shipDeath[0] = new SpriteAnimated(0, 342, 34, 30, g_images.playerSheet);
    g_spriteAnimations.shipDeath[1] = new SpriteAnimated(34, 342, 34, 30, g_images.playerSheet);

    // ENEMIES
    g_spriteAnimations.redEnemy = animate(33, 36, 8, 1, 8, g_images.redEnemy, 0, 0);
    g_spriteAnimations.brownEnemy = animate(33, 34, 8, 2, 16, g_images.brownEnemy, 0, 0);
    g_spriteAnimations.walkingEnemy = animate(33, 33, 3, 1, 3, g_images.walkingEnemy, 0, 0);
    g_spriteAnimations.boss = animate(54, 57, 1, 1, 1, g_images.boss, 0, 0);

    g_spriteAnimations.explosion = animate(33, 33, 6, 1, 6, g_images.explosions, 128, 0);

    // power ups
    g_spriteAnimations.rocketFire = animate(16, 14, 7, 1, 7, g_images.playerSheet, 210, 275);

    entityManager.init();
    createInitialShips();
    createInitialEnvironment();

    main.init();
}

// Kick it off
requestPreloads();