// =============================
// INTERFACE (score, lives etc.)
// =============================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Interface(descr) {

    for (var property in descr) {
        this[property] = descr[property];
    }

}

    
// Initial, inheritable, default values
// _attribute means private attribute
Interface.prototype._score = 0;
Interface.prototype._nextLiveCounter = 100000;
Interface.prototype.lives = 2;
Interface.prototype.beamMeter = 0;
Interface.prototype.xIndentation = 152;
Interface.prototype.gameover = false;
Interface.prototype.bossCount = 1;
Interface.prototype.bossLife = 100;
Interface.prototype.bossActive = false;

Interface.prototype.addScore = function(number) {
    this._nextLiveCounter -= number;
    if (this._nextLiveCounter<=0) {
        this.lives++;
        this._nextLiveCounter += 100000;
    }
    if (this._score + number > 9999999) {
        // if score > 9'999'999 then it overextends in interface
        this._score = 9999999;
        return;
    }
    this._score += number;
    this.xIndentation = 163 - this._score.toString().length*11;
}

Interface.prototype.render = function (ctx) {

    if (this.lives < 0) {
        this.gameover = true;
        ctx.save();
        ctx.font = "30px ArcadeClassic";
        ctx.fillStyle = "white";
        ctx.fillText("Game Over",
                     g_canvas.width/2 - 7*11,
                     g_canvas.height/2 - 15);
        ctx.restore();
    }

    if (this.bossCount <= 0) {
        this.gameover = true;
        ctx.save();
        ctx.font = "30px ArcadeClassic";
        ctx.fillStyle = "white";
        ctx.fillText("You Win",
                     g_canvas.width/2 - 7*11,
                     g_canvas.height/2 - 15);
        ctx.fillText("Zraaneth is defeated",
                     g_canvas.width/2 - 17*11,
                     g_canvas.height/2 + 15);
        ctx.restore();
    }

    ctx.save();
    // draw black background for interface
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, g_canvas.height-30, g_canvas.width, 30);
    ctx.fill();

    // TODO: draw images indicating lives
    var total = this.lives;
    // lives more than 5 over-extends
    if (total>5) {
        var cel = g_spriteAnimations.ship[2];
        cel.scale = 0.75;
        cel.drawCenteredAt(ctx, 20, g_canvas.height-22, 0);
        ctx.beginPath();
        ctx.font = "15px ArcadeClassic";
        ctx.fillStyle = "white";
        ctx.fillText("x " + total, 20+18, g_canvas.height-15);
        ctx.fill();
        ctx.beginPath();
    } else {
        for (let i = 0; i < total; i++) {
            var cel = g_spriteAnimations.ship[2];
            cel.scale = 0.75;
            cel.drawCenteredAt(ctx, 20+i*30, g_canvas.height-22, 0);
        }
    }
    // TODO: write player and score text
    ctx.font = "20px ArcadeClassic";
    ctx.fillStyle = "rgb(94,101,172)";
    ctx.fillText("1P-", 163 - 10*11, g_canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText("" + this._score, this.xIndentation, g_canvas.height);
    // TODO: BEAM
    ctx.fillStyle = "rgb(94,101,172)";
    ctx.fillText("BEAM", 163, g_canvas.height-15);
    var xPos = 163+5*11,
        yPos = g_canvas.height-28,
        width = g_canvas.width/3,
        height = 15;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.rect(xPos, yPos, width, height);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(xPos+1, yPos+1, width-2, height-2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.rect(xPos+1, yPos+1, (width-2)*this.beamMeter/100, height-2);
    ctx.fill();
    // TODO: (optional) Write hi-score text
    // Boss HP meter
    if (!this.bossActive || this.bossLife<=0) {
        ctx.restore();
        return;
    }
    var xPos = 163+9*11,
        yPos = 30,
        width = g_canvas.width/3,
        height = 31;
    
    ctx.font = "40px ArcadeClassic";
    ctx.fillStyle = "rgb(202,0,0)";
    ctx.fillText("ZRAANETH ", 163-9*11, 61);
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.rect(xPos, yPos, width, height);
    ctx.fill();
    var wDiff = 10;
    var hDiff = 6;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(xPos+wDiff/2, yPos+hDiff/2, width-wDiff, height-hDiff);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(xPos+wDiff/2, yPos+hDiff/2, (width-wDiff)*this.bossLife/100, height-hDiff);
    ctx.fill();

    ctx.restore();
};

var g_interface = new Interface();