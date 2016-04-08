"use strict";
var game = game || {};

game.enemyMethods = function() {
    
    function draw(ctx) {
        this.drawLib.drawImg(ctx, this.img, this.x, this.y, this.rot);
    }
    
    function update(dt) {
        this.move(dt);
        if(this.player.alive) {
            this.rotateToPlayer();
            
            if(this.fireTime > this.fireDelay) {
                this.fire();
                this.fireTime = 0;
            }
            else {
                this.fireTime += dt;
            }
        }
    }
    
    function rotateToPlayer() {
        this.rot = this.utils.calcAngle(this.x, this.y, this.player.x, this.player.y);
    }
    
    function move(dt) {
        this.x += Math.cos(this.rot) * this.speed * dt;
        this.y += Math.sin(this.rot) * this.speed * dt;
    }
    
    function fire() {
        if(this.onscreen) {
            if(this.fireHoming) {
                game.main.bullets.push(new game.HomingBullet(this.x, this.y, this.rot));
            }
            else {
                game.main.bullets.push(new game.Bullet(this.x, this.y, this.rot));
            }
        }
    }
    
    function die() {
        this.active = false;
        for(var i = 0; i < this.debrisCount; i++)
        {
            game.main.debris.push(new game.Debris(
                    this.x, 
                    this.y, 
                    this.rot + Math.PI * 2 / this.debrisCount * i,
                    this.color));
        }
    }
    
    function leave() {
        this.speed *= 0.75;
        this.rot += 180 + (Math.random() * 60 - 30) * Math.PI / 180;
    }
    
    return {
        draw: draw,
        update: update,
        rotateToPlayer: rotateToPlayer,
        move: move,
        fire: fire,
        die: die,
        leave: leave
	};
}();