/* global DOMParser */
( function() {
    
    var parser = new DOMParser();
    
    function display( something ) {
        
        if ( typeof something === "string" ) {
            
            var parsed = parser.parseFromString( something, "text/html" );
            Array.from( parsed.querySelector( "body" ).childNodes ).forEach( node => {

                document.body.appendChild( node );
                if ( node.tagName === "SCRIPT" ) 
                    try {
                        
                        eval.call( window, node.textContent );
                        
                    } catch( ex ) {
                        
                        console.error( ex );
                        
                    }
                else if ( node.querySelectorAll )
                    Array.from( node.querySelectorAll( "script" ) ).forEach( script => eval( script.textContent ) );
                
            } );
            
        }
        else if ( something instanceof Error )
            document.body.innerHTML += something.stack;
        else
            document.body.innerHTML += JSON.stringify( something );
        document.body.classList.remove( "loading" );
        
    }
    
    function dynamicInclude() {
        
        var loading = Array.from( document.head.querySelectorAll( "meta" ) )
            .filter( meta => meta.getAttribute( "name" ) === "dynamic-include" )
            .map( meta => meta.getAttribute( "content" ) )
            .map( path => window.fetch( path ) );
        if ( loading.length ) document.body.classList.add( "loading" );
        Promise.all( loading ).then( results => 
            Promise.all( results.map( result => result.text() ) ).then( htmls => 
                htmls.forEach( display ) 
            ).catch( display )
        ).catch( display );
            
    }
    
    function DOMContentLoaded() {
        
        
        
    }
    
    ( function immediate() {
    
        document.addEventListener( "DOMContentLoaded", () => setTimeout( DOMContentLoaded ) );
        dynamicInclude();
        
    }() );
    

}() );
