"use strict";

var app = app || {};

app.Character = function() {
    var STATES = {
        IDLE: "idle",
        MOVING: "move",
        COLLECT: "foodCollect",
    };
    
    var OBJECTIVES = {
        NONE: 0,
        MAKE_BABIES: 1
    };
    
    // Function constructor
    function Character( charData )
    {
        this.isPlayerCharacter = false; // If the char is THIS player's character
        
        this.characterData = charData;
        
        this.sprite = app.gameManager.group.create( charData.position.x, charData.position.y, 'characters' );
        this.sprite.anchor.setTo( 0.5, 1.0 );
        this.state = STATES.IDLE;
        this.objective = OBJECTIVES.NONE;
        
        this.inLoveTree = false;
        
        if( this.characterData.destination != this.characterData.position )
        {
            this.state = STATES.MOVING;
        }
        
        this.facing = 1;
        
        // AnimName + Age
        
        var animFrameRate = 3;
        if( charData.gender === 0 )
        {
            // Male Anims
            // Idle
            this.sprite.animations.add( "idle0", [ 2, 3 ], animFrameRate, true );
            this.sprite.animations.add( "idle1", [ 6, 7 ], animFrameRate, true );
            this.sprite.animations.add( "idle2", [ 10, 11 ], animFrameRate, true );
            
            // Move
            this.sprite.animations.add( "move0", [ 14, 15 ], animFrameRate, true );
            this.sprite.animations.add( "move1", [ 18, 19 ], animFrameRate, true );
            this.sprite.animations.add( "move2", [ 22, 23 ], animFrameRate, true );
            
            // Food Collect
            this.sprite.animations.add( "foodCollect0", [ 27, 28, 29 ], animFrameRate, true );
            this.sprite.animations.add( "foodCollect1", [ 32, 33 ], animFrameRate, true );
            this.sprite.animations.add( "foodCollect2", [ 36, 37 ], animFrameRate, true );
        }
        else
        {
            // Female Anims
            // Idle
            this.sprite.animations.add( "idle0", [ 0, 1 ], animFrameRate, true );
            this.sprite.animations.add( "idle1", [ 4, 5 ], animFrameRate, true );
            this.sprite.animations.add( "idle2", [ 8, 9 ], animFrameRate, true );
            
            // Move
            this.sprite.animations.add( "move0", [ 12, 13 ], animFrameRate, true );
            this.sprite.animations.add( "move1", [ 16, 17 ], animFrameRate, true );
            this.sprite.animations.add( "move2", [ 20, 21 ], animFrameRate, true );
            
            // Food Collect
            this.sprite.animations.add( "foodCollect0", [ 24, 25, 26 ], animFrameRate, true );
            this.sprite.animations.add( "foodCollect1", [ 30, 31 ], animFrameRate, true );
            this.sprite.animations.add( "foodCollect2", [ 38, 39 ], animFrameRate, true );
        }
        
        this.updateSprite();
    };
    
    // Updates the sprite to the proper anim
    Character.prototype.updateSprite = function() {
        this.sprite.animations.play( this.state + this.characterData.age );
        this.setSpriteScale();
    };
    
    // Per fram update func
    Character.prototype.update = function( dt ) {
        if( this.state === STATES.MOVING )
        {
            this.moveToDestination( dt );
        }
    };
    
    // Sets the sprite to flip based on the direction it's facing
    Character.prototype.setSpriteScale = function() {
         this.sprite.scale.setTo( 0.5 * this.facing, 0.5 );
    }
    
    // Lerps from pos to destination
    Character.prototype.moveToDestination = function( dt ) {
        var maxDelta = this.characterData.moveSpeed * dt;
        var a = {
            x: this.characterData.destination.x - this.characterData.position.x,
            y: this.characterData.destination.y - this.characterData.position.y
        };
        
        var magnitude = Math.sqrt( a.x * a.x + a.y * a.y );
        
        if ( magnitude <= maxDelta || magnitude === 0 )
        {
            this.characterData.position = this.characterData.destination;
            this.state = STATES.IDLE;
            this.updateSprite();
            this.syncSpritePos();
            
            if( this.isPlayerCharacter )
            {
                app.socketManager.sendMessage( "reachedDestination", { position: this.characterData.position } );
            }
            
            switch( this.objective )
            {
                case OBJECTIVES.NONE:
                    break;
                case OBJECTIVES.MAKE_BABIES:
                    app.socketManager.sendMessage( "lookingForLove", { gender: this.characterData.gender, entered: true } );
                    this.inLoveTree = true;
                    this.objective = OBJECTIVES.NONE;
                    break;
            }
            return;
        }

        this.characterData.position = {
            x: this.characterData.position.x + a.x / magnitude * maxDelta,
            y: this.characterData.position.y + a.y / magnitude * maxDelta
        };
        
        this.syncSpritePos();
    };

    // Updates the position of the sprite
    // Rounded to prevent jitter
    Character.prototype.syncSpritePos = function() {
        this.sprite.x = Math.round( this.characterData.position.x );
        this.sprite.y = Math.round( this.characterData.position.y );
    };
    
    // Sets the destination
    Character.prototype.setDestination = function( dest ) {
        if( this.inLoveTree )
        {
            this.inLoveTree = false;
            app.socketManager.sendMessage( "lookingForLove", { gender: this.characterData.gender, entered: false } );
        }
        
        this.characterData.destination = dest;
        
        this.facing = dest.x < this.characterData.position.x ? 1 : -1;
        
        this.state = STATES.MOVING;
        this.updateSprite();
        
        this.objective = OBJECTIVES.NONE;
        
        var data = {
            destination: this.characterData.destination,
            position: this.characterData.position
        };
        
        if( this.isPlayerCharacter )
        {
            app.socketManager.sendMessage( "setDestination", data );
        }
    };
    
    // For the sake of decency, I will not explain what happens here
    Character.prototype.goToLoveTree = function( ltPos, pointerPos ) {
        if( this.characterData.age != 1 )
        {
            this.setDestination( pointerPos );
            return;
        }

        var pos = { x: ltPos.x, y: ltPos.y };

        if( this.characterData.gender === 0 )
        {
            pos.x -= 20;
        }
        else
        {
            pos.x += 20;
        }

        this.setDestination( pos );
        this.objective = OBJECTIVES.MAKE_BABIES;
    };
    
    // Fades out the sprite and deletes it
    Character.prototype.die = function() {
        this.state = STATES.IDLE;
        this.updateSprite();
        var fadeOut = app.game.add.tween( this.sprite ).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None );
        fadeOut.onComplete.add( function() {
            app.gameManager.group.remove( this.sprite );
            delete app.characterManager.characters[ this.characterData.id ];
        }, this );
        fadeOut.start();
    };
    
    // Sets postion and stops the character's movement
    Character.prototype.setPosition = function( pos ) {
        this.characterData.position = pos;
        this.characterData.destination = pos;
        this.state = STATES.IDLE;
        this.updateSprite();
        this.syncSpritePos();
    };
    
    return Character;
}();