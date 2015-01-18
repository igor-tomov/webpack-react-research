/** @jsx React.DOM */
var React = require( "react" );

function prependZero( strNumber ){
    strNumber = strNumber.toString();

    if ( strNumber.length < 2 ){
        strNumber = '0' + strNumber;
    }

    return strNumber;
}

function getNowTime(){
    var now = new Date;

    return {
        hours: prependZero( now.getHours() ),
        minutes: prependZero( now.getMinutes() ),
        seconds: prependZero( now.getSeconds() )
    };
}

module.exports = React.createClass({

    getInitialState: function(){
        return getNowTime();
    },

    componentDidMount: function(){
        this._timer = setInterval( function(){
            this.setState( getNowTime() );
        }.bind( this ), 1000 );
    },

    render: function(){
        var state = this.state;

        return (
            <div className="clocks-widget">
                <h3>Current Time</h3>
                <p className="clocks-value">
                    <span>{state.hours}</span>
                    <span>{state.minutes}</span>
                    <span>{state.seconds}</span>
                </p>
            </div>
        );
    },

    componentWillUnmount: function(){
        clearInterval( this._timer );
    }
});