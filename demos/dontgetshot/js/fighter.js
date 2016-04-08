"use strict";

var game = game || {};

game.Fighter = function() {
    function Fighter(x, y) {
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.speed = 75 + 10 * Math.random() - 5;
        this.fireTime = 0;
        this.fireDelay = 1;
        this.debrisCount = 20;
        this.color = '#F00';
        this.active = true;
        this.onscreen = false;
        this.fireHoming = false;
        this.scoreVal = 10;
    }
    
    var p = Fighter.prototype;
    
    p.draw = undefined;
    p.update = undefined;
    p.rotateToPlayer = undefined;
    p.move = undefined;
    p.fire = undefined;
    p.die = undefined;
    p.leave = undefined;
    
    return Fighter;
}();