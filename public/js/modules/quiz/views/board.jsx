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
        this.props.onRequestNextCase();
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

    onSelectResult: function( data ){
        this.setState( data );
    },

    requestNextCase: function(){
        this.setState( this.getInitialState() );
        Actions.nextQuizItem();
    },

    render: function(){
        var cases = this.props.cases.map(function( value, i ){
            return (
                <QuizCase
                    key={i}
                    index={i}
                    value={value}
                    onSelectCase={this.onSelectCase}
                    onRequestNextCase={this.requestNextCase}
                    {...this.state}
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