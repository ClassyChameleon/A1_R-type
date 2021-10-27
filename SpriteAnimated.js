// TODO: Make the asteroid sprite animation work
function SpriteAnimated(sx, sy, width, height) {
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.image = g_rockSpriteSheet;
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
        -this.height/2, -this.width/2, this.width, this.height);
        
    
    ctx.restore();
}


var g_rockSpriteSheet;
    
function preload() {
    g_rockSpriteSheet = new Image();
    g_rockSpriteSheet.onload = preloadDone;
    g_rockSpriteSheet.src = "https://notendur.hi.is/~pk/308G/images/rocks.png";
}
var g_rockSprites;

function preloadDone() {
    
    var celWidth  = 64;
    var celHeight = 64;
    var numCols = 5;
    var numRows = 6;
    var numCels = 30;
    
    g_rockSprites = [];
    var sprite;
    
    for (var row = 0; row < numRows; ++row) {
        for (var col = 0; col < numCols; ++col) {
            sprite = new SpriteAnimated(col * celWidth, row * celHeight,
                                celWidth, celHeight) 
            g_rockSprites.push(sprite);
        }
    }
    
    // Remove any superfluous ones from the end
    g_rockSprites.splice(numCels);
}
// Kick it off.
preload();