"use strict";

var game = game || {};

game.Lancer = function() {
    
    function Lancer(x, y, canvasW, canvasH) {
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.baseSpeed = 100 + 10 * Math.random() - 5;
        this.chargeSpeed = this.baseSpeed * 5;
        this.speed = this.baseSpeed;
        this.range = Math.min(canvasW, canvasH) * 0.25;
        this.charging = false;
        this.collide = false;
        this.chargeTime = 0;
        this.chargeWait = 0.5;
        this.chargeLength = 2 * this.range / this.chargeSpeed;
        this.debrisCount = 20;
        this.color = '#F0F';
        this.active = true;
    }
    
    var p = Lancer.prototype;
    
    p.draw = undefined;
    
    p.update = function(dt) {
        if(this.player.alive) {
            if(!this.charging) {
                this.rotateToPlayer();
                this.move(dt);
                if(this.utils.calcDistance(this.x, this.y, this.player.x, this.player.y) < this.range) {
                    this.charging = true;
                }
            }
            else if(this.chargeTime < this.chargeWait) {
                this.rotateToPlayer();
                this.chargeTime += dt;
            }
            else if(this.chargeTime < this.chargeWait + this.chargeLength) {
                this.collide = true;
                this.speed = this.chargeSpeed;
                this.move(dt);
                this.chargeTime += dt;
            }
            else if(this.chargeTime < this.chargeWait * 2 + this.chargeLength){
                this.collide = false;
                this.chargeTime += dt;
            }
            else {
                this.speed = this.baseSpeed;
                this.charging = false;
                this.chargeTime = 0;
            }
        }
        else {
            this.collide = false;
            this.speed = this.baseSpeed;
            this.move(dt);
        }
    };
    
    p.rotateToPlayer = undefined;
    p.move = undefined;
    p.die = undefined;
    
    p.deactivate = function(offscreen) {
        if(offscreen) {
            this.die();
        }
    };
    
    return Lancer;
}();