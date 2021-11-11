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
        cx : 200,
        cy : 20,
        width: 100,
        height: 50
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

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship2
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
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
        ship         : "https://notendur.hi.is/~pk/308G/images/ship.png",
        ship2        : "https://notendur.hi.is/~pk/308G/images/ship_2.png",
        rock         : "https://notendur.hi.is/~pk/308G/images/rock.png",
        playerSheet  : "https://notendur.hi.is/~gvg8/308G/imgs/R-type.gif",
        redEnemy     : "https://notendur.hi.is/~gvg8/308G/imgs/r-redEnemy.gif"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_spriteAnimations = {}

function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.rock  = new Sprite(g_images.rock);
    g_sprites.enemy = new Sprite(g_images.ship2);

    //g_sprites.bullet = new Sprite(g_images.ship);
    //g_sprites.bullet.scale = 0.25;
    g_sprites.bullet = new SpriteAnimated(247, 88, 20, 7, g_images.playerSheet);
    g_sprites.bullet.scale = 1.75;

    // 2 frames, [1]
    g_spriteAnimations.bullet1 = animate(19, 14, 2, 1, 2, g_images.playerSheet, 230, 102);
    g_spriteAnimations.bullet2 = animate(34, 14, 2, 1, 2, g_images.playerSheet, 199, 119);
    g_spriteAnimations.bullet3 = animate(49, 16, 2, 1, 2, g_images.playerSheet, 167, 136);
    g_spriteAnimations.bullet4 = animate(66, 16, 2, 1, 2, g_images.playerSheet, 135, 152);
    g_spriteAnimations.bullet5 = animate(82, 16, 2, 1, 2, g_images.playerSheet, 103, 169);

    // 2 frames, [1]
    g_spriteAnimations.fireBullet = animate(19, 15, 2, 1, 2, g_images.playerSheet, 214, 83);
    // 8 frames, [7]
    g_spriteAnimations.charge = animate(33, 35, 8, 1, 8, g_images.playerSheet, 2, 50);

    g_spriteAnimations.rock = animate(64, 64, 5, 6, 30, g_images.rockAnimated, 0, 0)
    g_spriteAnimations.ship = animate(33, 17, 5, 1, 5, g_images.playerSheet, 100.5, 0)

    g_spriteAnimations.redEnemy = animate(33, 36, 8, 1, 8, g_images.redEnemy, 0, 0);

    entityManager.init();
    createInitialShips();
    createInitialEnvironment();

    main.init();
}

// Kick it off
requestPreloads();