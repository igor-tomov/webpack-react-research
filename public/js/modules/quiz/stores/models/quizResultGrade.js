/**
 * Compute result state according to input grade rules and results
 *
 * @param {Array} rules
 * @constructor
 */
function QuizResultGrade( rules ){
    this.feed( rules );
}

QuizResultGrade.prototype = {
    constructor: QuizResultGrade,

    feed: function( rules ){
        this._rules = Array.isArray( rules ) ? rules : [];
    },

    compute: function( value, total ){
        var perPoint = 100 / total,
            point    = Number( ( value * perPoint / 100 ).toFixed( 1 ) ),
            rules    = this._rules,
            range, i, length, assert;

        for ( i = 0, length = rules.length; i < length; i++ ){
            range  = rules[i].range;
            assert = Array.isArray( range ) ?
            point >= range[0] && point <= range[1] :
            point === range;

            if ( assert ){
                return rules[i].payload;
            }
        }

        return null;
    }
};

module.exports = QuizResultGrade;