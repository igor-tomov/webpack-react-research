var config   = require( "../../config" ),
    Backbone = require( "backbone" );

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
    url: config.quizListURI,

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

module.exports = {
    QuizItem: QuizItem,
    QuizList : QuizList
};