var Reflux        = require( "reflux"),
    React         = require( "react" ),
    Actions       = require( "../actions" ),
    quizItemState = require( "../stores" ).quizItemState,
    CSSAnimate    = require( "utils/animation.react" );

var SELECT_SUCCESS  = 'list-group-item-success',
    SELECT_FAIL     = 'list-group-item-danger',
    ANIMATE_SUCCESS = 'pulse',
    ANIMATE_FAIL    = 'shake';


var QuizCase = React.createClass({
    mixins: [CSSAnimate],

    getInitialState: function(){
        return {
            className: "list-group-item"
        }
    },

    componentWillReceiveProps: function( props ){
        var passed = props.passed,
            selectClass, animateClass;

        if ( passed === null ){
            return;
        }

        if ( passed === true ){
            selectClass  = SELECT_SUCCESS;
            animateClass = ANIMATE_SUCCESS;
        }else{
            selectClass  = SELECT_FAIL;
            animateClass = ANIMATE_FAIL;
        }

        this.triggerAnimation( animateClass, {start: selectClass});
    },

    onAnimationEnd: function(){
        Actions.nextQuizItem();
    },

    render: function(){
        var props = this.props;

        return (
            <a href="#"
                className={this.state.className}
                data-index={props.index}
                onClick={props.onSelectCase}>
                {props.value}
            </a>
        );
    }
});

var QuizItem = React.createClass({
    mixins: [Reflux.listenTo( quizItemState, "onSelectState" )],

    getInitialState: function(){
        return {
            passed: null,
            selected: -1
        }
    },

    onSelectCase: function( event ){
        var index = event.target.getAttribute( "data-index" );

        if ( index ){
            Actions.selectQuizItem( index );
        }
    },

    onSelectState: function( data ){
        console.log( "onSelectState: ", data );
        this.setState( data );
    },

    render: function(){
        var selected  = this.state.selected,
            clickable = selected < 0;

        var cases = this.props.cases.map(function( value, i ){
            var passed = null;

            if ( i === selected ){
                passed = this.state.passed;
            }

            return (
                <QuizCase
                    key={i}
                    index={i}
                    value={value}
                    passed={passed}
                    onSelectCase={clickable ? this.onSelectCase : null}
                />
            );
        }.bind(this));

        return (
            <div className="quiz-item">
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