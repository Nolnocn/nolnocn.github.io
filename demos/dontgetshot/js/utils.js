"use strict";
var game = game || {};

game.utils = function() {
    
    function calcAngle(x1, y1, x2, y2) {
        var dY = y2 - y1;
        var dX = x2 - x1;
        var angle = Math.atan2(dY, dX);
        return angle;
    }
    
    function calcDistance(x1, y1, x2, y2) {
        var xs = 0;
        var ys = 0;
        
        xs = x2 - x1;
        xs = xs * xs;

        ys = y2 - y1;
        ys = ys * ys;
        
        return Math.sqrt(xs + ys);
    }
    
    function move(dt){
        this.x += Math.cos(this.rot) * this.speed * dt;
        this.y += Math.sin(this.rot) * this.speed * dt;
    }
    
    return {
        calcAngle: calcAngle,
        calcDistance: calcDistance,
        move: move
	};
}();