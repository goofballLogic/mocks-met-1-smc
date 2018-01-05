/* global localStorage */
function storee( name, value ) {
    
    return Object.assign( value, { __storage_key: name } );
    
}

function orDefault( name, defaultValue ) {
    
    try {
    
        var ret = localStorage.getItem( name );
        ret = ret && JSON.parse( ret );
        if ( ret ) return storee( name, ret );
        
    } catch( ex ) {
        
        console.warn( ex, "fetching", name );
        
    }
    localStorage.setItem( name, JSON.stringify( defaultValue ) );
    return storee( name, JSON.parse( localStorage.getItem( name ) ) );
    
}

window.saveToStore = function( value ) {
    
    if ( !( value && value.__storage_key ) ) {
        
        throw new Error( "Not a storage object" );
        
    }
    var plainValue = JSON.parse( JSON.stringify( value ) );
    delete plainValue.__storage_key;
    localStorage.setItem( value.__storage_key, JSON.stringify( plainValue ) );
    
};

window.newid = function() {
    
    // thanks: https://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    
};

window.challenges = orDefault( "challenges", [ { id: "14a74fdd-931a-41b2-92f9-c26ea77974a1", name: "World Radio Day Maintenance Challenge", start: "2017-12-13", end: "2018-02-13" } ] );
