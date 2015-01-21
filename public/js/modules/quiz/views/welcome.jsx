var Reflux     = require( "reflux"),
    React      = require( "react" ),
    Actions    = require( "../actions" ),
    CSSAnimate = require( "utils/animation.react" );

module.exports = React.createClass({

    mixins: [CSSAnimate],

    getInitialState: function(){
        return {
            className: "quiz-welcome",
            animateEnter: "fadeIn"
        };
    },

    onFadeOutEnd: function(){
        Actions.startQuiz();
    },

    onStart: function(){
        this.triggerAnimation( "fadeOut", "invisible" );
    },

    render: function(){
        return (
            <div className={this.state.className}>
                <p className="desc">
                    Flux is the application architecture that Facebook uses for building client-side web applications. It complements React's composable view components by utilizing a unidirectional data flow.                </p>
                <p>
                    <button className="btn btn-primary btn-return btn-lg" onClick={this.onStart}>Get started</button>
                </p>
            </div>
        );
    }
});