// ==============
// SPRITEANIMATED
// ==============
// Used instead of Sprite when using a sprite sheet.
// Includes a handy animate function.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// (sx,sy) is top left point of sprite in given spritesheet.
// width and height for the size of sprite.
function SpriteAnimated(sx, sy, width, height, spriteSheet) {
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.image = spriteSheet;
}

// ctx, cx and cy are required.
// scale is used for x axis only (currently used to turn walker around)
SpriteAnimated.prototype.drawCenteredAt = function (ctx, cx, cy, rotation, scale) {
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = this.scale;

    ctx.save();
    
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scale, this.scale);
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
        this.sx, this.sy, this.width, this.height,
        -this.width/2, -this.height/2, this.width, this.height);
        
    
    ctx.restore();
}

// To automate sprite animation.
// celWidth and celHeight for each sprite cells height and width.
// numCols for number of collumns (X-axis)
// numRows for number of rows (Y-axis)
// numCels for number of total cells. Useful if some rows aren't full.
// sheet is the spriteSheet where the sprites will be taken from.
// startW, startH is top-left location of first sprite in the field.
// Note: This is only useful if the majority of sprites in the spritesheet are
// equally big, equally spaced apart and equally centered.
function animate(celWidth, celHeight, numCols, numRows, numCels, sheet, startW, startH) {
    var sprites = [];
    var sprite;
    
    for (var row = 0; row < numRows; ++row) {
        for (var col = 0; col < numCols; ++col) {
            sprite = new SpriteAnimated(col * celWidth + startW, row * celHeight + startH,
                                celWidth, celHeight, sheet); 
            sprites.push(sprite);
        }
    }
    
    // Remove any superfluous ones from the end
    sprites.splice(numCels);
    return sprites;
}