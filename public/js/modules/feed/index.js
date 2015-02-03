require( "styles/feed.less" );

var React = require( "react" ),
    View  = require( "./views/feed.jsx" );

module.exports = {
    init: function(){
        this.sandbox.on( "quiz::close:feed", this.onClose.bind(this) );
        React.render( React.createElement( View, null ), this.el );
    },

    onClose: function(){
        React.unmountComponentAtNode( this.el );
        this.destroy();
    }
};