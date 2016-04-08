"use strict";

var game = game || {};

game.Debris = function() {
    function Debris(x, y, dir, color) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.rot = dir;
        this.size = 3;
        this.speed = 50 + 50 * Math.random() - 25;
        this.rotSpeed = ((Math.random() * Math.PI * 2) - Math.PI) * .5;
        this.color = color;
        this.active = true;
        this.lifeTime = 0.5 + Math.random() * 0.5;
    }
    
    var p = Debris.prototype;
    
    p.draw = function(ctx) {
        this.drawLib.drawRect(ctx, this.x, this.y, this.size, this.size, this.rot, this.color);
    };
    
    p.update = function(dt) {
        this.move(dt);
        this.rot += this.rotSpeed * dt;
        
        if(this.lifeTime > 0) {
            this.lifeTime -= dt;
        }
        else {
            this.active = false;
        }
    };
    
    p.move = function(dt) {
        this.x += Math.cos(this.dir) * this.speed * dt;
        this.y += Math.sin(this.dir) * this.speed * dt;
    };
    
    return Debris;
}();