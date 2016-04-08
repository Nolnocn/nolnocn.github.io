"use strict";

var game = game || {};

game.player = {
    x: 0,
    y: 0,
    rot: 0,
    speed: 150,
    alive: true,
    img: undefined,
    drawLib: undefined,
    utils: undefined,
    mouse: undefined,
    
    init: function(x, y) {
        this.x = x;
        this.y = y;
        this.rot = -Math.PI * 0.5;
        this.alive = true;
    },
    
    draw: function(ctx) {
        if(this.alive) {
            this.drawLib.drawImg(ctx, this.img, this.x, this.y, this.rot);
        }
    },
    
    update: function(dt) {
        if(this.alive) {
            this.rotateToMouse();
            var dist = this.utils.calcDistance(this.x, this.y, this.mouse.x, this.mouse.y);
            if(dist > this.img.width) {
                this.move(dt);
            }
        }
    },
    
    rotateToMouse: function() {
        this.rot = this.utils.calcAngle(this.x, this.y, this.mouse.x, this.mouse.y);
    },
    
    move: function(dt) {
        this.x += Math.cos(this.rot) * this.speed * dt;
        this.y += Math.sin(this.rot) * this.speed * dt;
    },
    
    die: function() {
        this.alive = false;
        var debrisCount = 20;
        for(var i = 0; i < debrisCount; i++) {
            game.main.debris.push(new game.Debris(
                this.x,
                this.y,
                this.rot + Math.PI * 2 / debrisCount * i,
                '#0F0'));
	   }
        
        game.main.enemies.forEach(function(enemy) {
            enemy.leave();
        });
    }
};