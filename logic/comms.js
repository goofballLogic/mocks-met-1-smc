window.makeAbsolute = function( href ) {
    
    if ( href[ 0 ] !== "/" ) href += "/";
    return "https://mocks-met-1-smc-goofballlogic.c9users.io" + href;
    
};

window.sendEmail = function( to, subj, body ) {
    
    var win = window.open();
    if ( !win ) { throw new Error( "Allow popups and refresh this page" ); }
    win.document.body.innerHTML = "<p>To: " + to + "<br />Subject: " + subj + "</p><br /><br />" + body;
    
};
