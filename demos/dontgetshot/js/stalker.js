"use strict";

var game = game || {};

game.Stalker = function() {
    function Stalker(x, y) {
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.speed = 25 + 10 * Math.random() - 5;
        this.fireTime = 0;
        this.fireDelay = 5;
        this.debrisCount = 20;
        this.color = 'rgba(255, 255, 255, 0.1)';
        this.active = true;
        this.onscreen = false;
        this.fireHoming = false;
        this.scoreVal = 100;
    }
    
    var p = Stalker.prototype;
    p.draw = undefined;
    p.update = undefined;
    p.rotateToPlayer = undefined;
    p.move = undefined;
    p.fire = undefined;
    p.die = undefined;
    p.leave = undefined;
    
    return Stalker;
}();