var Reflux     = require( "reflux"),
    React      = require( "react" ),
    Actions    = require( "../actions" ),
    CSSAnimate = require( "utils/animation.react" );


var QuizCase = React.createClass({

    onSelectCase: function( event ){
        var index = event.target.getAttribute( "data-index" );

        if ( index ){
            Actions.selectQuizItem( index );
        }
    },

    render: function(){
        var props = this.props;

        return (
            <a href="#" data-index={props.index} className="list-group-item" onClick={this.onSelectCase}>{props.value}</a>
        );
    }
});

var QuizItem = React.createClass({

    render: function(){
        var cases = this.props.cases.map(function( value, i ){
            return <QuizCase key={i} index={i} value={value} />;
        }.bind(this));

        return (
            <div className="list-group col-xs-12">
                {cases}
            </div>
        );
    }
});

module.exports = React.createClass({
    mixins: [CSSAnimate],

    getInitialState: function(){
        return {
            className: "quiz-board",
            animateEnter: "fadeIn"
        };
    },

    render: function(){
        return (
            <div className={this.state.className}>
                <div className="container">
                    <div className="row">
                        <QuizItem cases={this.props.cases} />
                    </div>
                </div>
            </div>
        );
    }
});