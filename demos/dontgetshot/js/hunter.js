"use strict";

var game = game || {};

game.Hunter = function() {
    function Hunter(x, y) {
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.speed = 50 + 10 * Math.random() - 5;
        this.fireTime = 0;
        this.fireDelay = 2.5;
        this.debrisCount = 20;
        this.color = '#FF8000';
        this.active = true;
        this.onscreen = false;
        this.fireHoming = true;
        this.scoreVal = 25;
    }
    
    var p = Hunter.prototype;
    p.draw = undefined;
    p.update = undefined;
    p.rotateToPlayer = undefined;
    p.move = undefined;
    p.fire = undefined;
    p.die = undefined;
    p.leave = undefined;
    
    return Hunter;
}();