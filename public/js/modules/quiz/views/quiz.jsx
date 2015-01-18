var React = require( "react" ),
    Reflux = require( "reflux" ),

    QuizStatuses = require( "../constants/quizStatuses" ),

    QuizWelcome = require( "./welcome.jsx" ),
    QuizBoard   = require( "./board.jsx" ),

    QuizStore = require( "../stores" ).quizStore;

module.exports = React.createClass({
    mixins: [Reflux.listenTo( QuizStore, "onDataReceived" )],

    getInitialState: function(){
        return {
            status: QuizStatuses.BOOTSTRAP,
            quizData: {
                cases: [],
                count: 0,
                passedCount: 0
            }
        };
    },

    onDataReceived: function( data ){
        if ( data && data.status ){
            this.setState({
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
                return <h2>This is the end</h2>;// todo: add result container
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