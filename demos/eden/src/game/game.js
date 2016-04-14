"use strict";

var app = app || {};

function initGame()
{
    var DEFAULT_GAME_WIDTH = 800;
    var DEFAULT_GAME_HEIGHT = 600;
    
    app.game = new Phaser.Game( DEFAULT_GAME_WIDTH, DEFAULT_GAME_HEIGHT, Phaser.AUTO, "game", { 
        preload: preload,
        create: create,
        update: update
    } );
    
    // Phaser preload state func
    function preload()
    {
        app.game.load.spritesheet( "characters", "img/game/character/characters.png", 128, 128 );
        app.game.load.image( "marker", "img/game/character/charactermarker.png" );
        app.game.load.image( "halo", "img/game/character/halo.png" );
        
        app.game.load.spritesheet( "fire", "img/game/world/fire.png", 128, 128 );
        app.game.load.spritesheet( "tree", "img/game/world/tree.png", 256, 256 );
        app.game.load.image( "loveTree", "img/game/world/loveTree.png" );
        
        app.game.load.image( "flower", "img/game/world/flowers.png" );
        app.game.load.image( "grass", "img/game/world/grass.png" );
        //app.game.load.image( "grave", "assets/img/game/world/grave.png" );
    }
    
    // Phaser create state func
    function create()
    {
        app.game.stage.disableVisibilityChange = true;
        app.game.world.setBounds( 0, 0, DEFAULT_GAME_WIDTH * 2, DEFAULT_GAME_HEIGHT * 2 );
        app.game.physics.startSystem( Phaser.Physics.ARCADE );
        
        app.game.stage.backgroundColor = "#79C984";
        
        app.game.camera.x = 400;
        app.game.camera.y = 300;
        
        app.gameManager.group = app.game.add.group();
        
        var bg = app.game.add.sprite( 0, 0 );
        bg.fixedToCamera = true;
        bg.scale.setTo( app.game.width, app.game.height );
        bg.inputEnabled = true;
        bg.input.priorityID = 0;
        bg.events.onInputDown.add( function( bg, pointer ) {
            app.characterManager.getPlayerCharacter().setDestination( { x: pointer.worldX, y: pointer.worldY } );
        } );
        
        /*app.game.input.onDown.add( function( pointer ) {
            //console.log( evt );
            app.characterManager.getPlayerCharacter().setDestination( { x: pointer.worldX, y: pointer.worldY } );
        });*/
        
        app.socketManager.init();
        
        //setGameSize();
    }
    
    // Phaser update state func
    function update()
    {
        var dt = app.game.time.elapsed * 0.01;
        
        app.characterManager.updateCharacters( dt );
        app.gameManager.group.sort( 'y', Phaser.Group.SORT_ASCENDING );
    }
    
    // Sets the size of the game window
    /*function setGameSize()
    {
        var width = Math.min( DEFAULT_GAME_WIDTH, window.innerWidth );
        var height = Math.min( DEFAULT_GAME_HEIGHT, window.innerHeight );
        
        console.log( width );
        console.log( height );

        app.game.width = width;
        app.game.height = height;

        if ( app.game.renderType === Phaser.WEBGL )
        {
            app.game.renderer.resize(width, height);
        }
        
        if( height < window.innerHeight )
        {
            var offset = ( window.innerHeight - height ) * 0.4;
            $( "#game" ).offset( { top: offset } );
        }
        else
        {
            $( "#game" ).offset( { top: 0 } );
        }
    }
    
    $( window ).resize( setGameSize );*/
}

window.onload = initGame;
