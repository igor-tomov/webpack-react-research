require( "styles/clocks.less" );

var React = require( "react" ),
    View  = require( "./views/clocks.jsx" );

var element = document.getElementById( "clocks" );

React.render( React.createElement( View, null ), element );