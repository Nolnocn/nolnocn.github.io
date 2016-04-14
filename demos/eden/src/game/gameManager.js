"use strict";

var app = app || {};

// Manager for holding references to the Phaser game stuff
// I had higher expectations for it...
app.gameManager = {
    group: undefined,
    
    // Sets the camera to follow the given sprite
    lockCameraOnCharacter: function( characterSprite ) {
        app.game.camera.follow( characterSprite, Phaser.Camera.FOLLOW_LOCKON ); 
    }
};