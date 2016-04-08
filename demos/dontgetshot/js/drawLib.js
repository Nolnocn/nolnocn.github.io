"use strict";

var game = game || {};

game.drawLib = {
    clear: function(ctx, x, y, w, h) {
        ctx.clearRect(x, y, w, h);
    },
    
    drawRect: function(ctx, x, y, w, h, rot, col) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = col;
        ctx.fillRect(w * -0.5,
                     h * -0.5,
                     w * 0.5,
                     h * 0.5)
        ctx.restore();
    },
    
    drawImg: function(ctx, img, x, y, rot) {
        ctx.save();
        ctx.translate(Math.round(x), Math.round(y));
        ctx.rotate(rot);
        ctx.drawImage(img,
                      Math.round(img.width * -0.5),
                      Math.round(img.height * -0.5));
        ctx.restore();
    },
    
    text: function(ctx, string, x, y, size, col) {
        ctx.save();
        ctx.font = size + "px PressStart2P";
        ctx.fillStyle = col;
        ctx.fillText(string, x, y);
        ctx.restore();
    }
};