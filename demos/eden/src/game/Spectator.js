"use strict";

var app = app || {};

app.Spectator = function() {
    var STATES = {
        IDLE: "idle",
        MOVING: "move",
    };
    
    // Function constructor
    function Spectator( pos )
    {
        this.sprite = app.gameManager.group.create( pos.x, pos.y, 'characters' );
        this.sprite.anchor.setTo( 0.5, 1.0 );
        this.state = STATES.IDLE;
        
        this.facing = 1;

        this.position = pos;
        this.destination = pos;
        this.moveSpeed = 10;
        
        var animFrameRate = 3;
        // Idle
        this.sprite.animations.add( "idle", [ 40, 41 ], animFrameRate, true );
        
        // Move
        this.sprite.animations.add( "move", [ 42, 43 ], animFrameRate, true );
        
        this.updateSprite();
    };
    
    // Updates the sprite to the proper anim
    Spectator.prototype.updateSprite = function() {
        this.sprite.animations.play( this.state );
        this.setSpriteScale();
    };
    
    // Per fram update func
    Spectator.prototype.update = function( dt ) {
        if( this.state === STATES.MOVING )
        {
            this.moveToDestination( dt );
        }
    };
    
    // Sets the sprite to flip based on the direction it's facing
    Spectator.prototype.setSpriteScale = function() {
         this.sprite.scale.setTo( 0.5 * this.facing, 0.5 );
    }
    
    // Lerps from pos to destination
    Spectator.prototype.moveToDestination = function( dt ) {
        var maxDelta = this.moveSpeed * dt;
        var a = {
            x: this.destination.x - this.position.x,
            y: this.destination.y - this.position.y
        };
        
        var magnitude = Math.sqrt( a.x * a.x + a.y * a.y );
        
        if ( magnitude <= maxDelta || magnitude === 0 )
        {
            this.position = this.destination;
            this.state = STATES.IDLE;
            this.updateSprite();
            this.syncSpritePos();
            return;
        }

        this.position = {
            x: this.position.x + a.x / magnitude * maxDelta,
            y: this.position.y + a.y / magnitude * maxDelta
        };
        
        this.syncSpritePos();
    };

    // Updates the position of the sprite
    // Rounded to prevent jitter
    Spectator.prototype.syncSpritePos = function() {
        this.sprite.x = Math.round( this.position.x );
        this.sprite.y = Math.round( this.position.y );
    };
    
    // Sets the destination
    Spectator.prototype.setDestination = function( dest ) {
        this.destination = dest;
        
        this.facing = dest.x < this.position.x ? 1 : -1;
        
        this.state = STATES.MOVING;
        this.updateSprite();
    };
    
    return Spectator;
}();