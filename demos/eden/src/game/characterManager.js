"use strict";

var app = app || {};

app.characterManager = {
    characters: {},
    spectatorMode: false,
    spectatorAvatar: undefined,
    playerCharacterId: undefined,
    
    // Adds a collection of characters to the game
    addCharacters: function( characterData ) {
        for( var i = 0; i < characterData.length; i++ )
        {
            this.addCharacter( characterData[ i ] );
        }
    },
    
    // Adds a single character to the game
    addCharacter: function( characterData ) {
        var Character = app.Character;
        this.characters[ characterData.id ] = new Character( characterData );
    },
    
    // Removes a character from the game
    removeCharacter: function( data ) {
        var id = data.id;
        if( id != undefined && this.characters[ data.id ] )
        {
            if( id === this.playerCharacterId )
            {
                this.playerCharacterId = undefined;
                app.socketManager.sendMessage( "playerCharacterDeath", {} );
            }
            
            this.characters[ data.id ].die();
        }
    },
    
    // Handles increasing the age of a character
    handleAgeUp: function( data ) {
        var char = this.characters[ data.id ];
        
        var charData = char.characterData;
        charData.age = data.age;
        charData.moveSpeed = data.moveSpeed;
        charData.hungerRate = data.hungerRate;
        charData.freezeRate = data.freezeRate;
        
        char.updateSprite();
    },
    
    // Handles setting the client's character
    assignCharacter: function( spectatorMode, id ) {
        if( !spectatorMode && this.characters[ id ] )
        {
            if( this.spectatorMode )
            {
                this.spectatorMode = false;
                app.gameManager.group.remove( this.spectatorAvatar.sprite );
                this.spectatorAvatar = undefined;
            }
            this.playerCharacterId = id;
            app.gameManager.lockCameraOnCharacter( this.characters[ id ].sprite );
            this.characters[ id ].isPlayerCharacter = true;
        }
        else if( !this.spectatorMode )
        {
            this.spectatorMode = true;
            var world = app.game.world;
            this.spectatorAvatar = new app.Spectator( { x: world.centerX, y: world.centerY } );
            app.gameManager.lockCameraOnCharacter( this.spectatorAvatar.sprite );
        }
    },
    
    // Updates all characters per frame
    updateCharacters: function( dt ) {
        for( var char in this.characters )
        {
            this.characters[ char ].update( dt );
        }
        
        if( this.spectatorAvatar )
        {
            this.spectatorAvatar.update( dt );
        }
    },
    
    // Gets the character the player controls
    getPlayerCharacter: function() {
        if( !this.spectatorMode && this.playerCharacterId != undefined )
        {
            return this.characters[ this.playerCharacterId ];
        }
        else
        {
            return this.spectatorAvatar;
        }
    },
    
    // Sets the destination of a character
    setCharacterDest: function( data ) {
        var id = data.id;
        if( id != undefined && this.characters[ data.id ] )
        {
            this.characters[ id ].setPosition( data.position );
            this.characters[ id ].setDestination( data.destination );
        }
    },
    
    // Updates the position of a character
    // For forcing a sync
    updateCharacterPos: function( data ) {
        var id = data.id;
        if( id && this.characters[ data.id ] )
        {
            this.characters[ id ].setPosition( data.position );
        }
    }
};