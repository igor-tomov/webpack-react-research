var EventEmitter = reqiure( "eventemitter" ).EventEmitter,
    Logger       = require( "logger" );

// defaults options for event emitter
var mediator = new EventEmitter({
    wildcard: true,
    delimiter: '::',
    newListener: false,
    maxListeners: 20
});

function Sandbox( moduleName ){
    this.logger = new Logger( moduleName );
}

Sandbox.prototype = {
    on: function( event, listener, contenxt ){
        var callback;

        if ( listener && listener.__callback__ ){
            this.logger.warn( "Listener has already bound, ", listener );
            return;
        }

        if ( contenxt ){
            callback = listener.bind( contenxt );
            listener.__callback__ = callback;
        }else{
            callback = listener;
        }

        mediator.on( event, callback );
    },

    once: function( event, listener, contenxt ){
        if ( contenxt ){
            listener = listener.bind( contenxt );
        }

        mediator.on( event, listener );
    },

    off: function( event, listener ){
        mediator.off( event, listener.__callback__ || listener );
        delete listener.__callback__;
    }
};