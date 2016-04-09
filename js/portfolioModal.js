var site = site || {};

site.portfolioModal = {
    modalTitle: undefined,
    modalImg: undefined,
    modalGithub: undefined,
    modalDemo: undefined,
    modalDesc: undefined,
    
    init: function() {
        this.modalTitle = $( "#modalTitle" );
        this.modalImg = $( "#modalImg" );
        this.modalGithub = $( "#modalGithub" );
        this.modalDemo = $( "#modalDemo" );
        this.modalDesc = $( "#modalDesc" );
    },
    
    setModalContent: function( projectName ) {
        var content = site.portfolioContent[ projectName ];
        
        this.modalTitle.html( content.title );
        this.modalImg.attr( "src", content.img );
        this.modalImg.attr( "alt", content.title );
        this.modalGithub.attr( "href", content.git );
        this.modalDemo.attr( "href", content.demo );
        this.modalDesc.html( content.desc );
    }
};

$( document ).ready( function() {
    site.portfolioModal.init();
    
    $( ".portfolio-item" ).each( function() {
        $( this ).on( "click", function( e ) {
            site.portfolioModal.setModalContent( $( this ).attr( "id" ) );
        });
    } );
} );