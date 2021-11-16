// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},

// CHANCE OF POWER UP
// ==================

// needs chance(number from 1-100 and location to spawn power up)
powerChance: function(chance, cx, cy) {
    let fullChance = Math.floor(this.randRange(1, 101));
    if(fullChance <= chance) entityManager.generatePowerUp(cx, cy);
    console.log("fullchance: ", fullChance);
    console.log("chance: ", chance);
    return;
},


// MISC
// ====

square: function(x) {
    return x*x;
},

min: function(num1, num2) {
    if (num1 < num2) return num1;
    return num2;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

boxPointCollision: function(ctx, srcX, srcY, posX, posY, height, width){
    if(srcX > posX && srcX < posX+height){
        if(srcY > posY && srcY < posY+width){
            return true;
        }
    }
    return false;
},

boxBoxCollision: function(ship, entity){
    var isColliding = false;
    var scale = ship._scale;
    var w1 = ship.sprite.width*scale;    var w2 = entity.width;
    var h1 = ship.sprite.height*scale;   var h2 = entity.height;
    var x1 = ship.cx - (w1/2);           var x2 = entity.cx;
    var y1 = ship.cy - (h1/2);           var y2 = entity.cy;

    if (x1     <   x2+w2 &&
        x1+w1  >   x2    &&
        y1     <   y2+h2 &&
        h1+y1  >   y2){
            isColliding = true;
            return isColliding;
    }
    return isColliding;
}

};
