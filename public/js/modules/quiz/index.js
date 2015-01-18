require( "styles/quiz.less" );

var React = require( "react" ),
    View  = require( "./views/quiz.jsx" );

var element = document.getElementById( "quiz" );

React.render( React.createElement( View, null ), element );
