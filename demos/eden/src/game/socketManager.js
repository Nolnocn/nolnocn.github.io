"use strict";

var app = app || {};

app.socketManager = {
    socket: undefined,
    
    // Initializer
    init: function() {
        this.socket = io.connect( "https://morning-caverns-5926.herokuapp.com/" );
        
        this.socket.on( "connect", this.onConnection );
        
        this.socket.on( "setCharacter", this.onCharacterSet );
        this.socket.on( "setSpectator", this.onSpectatorSet );
        
        this.socket.on( "charData", this.onCharData );
        this.socket.on( "worldData", this.onWorldData );
        this.socket.on( "charDestUpdate", this.onCharDestUpdate );
        this.socket.on( "charDestReached", this.onCharDestReached );
        this.socket.on( "charAgeUp", this.onCharAgeUp );
        this.socket.on( "charDied", this.onCharDeath );
        this.socket.on( "charAdded", this.onCharAdded );
    },
    
    // Handles connection event
    onConnection: function( data ) {
        //console.log( data );
    },
    
    // Handles character set event
    onCharacterSet: function( data ) {
        app.characterManager.assignCharacter( false, data.id );
    },
    
    // Handles spectator set event
    onSpectatorSet: function( data ) {
        app.characterManager.assignCharacter( true, -1 );
    },
    
    // Handles receiving data for characters
    onCharData: function( data ) {
        //console.log( data );
        app.characterManager.addCharacters( data );
    },
    
    // Handles receiving environment data
    onWorldData: function( data ) {
        app.worldManager.init( data );
    },
    
    // Handles changing a character's destination
    onCharDestUpdate: function( data ) {
        app.characterManager.setCharacterDest( data );
    },
    
    // Handles a character reaching their destination
    onCharDestReached: function( data ) {
        // Would trigger some kind of action upon arrival... :(
    },
    
    // Handles a character increasing their age state
    onCharAgeUp: function( data ) {
        app.characterManager.handleAgeUp( data );
    },
    
    // Handles the inevitable
    onCharDeath: function( data ) {
        app.characterManager.removeCharacter( data );
    },
    
    // Handles birth and spontaneous existance
    onCharAdded: function( data ) {
        app.characterManager.addCharacter( data );
    },
    
    // Sends a message with data up to the great server gods
    sendMessage: function( type, data ) {
        this.socket.emit( type, data );
    }
};
