var _           = require( "underscore" ),
    Reflux      = require( "reflux" ),
    Actions     = require( "../actions" ),
    Statuses    = require( "../constants/quizStatuses" ),
    Models      = require( "./models/quizData" ),
    ResultGrade = require( "./models/quizResultGrade" ),
    config      = require( "../config" ),
    resultRules = require( "../config/resultRules" );

// ------------- Store classes -------------
module.exports = Reflux.createStore({
    listenables: Actions,

    init: function(){
        this.quizzes     = new Models.QuizList;
        this.resultGrade = new ResultGrade( resultRules );

        this.quizzes.on( "sync", this.onQuizReceived, this );
    },

    getQuizCount: function(){
        return this.quizzes.length;
    },

    getPassedCount: function(){
        return this.quizzes.passedCount();
    },

    dispatch: function( status, payload ){
        var defaultPayload = {
            count: this.getQuizCount(),
            passedCount: this.getPassedCount(),
            timeout: config.timeout
        };

        this.trigger({
            status: status,
            payload: _.extend( defaultPayload, payload )
        });
    },

    dispatchCurrentData: function(){
        var curModel = this.quizzes.current();

        if ( curModel ){
            this.dispatch( Statuses.PROGRESS, {
                cases: curModel.getCases()
            });
        }
    },

    dispatchNextData: function(){
        var nextModel = this.quizzes.next();

        if ( nextModel ){
            this.dispatch( Statuses.PROGRESS, {
                cases: nextModel.getCases()
            });
        }else{
            this.dispatchQuizResult();
        }
    },

    dispatchCaseResult: function( index, passed ){
        this.dispatch( Statuses.PROGRESS, {
            selectedCase: {
                index: index,
                passed: passed
            }
        });
    },

    dispatchQuizResult: function(){
        var curGrade = this.resultGrade.compute( this.getPassedCount(), this.getQuizCount() );

        this.dispatch( Statuses.RESULT, {
            result: curGrade
        });
    },

    dispatchReset: function(){
        this.quizzes.reset();
        this.dispatch( Statuses.BOOTSTRAP );
    },

    // --------- model callbacks ---------

    onQuizReceived: function(){
        this.dispatchCurrentData();
    },

    // --------- action callbacks ---------
    onStartQuiz: function(){
        this.quizzes.fetch();
    },

    onSelectQuizItem: function( selected ){
        selected = parseInt( selected, 10 );

        var passed = this.quizzes
                         .current()
                         .pass( selected );

        this.dispatchCaseResult( selected, passed );
    },

    onNextQuizItem: function(){
        this.dispatchNextData();
    },

    onTimeout: function(){
        this.dispatchNextData();
    },

    onResetQuiz: function(){
        this.dispatchReset();
    }
});