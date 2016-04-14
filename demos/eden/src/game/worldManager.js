"use strict";

var app = app || {};

app.worldManager = {
    fire: undefined,
    loveTree: undefined,
    trees: [],
    
    // Initializer
    init: function( data ) {
        var fire = data.fire;
        this.fire = app.gameManager.group.create( fire.x, fire.y, "fire" );
        this.fire.anchor.setTo( 0.5, 1.0 );
        this.fire.scale.setTo( 0.5, 0.5 );
        
        var loveTree = data.loveTree;
        this.loveTree = app.gameManager.group.create( loveTree.x, loveTree.y, "loveTree" );
        this.loveTree.anchor.setTo( 0.5, 0.9 );
        this.loveTree.inputEnabled = true;
        this.loveTree.input.priorityID = 1;
        this.loveTree.events.onInputDown.add( function( lt, pointer ) {
            if( !app.characterManager.spectatorMode )
            {
                var char = app.characterManager.getPlayerCharacter();
                char.goToLoveTree( { x: lt.x, y: lt.y }, { x: pointer.worldX, y: pointer.worldY } );
            }
        } );
        
        var trees = data.trees;
        for( var i = 0; i < trees.length; i++ )
        {
            var tree = app.gameManager.group.create( trees[ i ].x, trees[ i ].y, "tree" );
            tree.anchor.setTo( 0.5, 1.0 );
            tree.scale.setTo( 0.5 * ( Math.random() > 0.5 ? 1 : -1 ), 0.5 );
            this.trees.push( tree );
        }
        
        // Add client-side aesthetic details
        for( var j = 0; j < 50; j++ )
        {
            var asset = Math.random() > 0.7 ? "flower" : "grass";
            var world = app.game.world;
            var deet = app.gameManager.group.create( Math.random() * world.width, Math.random() * world.height, asset );
        }
    }
};