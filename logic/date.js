window.ISODate = function( dateish ) {
    
    return dateish.toISOString().substr( 0, 10 );
    
};
