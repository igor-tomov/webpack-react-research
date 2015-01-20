var Reflux       = require( "reflux" ),
    Backbone     = require( "backbone" ),
    Actions      = require( "../actions" ),
    QuizStatuses = require( "../constants/quizStatuses" );

var QUIZ_LIST_URL = '/quizzes';

// ------------- Store models -------------
var QuizItem = Backbone.Model.extend({

    defaults: {
        cases: [],
        target: null
    },

    getCases: function(){
        return this.get( "cases" );
    },

    /**
     * Checks case with right answer
     *
     * @param {Number} caseIndex - index of case in current case array
     * @returns {boolean}
     */
    pass: function( caseIndex ){
        var result = this.get( "target" ) === +caseIndex;

        if ( result ){
            this.set( "passed", true );
        }

        return result;
    }
});

var QuizList = Backbone.Collection.extend({
    model: QuizItem,
    url: QUIZ_LIST_URL,

    // current index of item in game iteration
    itemIndex: 0,

    current: function(){
        return this.at( this.itemIndex );
    },

    next: function(){
        if ( this.itemIndex + 1 >= this.length ){
            return null;
        }

        return this.at( ++this.itemIndex );
    },

    reset: function(){
        this.itemIndex = 0;

        Backbone.Collection.prototype.reset.apply( this, arguments );
    },

    passedCount: function(){
        return this.where({ passed: true }).length;
    }
});


// ------------- Store classes -------------
var quizStore = Reflux.createStore({
    listenables: Actions,

    init: function(){
        this.quizzes = new QuizList;
        this.quizzes.on( "sync", this.onQuizReceived, this );
    },

    getQuizCount: function(){
        return this.quizzes.length;
    },

    getPassedCount: function(){
        return this.quizzes.passedCount();
    },

    dispatchQuizData: function(){
        var model = this.quizzes.next();

        this.trigger({
            status: model ? QuizStatuses.PROGRESS : QuizStatuses.RESULT,
            payload: {
                cases: model ? model.getCases() : [],
                count: this.getQuizCount(),
                passedCount: this.getPassedCount()
            }
        });
    },

    onQuizReceived: function(){
        this.dispatchQuizData();
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
        this.dispatchQuizData();
    },

    onTimeout: function(){
        this.dispatchQuizData();
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