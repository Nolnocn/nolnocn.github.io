"use strict";

var game = game || {};

game.HomingBullet = function() {
    function HomingBullet(x, y, rot) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.speed = 200;
        this.collide = false;
        this.colDelay = 0.1;
        this.turnSpeed = 1.0;
        this.active = true;
    }
    
    var p = HomingBullet.prototype;
    
    p.draw = undefined;
    
    p.update = function(dt) {
        if(this.player.alive) {
            this.turnTowardsPlayer(dt);
        }
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
    
    p.turnTowardsPlayer = function(dt) {
        var desiredAngle = this.utils.calcAngle(this.x, this.y, this.player.x, this.player.y);
        this.rot = this.constrainAngle(this.rot + this.turnSpeed * dt * this.constrainAngle(desiredAngle - this.rot));
    };
    
    p.constrainAngle = function(angle) {
	   angle = (angle + Math.PI)  % (Math.PI * 2);
	   if (angle < 0) {
           angle += Math.PI * 2;
       }
        return angle - Math.PI;
    };
    
    p.deactivate = function(offscreen) {
        this.active = false;
    };
    
    return HomingBullet;
}();