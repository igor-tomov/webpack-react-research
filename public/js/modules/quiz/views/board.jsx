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
            selectClass, animateName;

        if ( passed !== null ){
            if ( passed ){
                selectClass = SELECT_SUCCESS;
                animateName = ANIMATE_SUCCESS;
            }else{
                selectClass = SELECT_FAIL;
                animateName = ANIMATE_FAIL;
            }

            this.triggerAnimation( animateName, {start: selectClass});
        }else{
            this.setState( this.getInitialState() );
        }
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
    mixins: [Reflux.listenTo( quizItemState, "onSelectResult" )],

    getInitialState: function(){
        return {
            passed: null,
            selected: -1
        }
    },

    componentWillReceiveProps: function(){
        this.setState( this.getInitialState() );
    },

    onSelectResult: function( data ){
        this.setState( data );
    },

    onSelectCase: function( event ){
        event.preventDefault();

        if ( this.state.passed !== null ){
            return;
        }

        var index = event.target.getAttribute( "data-index" );

        if ( index ){
            Actions.selectQuizItem( index );
        }
    },

    render: function(){
        var selected = this.state.selected,
            passed   = this.state.passed,

            cases = this.props.cases.map(function( value, i ){
                return (
                    <QuizCase
                        key={i}
                        index={i}
                        value={value}
                        passed={selected === i ? passed : null}
                        onSelectCase={this.onSelectCase}
                    />
                );
            }.bind(this));

        console.log( "QuizItem state: ", this.state );

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