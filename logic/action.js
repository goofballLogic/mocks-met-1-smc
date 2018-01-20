// thanks: https://stackoverflow.com/a/2880929
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

window.attempt = function( logic ) {
    
    /* global localStorage */
    try {
        
        logic();
        
    } catch( ex ) {
        
        var result = document.querySelector( "#result" ) || document.body;
        result.innerHTML = "<h1>Oops</h1><p>That didn't work :(.</p>";
        result.innerHTML += ex.message;
        result.innerHTML += JSON.stringify( localStorage, null, 3 );
        
    }
    
};

window.populate = function( selector, dataOrStrategy, maybeContext ) {

    var maybeContext = maybeContext || document;
    var strategy = typeof dataOrStrategy === "function" 
        ? dataOrStrategy 
        : function( element ) { element.textContent = dataOrStrategy; };
    for( var element of maybeContext.querySelectorAll( selector ) )
        strategy( element );
        
};

window.entemplate = function( templateSelector, containerSelector, collection, populateStrategy  ) {
  
    var container = document.querySelector( containerSelector );
    container.innerHTML = "";
    var content = document.querySelector( templateSelector ).content;
    collection.forEach( function( item ) {
        
        var node = document.importNode( content, true );
        populateStrategy( 
            
            function( selector, dataOrStrategy ) { window.populate( selector, dataOrStrategy, node ); },
            item
            
        );
        container.appendChild( node );

    } );
    
};