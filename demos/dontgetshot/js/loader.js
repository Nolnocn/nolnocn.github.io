"use strict";

var game = game || {};

// CONSTANTS
game.IMAGES = {
    playerImg: "images/player.png",
    bulletImg: "images/bullet.png",
    homingBulletImg: "images/homingbullet.png",
    fighterImg: "images/fighter.png",
    boomerImg: "images/boomer.png",
    stalkerImg: "images/stalker.png",
    hunterImg: "images/hunter.png",
    lancerImg: "images/lancer.png",
    phalanxImg: "images/phalanx.png"
};

// Mouse
game.mouse = {
    x: 0,
    y: 0,
    down: false
};

game.loadImages = function() {
    var imageCount = 0, loadedImages = 0;
    for(var key in game.IMAGES) {
        imageCount++;
        var image = new Image();
        image.onload = function() {
            loadedImages++;
            if(loadedImages == imageCount) {
                game.init();
            }
        };
        image.src = game.IMAGES[key];
        game.IMAGES[key] = image;
    }
}

 game.init = function() {
    var player = game.player;
    player.img = game.IMAGES["playerImg"];
    player.drawLib = game.drawLib;
    player.utils = game.utils;
    player.mouse = game.mouse;
    
    game.Debris.prototype.drawLib = game.drawLib;
    
    var enMethods = game.enemyMethods;
    
    var bullet = game.Bullet.prototype;
    bullet.drawLib = game.drawLib;
    bullet.img = game.IMAGES["bulletImg"];
    bullet.draw = enMethods.draw;
    bullet.move = enMethods.move;
    
    var hBullet = game.HomingBullet.prototype;
    hBullet.drawLib = game.drawLib;
    hBullet.img = game.IMAGES["homingBulletImg"];
    hBullet.draw = enMethods.draw;
    hBullet.move = enMethods.move;
    hBullet.player = game.player;
    hBullet.utils = game.utils;
    
    var fighter = game.Fighter.prototype;
    fighter.drawLib = game.drawLib;
    fighter.utils = game.utils;
    fighter.player = game.player;
    fighter.img = game.IMAGES["fighterImg"];
    fighter.update = enMethods.update;
    fighter.rotateToPlayer = enMethods.rotateToPlayer;
    fighter.draw = enMethods.draw;
    fighter.move = enMethods.move;
    fighter.fire = enMethods.fire;
    fighter.die = enMethods.die;
    fighter.leave = enMethods.leave;
    
    var stalker = game.Stalker.prototype;
    stalker.drawLib = game.drawLib;
    stalker.utils = game.utils;
    stalker.player = game.player;
    stalker.img = game.IMAGES["stalkerImg"];
    stalker.draw = enMethods.draw;
    stalker.update = enMethods.update;
    stalker.rotateToPlayer = enMethods.rotateToPlayer;
    stalker.move = enMethods.move;
    stalker.fire = enMethods.fire;
    stalker.die = enMethods.die;
    stalker.leave = enMethods.leave;
    
    var boomer = game.Boomer.prototype;
    boomer.drawLib = game.drawLib;
    boomer.utils = game.utils;
    boomer.player = game.player;
    boomer.img = game.IMAGES["boomerImg"];
    boomer.draw = enMethods.draw;
    boomer.die = enMethods.die;
    boomer.leave = enMethods.leave;
    
    var lancer = game.Lancer.prototype;
    lancer.drawLib = game.drawLib;
    lancer.utils = game.utils;
    lancer.player = game.player;
    lancer.img = game.IMAGES["lancerImg"];
    lancer.draw = enMethods.draw;
    lancer.rotateToPlayer = enMethods.rotateToPlayer;
    lancer.move = enMethods.move;
    lancer.die = enMethods.die;
    
    var phalanx = game.Phalanx.prototype;
    phalanx.drawLib = game.drawLib;
    phalanx.utils = game.utils;
    phalanx.player = game.player;
    phalanx.img = game.IMAGES["phalanxImg"];
    phalanx.draw = enMethods.draw;
    phalanx.rotateToPlayer = enMethods.rotateToPlayer;
    phalanx.move = enMethods.move;
    phalanx.die = enMethods.die;
    
    var hunter = game.Hunter.prototype;
    hunter.drawLib = game.drawLib;
    hunter.utils = game.utils;
    hunter.player = game.player;
    hunter.img = game.IMAGES["hunterImg"];
    hunter.draw = enMethods.draw;
    hunter.update = enMethods.update;
    hunter.rotateToPlayer = enMethods.rotateToPlayer;
    hunter.move = enMethods.move;
    hunter.fire = enMethods.fire;
    hunter.die = enMethods.die;
    hunter.leave = enMethods.leave;
    
    game.main.drawLib = game.drawLib;
    game.main.utils = game.utils;
    game.main.mouse = game.mouse;
    game.main.init(game.player);
}

window.onload = function() {
    // "Sandbox"
    game.loadImages();
    
    window.onresize = function(e) {
        game.main.canvas.width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

        game.main.canvas.height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
        
        if(!game.main.start) {
            game.main.reset();
        }
    };

    canvas.addEventListener('mousedown', function(e) {
        game.mouse.down = true;
        game.main.doMouseClick();
    });
    
    canvas.addEventListener('mouseup', function(e) {
        game.mouse.down = false;
    });

    canvas.addEventListener('mousemove', function(e) {
        game.mouse.x = e.pageX - canvas.offsetLeft, canvas.width;
        game.mouse.y = e.pageY - canvas.offsetTop, canvas.height;
    });
    
    canvas.addEventListener('mouseout', function(e) {
        if(!game.main.paused) {
            game.main.togglePause();
        }
    });

    canvas.addEventListener('touchstart', function(e){
        e.preventDefault();
        var touch = e.touches[0];
        game.mouse.x = Math.max(0, Math.min(touch.pageX - canvas.offsetLeft, canvas.width));
        game.mouse.y = Math.max(0, Math.min(touch.pageY - canvas.offsetTop, canvas.height));
        game.main.doTouchStart();
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var touch = e.touches[0];
        game.mouse.x = Math.max(0, Math.min(touch.pageX - canvas.offsetLeft, canvas.width));
        game.mouse.y = Math.max(0, Math.min(touch.pageY - canvas.offsetTop, canvas.height));
    });
    
    canvas.addEventListener('touchend', function(e){
        e.preventDefault();
        game.main.doTouchEnd();
    });
    
    canvas.addEventListener('touchcancel', function(e){
        e.preventDefault();
        game.main.doTouchEnd();
    });
}

var requestAnimationFrame =
    window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { //Fallback function
        window.setTimeout(callback, 1000/60);
    };