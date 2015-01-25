var React = require( "react" ),
    Reflux = require( "reflux" ),

    QuizStatuses = require( "../constants/quizStatuses" ),

    QuizWelcome = require( "./welcome.jsx" ),
    QuizBoard   = require( "./board.jsx" ),
    QuizResult  = require( "./result.jsx" ),

    QuizStore = require( "../stores" );

module.exports = React.createClass({
    mixins: [Reflux.listenTo( QuizStore, "onDataReceived" )],

    getInitialState: function(){
        return {
            status: QuizStatuses.BOOTSTRAP,
            quizData: {
                cases: [],
                selectedCase: null,
                result: null,
                count: 0,
                passedCount: 0,
                timeout: 0
            }
        };
    },

    onDataReceived: function( data ){
        if ( data && data.status ){
            this.replaceState({
                status: data.status,
                quizData: data.payload
            });
        }
    },

    getCurrentContainer: function(){
        switch ( this.state.status ){

            case QuizStatuses.BOOTSTRAP:
                return <QuizWelcome />;

            case QuizStatuses.PROGRESS:
                return <QuizBoard {...this.state.quizData} />;

            case QuizStatuses.RESULT:
                return <QuizResult {...this.state.quizData} />
        }
    },

    render: function(){
        var container = this.getCurrentContainer();

        return (
            <div>
                <div className="page-header">
                    <h1>Quiz section</h1>
                </div>

                <div className="jumbotron">
                    {container}
                </div>
            </div>
        );
    }
});