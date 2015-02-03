require( "styles/quiz.less" );

var React = require( "react" ),
    View  = require( "./views/quiz.jsx" ),
    Actions = require("./actions");

module.exports = {
    init: function(){
        Actions.startQuiz.listen( this.closeFeeds.bind(this) );
        React.render( React.createElement( View, null ), this.el );
    },

    closeFeeds: function(){
        this.sandbox.trigger( "quiz::close:feed" );
    }
};