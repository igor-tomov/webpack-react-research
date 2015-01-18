require( "styles/feed.less" );

var React = require( "react" ),
    View  = require( "./views/feed.jsx" );

var element = document.getElementById( "feed" );

React.render( React.createElement( View, null ), element );