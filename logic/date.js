function dateParts( dateish ) {

    return [ dateish.getFullYear(), dateish.getMonth() + 1, dateish.getDate() ];

}
window.formatDate = function( dateish ) {
    
    return dateParts( dateish ).reverse().join( "/" );
    
};
window.ISODate = function( dateish ) {
    
    var parts = dateParts( dateish );
    return [
        parts[ 0 ],
        ( "00" + parts[ 1 ] ).slice( -2 ),
        ( "00" + parts[ 2 ] ).slice( -2 ) 
    ].join( "-" );

};
window.parseISODate = function( value ) {
    
    var parts = value.split( "-" );
    return new Date( parts[ 0 ], parts[ 1 ] - 1, parts[ 2 ] );
    
};
window.diffAsISODays = function( start, end ) {
    
    var startParts = dateParts( start );
    var endParts = dateParts( end );
    var diff = Date.UTC( startParts[ 0 ], startParts[ 1 ] - 1, startParts[ 2 ], 0, 0, 0 ) -
        Date.UTC( endParts[ 0 ], endParts[ 1 ] - 1, endParts[ 2 ], 0, 0, 0 );
    return diff / 1000 / 60 / 60 / 24;
        
};
window.asWeeksOrDays = function( days ) {
    
    return days % 7 === 0  ? ( days / 7 ) + " weeks" : days + " days";

};
window.incrementDateByDays = function( dateish, days ) {

    days = parseInt( days, 10 );
    var parts = dateParts( dateish );
    return new Date( parts[ 0 ], parts[ 1 ] - 1, parts[ 2 ] + days );
    
};
window.beforeToday = function( dateish ) {
    
    var now = new Date();
    if ( dateish.getFullYear() > now.getFullYear() ) return false;
    if ( dateish.getFullYear() < now.getFullYear() ) return true;
    if ( dateish.getMonth() > now.getMonth() ) return false;
    if ( dateish.getMonth() < now.getMonth() ) return false;
    if ( dateish.getDate() >= now.getDate() ) return false;
    return true;
    
};