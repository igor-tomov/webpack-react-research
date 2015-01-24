var Reflux      = require( "reflux" ),
    _           = require( "underscore" ),
    Actions     = require( "../actions" ),
    Statuses    = require( "../constants/quizStatuses" ),
    Models      = require( "./models/quizData" ),
    ResultGrade = require( "./models/quizResultGrade" ),
    resultRules = require( "../config/resultRules" );

// ------------- Store classes -------------
var quizStore = Reflux.createStore({
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
        this.trigger({
            status: status,
            payload: payload
        });
    },

    dispatchCurrentData: function(){
        var curModel = this.quizzes.current();

        if ( curModel ){
            this.dispatch( Statuses.PROGRESS, {
                cases: curModel.getCases(),
                count: this.getQuizCount(),
                passedCount: this.getPassedCount()
            });
        }
    },

    dispatchNextData: function(){
        var nextModel = this.quizzes.next();

        if ( nextModel ){
            this.dispatch( Statuses.PROGRESS, {
                cases: nextModel.getCases(),
                count: this.getQuizCount(),
                passedCount: this.getPassedCount()
            });
        }else{
            this.dispatchQuizResult();
        }
    },

    dispatchQuizResult: function(){
        var count       = this.getQuizCount(),
            passedCount = this.getPassedCount();

        var curGrade = this.resultGrade.compute( passedCount, count );

        this.dispatch( Statuses.RESULT, _.extend({
            count: count,
            passedCount: passedCount
        }, curGrade.payload ));
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

        var result = this.quizzes
                         .current()
                         .pass( selected );

        this.trigger( result, selected );
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

var quizItemState = Reflux.createStore({
    init: function(){
        this.listenTo( quizStore, this.onCaseStatus );
    },

    onCaseStatus: function( passed, selected ){
        if ( typeof passed === 'boolean' ){
            this.trigger({
                passed: passed,
                selected: selected
            });
        }
    }
});

module.exports = {
    quizStore: quizStore,
    quizItemState: quizItemState
};