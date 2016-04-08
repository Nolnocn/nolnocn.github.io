"use strict";

var game = game || {};

game.Bullet = function() {
    function Bullet(x, y, rot) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.speed = 200;
        this.collide = false;
        this.colDelay = 0.1;
        this.active = true;
    }
    
    var p = Bullet.prototype;
    
    p.draw = undefined;
    
    p.update = function(dt) {
        this.move(dt);
        if(!this.collide) {
            if(this.colDelay > 0) {
                this.colDelay -= dt;
            }
            else {
                this.collide = true;
            }
        }
    };
    
    p.move = undefined;
    
    p.deactivate = function(offscreen) {
        this.active = false;
    };
    
    return Bullet;
}();