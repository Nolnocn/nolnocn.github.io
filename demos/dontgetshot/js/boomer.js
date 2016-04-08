"use strict";

var game = game || {};

game.Boomer = function() {
    function Boomer(x, y, canvasW, canvasH) {
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.tarX = Math.random() * canvasW;
        this.tarY = Math.random() * canvasH;
        this.dir = this.utils.calcAngle(this.x, this.y, this.tarX, this.tarY);
        this.speed = 25 + 10 * Math.random() - 5;
        this.fireTime = 0;
        this.fireDelay = 2.5;
        this.debrisCount = 40;
        this.color = '#FF0';
        this.active = true;
        this.onscreen = false;
        this.fireHoming = false;
        if(Math.random() * 20 <= 1) {
            this.fireHoming = true;
        }
        this.scoreVal = 50;
    }
    
    var p = Boomer.prototype;
    
    p.draw = undefined;
    
    p.update = function(dt) {
        if(this.utils.calcDistance(this.x, this.y, this.tarX, this.tarY) > this.img.width) {
            this.move(dt);
        }
        else {
           if(this.fireTime > this.fireDelay) {
                this.fire();
                this.fireTime = 0;
            }
            else {
                this.fireTime += dt;
            } 
        }
    };
    
    p.move = function(dt) {
        this.x += Math.cos(this.dir) * this.speed * dt;
        this.y += Math.sin(this.dir) * this.speed * dt;
    };
    
    p.fire = function() {
        this.scoreVal = 0;
        for(var i = 0; i < 8; i++) {
            if(!this.fireHoming) {
                game.main.bullets.push(new game.Bullet(this.x, this.y, Math.PI * 0.25 * i));
            }
            else {
                game.main.bullets.push(new game.HomingBullet(this.x, this.y, Math.PI * 0.25 * i));
            }
        }
        this.die();
    };
    
    p.die = undefined;
    p.leave = undefined;
    
    return Boomer;
}();