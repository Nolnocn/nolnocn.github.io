var site = site || {};

site.portfolioModal = {
    modalTitle: undefined,
    modalImg: undefined,
    modalTbl: undefined,
    modalGithub: undefined,
    modalDemo: undefined,
    
    modalProjTitle: undefined,
    modalProjType: undefined,
    modalProjTech: undefined,
    modalProjDate: undefined,
    modalProjDuration: undefined,
    modalProjTeam: undefined,
    modalProjRole: undefined,
    modalProjContrib: undefined,
    modalProjDesc: undefined,
    modalProjFunFacts: undefined,
    
    init: function() {
        this.modalTitle = $( "#modalTitle" );
        this.modalImg = $( "#modalImg" );
        this.modalTbl = $( "#portfolioItemInfo" );
        this.modalGithub = $( "#modalGithub" );
        this.modalDemo = $( "#modalDemo" );
        
        this.modalProjTitle = $( "#modalProjTitle" );
        this.modalProjType = $( "#modalProjType" );
        this.modalProjTech = $( "#modalProjTech" );
        this.modalProjDate = $( "#modalProjDate" );
        this.modalProjDuration = $( "#modalProjDuration" );
        this.modalProjTeam = $( "#modalProjTeam" );
        this.modalProjRole = $( "#modalProjRole" );
        this.modalProjContrib = $( "#modalProjContrib" );
        this.modalProjDesc = $( "#modalProjDesc" );
        this.modalProjFunFacts = $( "#modalProjFunFacts" );
    },
    
    setModalContent: function( projectName ) {
        var content = site.portfolioContent[ projectName ];
        
        this.modalTitle.html( content.title );
        this.modalImg.attr( "src", content.img );
        this.modalImg.attr( "alt", content.title );

        if( content.git )
        {
            this.modalGithub.attr( "href", content.git );
            this.modalGithub.removeClass( "hidden" );
        }
        else
        {
            this.modalGithub.addClass( "hidden" );
        }

        if( content.demo )
        {
            this.modalDemo.attr( "href", content.demo );
            this.modalDemo.removeClass( "hidden" );
        }
        else
        {
            this.modalDemo.addClass( "hidden" );
        }

        if( !content.demo || !content.git )
        {
            $( "#modalLinkDivider" ).addClass( "hidden" );
        }
        else
        {
            $( "#modalLinkDivider" ).removeClass( "hidden" );
        }
        
        if( content.isProject )
        {
            this.modalTbl.addClass( "hidden" );
        }
        else
        {
            this.modalTbl.removeClass( "hidden" );
            
            this.modalProjTitle.html( content.title );
            this.modalProjType.html( content.type );
            this.modalProjTech.html( content.tech );
            this.modalProjDate.html( content.date );
            this.modalProjDuration.html( content.duration );
            this.modalProjTeam.html( content.team );
            this.modalProjRole.html( content.role );
            this.modalProjContrib.html( content.contrib );
            this.modalProjDesc.html( "<b>Summary:</b><br>" + content.desc );
        }
    },
};

$( document ).ready( function() {
    site.portfolioModal.init();
    
    $( ".portfolio-item" ).each( function() {
        $( this ).on( "click", function( e ) {
            site.portfolioModal.setModalContent( $( this ).attr( "id" ) );
            //this.blur();
        });
    } );
} );