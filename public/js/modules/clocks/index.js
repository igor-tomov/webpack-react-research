require( "styles/clocks.less" );

var React = require( "react" ),
    View  = require( "./views/clocks.jsx" );

module.exports = {
    init: function(){
        React.render( React.createElement( View, null ), this.el );
    }
};