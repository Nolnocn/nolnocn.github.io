"use strict";

var game = game || {};

game.Phalanx = function() {
    
    function Phalanx(x, y, leader) {
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.speed = 75;
        this.isLeader = false;
        if(leader === null) {
            this.isLeader = true;
        }
        this.leader = leader;
        this.debrisCount = 10;
        this.color = '#0FF';
        this.active = true;
        this.onscreen = false;
        this.scoreVal = 5;
        this.turnSpeed = 1.5;
    }
    
    var p = Phalanx.prototype;
    
    p.draw = undefined;
    
    p.update = function(dt) {
        this.move(dt);
        if(this.isLeader) {
            if(this.player.alive) {
                //this.rotateToPlayer();
                this.turnTowardsPlayer(dt);
            }
        }
        else {
            this.rotateToLeader();
            if(!this.leader.active) {
                this.isLeader = true;
                this.leader = null;
            }
        }
        
        if(this.collidingWithPlayer()) {
            if(this.player.alive) {
                this.player.die();
            }
        }
    };
    
    p.rotateToPlayer = undefined;
    
    p.rotateToLeader = function() {
        this.rot = this.utils.calcAngle(this.x, this.y, this.leader.x, this.leader.y);
    };
    
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
    
    p.collidingWithPlayer = function() {
        var dist = this.utils.calcDistance(this.x, this.y, this.player.x, this.player.y);
        if(dist < this.player.img.width * 0.5 + this.img.width * 0.5) {
            return true;
        }
        else {
            return false;
        }
    },
    
    p.move = undefined;
    p.die = undefined;
    
    p.leave = function() {
        if(this.isLeader) {
            this.rot += (180 + (Math.random() * 60 - 30)) * Math.PI / 180;
        }
    };
    
    return Phalanx;
}();