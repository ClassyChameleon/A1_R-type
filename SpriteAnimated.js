// Used instead of Sprite when using a sprite sheet

function SpriteAnimated(sx, sy, width, height, spriteSheet) {
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.image = spriteSheet;
}

SpriteAnimated.prototype.drawCenteredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;

    ctx.save();
    
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
        this.sx, this.sy, this.width, this.height,
        -this.width/2, -this.height/2, this.width, this.height);
        
    
    ctx.restore();
}

//TODO: Maybe there's a better way to store/use this function.
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