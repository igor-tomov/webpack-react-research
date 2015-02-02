var _            = require( "underscore" ),
    EventEmitter = require( "eventemitter" ).EventEmitter,
    Logger       = require( "logger" );

// shared instance of EventEmitter for all sandboxes
var mediator = new EventEmitter();

function attachListener( method ){
    return function( event, listener, context ){
        if ( ! listener.__sandboxId__ ){
            listener.__sandboxId__ = this.sandboxId;
        }

        mediator[method]( event, listener, context );
    }
}

/**
 * Provide facade API to app environment from module
 *
 * @param moduleName
 * @constructor
 */
function Sandbox( moduleName ){

    // generate uuid for current instance
    this.sandboxId = _.uniqueId( "sandbox-" + moduleName + "-" );

    // instantiate logger
    this.logger = new Logger( moduleName );

    if ( LOGGING ){
        this.logger.enable();
    }
}

Sandbox.prototype = {
    constructor: Sandbox,

    on: attachListener( "on" ),
    once: attachListener( "once" ),
    trigger: mediator.emit,

    off: function( event, listener ){
        if ( listener.__sandboxId__ ){
            delete listener.__sandboxId__;
        }

        mediator.off( event, listener );
    },

    removeSandboxListeners: function(){
        if ( ! mediator._events ){
            return;
        }

        var allEvents = mediator._events,
            sandboxId = this.sandboxId,
            event, listeners, newListeners, i, len;

        for ( event in allEvents ){
            if ( allEvents.hasOwnProperty( event ) ){
                listeners    = Array.isArray( allEvents[event] ) ? allEvents[event] : [allEvents[event]];
                newListeners = [];

                for ( i = 0, len = listeners.length; i < len; i++ ){
                    if ( listeners[i].fn.__sandboxId__ !== sandboxId ){
                        newListeners.push( listeners[i] );
                    }
                }

                allEvents[event] = newListeners.length === 1 ? newListeners[0] : newListeners;
            }
        }
    }
};

module.exports = {
    Sandbox: Sandbox
};