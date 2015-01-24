var Reflux        = require( "reflux"),
    React         = require( "react" ),
    Actions       = require( "../actions" ),
    CSSAnimate    = require( "utils/animation.react" );

module.exports = React.createClass({

    mixins: [CSSAnimate],

    getInitialState: function(){
        return {
            className: "quiz-result",
            animateEnter: "fadeIn"
        };
    },

    componentWillMount: function(  ){
        this.setState({
           className: this.state.className + " " + this.props.alertClass
        });
    },

    _onClick: function(){
        this.triggerAnimation( "fadeOut", "hide" );
    },

    onFadeOutEnd: function(){
        Actions.resetQuiz();
    },

    render: function(){
        var props = this.props;

        return (
            <div className={this.state.className}>
                <h1>
                    <span>{props.passedCount}</span>
                    <span>{props.count}</span>
                </h1>
                <p className="quiz-result-message">{props.message}</p>
                <p className="quiz-result-bottom">
                    <button className="btn btn-primary" onClick={this._onClick}>Go Back</button>
                </p>
            </div>
        );
    }
});
