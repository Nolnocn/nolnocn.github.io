"use strict";

var game = game || {};

game.main = {
    canvas: undefined,
    ctx: undefined,
    player: undefined,
    drawLib: undefined,
    utils: undefined,
    mouse: undefined,
    enemies: [],
    bullets: [],
    debris: [],
    prevTime: undefined,
    paused: false,
    start: false,
    score: 0,
    highScore: 0,
    maxEnemies: 3,
    spawnTime: 1,
    spawnDelay: 1,
    phalanxSpawn: 0,
    phalanxCount: 0,
    
    init: function(player) {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        if(typeof(window.localStorage) != 'undefined'){
            var val = window.localStorage.getItem ("highScore");
            if(val) {
                this.highScore = parseInt(val);
            }
            else {
                this.highScore = 0;
            }
        }
        else {
            this.highScore = 0;
        }
        
        this.canvas.width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

        this.canvas.height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
        
        this.player = player;
        this.player.init(this.canvas.width * 0.5, this.canvas.height * 0.5);
        
        this.prevTime = Date.now();
        this.update();
    },
    
    update: function() {
        // Loop
        requestAnimationFrame(this.update.bind(this));
        
        // Calculate dt
        var dt = (Date.now() - this.prevTime) * 0.001;
        this.prevTime = Date.now();
        
        // Update
        if(!this.paused && this.start) {
            if(this.player.alive) {
                this.player.update(dt);
                this.spawnEnemies(dt);
            }
            
            this.enemies.forEach(function(enemy) {
                enemy.update(dt);
                enemy.onscreen = this.checkOnscreen(enemy);
            }, this);
            
            this.bullets.forEach(function(bullet) {
                bullet.update(dt);
                if(bullet.collide) {
                    if(!this.checkOnscreen(bullet)) {
                        bullet.deactivate(true);
                    }
                    else if(this.player.alive && this.detectCollision(this.player, bullet)) {
                        this.gameOver();
                        bullet.deactivate();
                    }
                    else {
                        this.enemies.forEach(function(enemy) {
                            if(this.detectCollision(enemy, bullet)) {
                                this.addToScore(enemy.scoreVal);
                                if(enemy.leader != undefined) {
                                    this.phalanxCount--;
                                }
                                enemy.die();
                                bullet.deactivate(false);
                            }
                        }, this);
                    }
                }
            }, this);
            
            this.debris.forEach(function(debbie) {
                debbie.update(dt);
            }, this);
            
            // Filter
            this.bullets = this.bullets.filter(function(bullet) {
                return bullet.active;
            });
            
            this.enemies = this.enemies.filter(function(enemy) {
                return enemy.active;
            });
            
            this.debris = this.debris.filter(function(debris) {
                return debris.active;
            });
        }
        
        // Draw
        this.draw();
	},
    
    draw: function() {
        // Clear Screen
        this.drawLib.clear(this.ctx, 0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Debris
        this.debris.forEach(function(debbie) {
            debbie.draw(this.ctx);
        }, this);
        
        // Draw Bullets
        this.bullets.forEach(function(bullet) {
            bullet.draw(this.ctx);
        }, this);
        
        // Draw Enemies
        this.enemies.forEach(function(enemy) {
            enemy.draw(this.ctx);
        }, this);
        
        // Draw player
        this.player.draw(this.ctx);
        
        this.ctx.save();
        this.ctx.textAlign = "center";
        var size = this.canvas.height / 20;
        if(!this.start) {
            this.drawLib.text(this.ctx, "Don't Get Shot", this.canvas.width*0.5, this.canvas.height*0.5-size, size+5, 'white');
            this.drawLib.text(this.ctx, "<Press to Begin>", this.canvas.width*0.5, this.canvas.height*0.5+2*size, size, 'white');
        }
        if(!this.player.alive) {
            this.drawLib.text(this.ctx, "You Got Shot", this.canvas.width*0.5, this.canvas.height*0.5-(size+10), size + 5, 'white');
            this.drawLib.text(this.ctx, "High Score: " + this.highScore, this.canvas.width*0.5, this.canvas.height*0.5, size, 'white');
            this.drawLib.text(this.ctx, "Your Score: " + this.score, this.canvas.width*0.5, this.canvas.height*0.5+size+5, size, 'white');
            this.drawLib.text(this.ctx, "<Press to Retry>", this.canvas.width*0.5, this.canvas.height*0.5+size*2+5, size-size*.2, 'white');
        }
        else {
            if(this.paused) {
                this.drawLib.text(this.ctx, "<PAUSED>", this.canvas.width*0.5, this.canvas.height*0.5, size, 'white');
            }
            this.ctx.textAlign = "left";
            this.drawLib.text(this.ctx, "Score: " + this.score, 15, 30, 15, 'white');
        }
        this.ctx.restore();
    },
    
    detectCollision: function(object, bullet) {
        var dist = this.utils.calcDistance(object.x, object.y, bullet.x, bullet.y);
        if(dist < object.img.width * 0.5 + bullet.img.height * 0.5) {
            return true;
        }
        else {
            return false;
        }
    },
    
    checkOnscreen: function(object) {
        if(object.x > 0 
                && object.x < canvas.width 
                && object.y > 0 
                && object.y < canvas.height) {
            return true;
        }
        else {
            return false;
        }
    },
    
    togglePause: function() {
        if(this.start && this.player.alive) {
            this.paused = !this.paused;
        }
    },
    
    spawnPhalanx: function(x, y, num) {
        this.enemies.push(new game.Phalanx(x, y, null));
        for(var i = 1; i < num; i++) {
            var index = this.enemies.length - 1;
            this.enemies.push(new game.Phalanx(x - game.IMAGES.phalanxImg.width * 0.5 * i, y, this.enemies[index]));
        }
        this.phalanxCount += num;
    },
    
    doMouseClick: function() {
        if(!this.start) {
            this.start = true;
        }
        else {
            if(this.player.alive) {
                this.togglePause();
            }
            else {
                this.reset();
            }
        }
    },
    
    doTouchStart: function() {
        if(!this.start) {
            this.start = true;
        }
        else {
            if(this.player.alive) {
                this.paused = false;
            }
            else {
                this.reset();
            }
        }
    },
    
    doTouchEnd: function() {
        if(!this.paused && this.player.alive && this.start) {
            this.paused = true;
        }
    },
    
    spawnEnemies: function(dt) {
        if(this.enemies.length - this.phalanxCount < this.maxEnemies) {
            if(this.spawnTime <= 0) {
                var x, y;
                var rand = Math.random() * 4;
                if(rand < 1) {
                    x = -20;
                    y = Math.random() * this.canvas.height;
                }
                else if(rand < 2) {
                    x = Math.random() * this.canvas.width;
                    y = -20;
                }
                else if(rand < 3) {
                    x = this.canvas.width + 20;
                    y = Math.random() * this.canvas.height;
                }
                else {
                    x = Math.random() * this.canvas.width;
                    y = this.canvas.height + 20;
                }
                
                rand = Math.random() * 100;
                if(rand < 5) {
                    this.bullets.push(new game.Lancer(x, y, this.canvas.width, this.canvas.height));
                }
                else if(rand < 15) {
                    this.enemies.push(new game.Stalker(x, y));
                }
                else if(rand < 30) {
                    this.enemies.push(new game.Boomer(x, y, this.canvas.width, this.canvas.height));
                }
                else if(rand < 50) {
                    this.enemies.push(new game.Hunter(x, y));
                }
                else {
                    this.enemies.push(new game.Fighter(x, y));
                }

                this.spawnTime = this.spawnDelay;
            }
            else {
                this.spawnTime -= dt;
            }
        }
    },
    
    addToScore: function(amt) {
        if(this.player.alive) {
            this.score += amt;
        }
        
        var val = Math.floor(this.score / 100) + 3;
        if(val > this.maxEnemies) {
            this.maxEnemies = val;
        }
        
        val = Math.floor(this.score / (1000 * (this.phalanxSpawn+1)));
        if(val > this.phalanxSpawn) {
            this.phalanxSpawn = val;
            this.spawnPhalanx(-50, this.canvas.height * 0.5, this.phalanxSpawn * 100);
        }
    },
    
    gameOver: function() {
        this.player.die();
        if(this.score > this.highScore) {
            this.highScore = this.score;
            if(typeof(window.localStorage) != 'undefined') { 
                window.localStorage.setItem("highScore", this.highScore);
            }
        }
    },
    
    reset: function() {
        this.start = false;
        this.player.init(this.canvas.width * 0.5, this.canvas.height * 0.5);
        this.score = 0;
        this.phalanxSpawn = 0;
        this.phalanxCount = 0;
        this.maxEnemies = 3;
        this.spawnTime = this.spawnDelay;
        this.enemies = [];
        this.bullets = [];
        this.debris = [];
    }
}