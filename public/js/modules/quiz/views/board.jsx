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

        return (
            <div className="quiz-item">
                {cases}
            </div>
        );
    }
});

var QuizTimer = React.createClass({

    startTimer: function(){
        this.stopTimer();

        this.__timer__ = setInterval(function(){
            var time = this.state.time - 1;

            if ( time < 0 ){
                this.stopTimer();
                Actions.timeout();
            }else{
                this.setState({
                    time: time
                });
            }
        }.bind(this), 1000 );
    },

    stopTimer: function(){
        if ( this.__timer__ ){
            clearInterval( this.__timer__ );
        }
    },

    componentWillMount: function(){
        this.setState({
            time: this.props.timeout
        });
    },

    componentDidMount: function(){
        this.unsubscribe = quizItemState.listen( this.stopTimer );
    },

    componentWillReceiveProps: function(){
        this.startTimer();

        this.setState({
            time: this.props.timeout
        });

    },

    componentWillUnmount: function(){
        this.stopTimer();
        this.unsubscribe();
    },

    render: function(){
        return (
            <div className="quiz-bottom-col quiz-timer">
                <span>{this.state.time}</span>
            </div>
        );
    }
});

var QuizScores = React.createClass({

    getDefultProps: function(){
        return {
            passedCount: 0,
            count: 0
        }
    },

    render: function(){
        var props = this.props;

        return (
            <div className="quiz-bottom-col quiz-scores">
                <span>{props.passedCount}</span>
                <span>{props.count}</span>
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
        var props = this.props;

        return (
            <div className={this.state.className}>
                <div className="container">
                    <div className="row">
                        <QuizItem cases={this.props.cases} />
                        <div className="quiz-bottom">
                            <QuizTimer timeout={props.timeout} />
                            <QuizScores count={props.count} passedCount={props.passedCount} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});