var _ = require( "underscore" );

// Stolen from Backbone 0.9.9 !
// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
function extend(protoProps, staticProps) {
    var parent = this;
    var module;
    if (protoProps && ownProp(protoProps, 'constructor')) {
        module = protoProps.constructor;
    } else {
        module = function(){ parent.apply(this, arguments); };
    }
    core.util.extend(module, parent, staticProps);
    var Module = function(){ this.constructor = module; };
    Module.prototype = parent.prototype;
    module.prototype = new Module();
    if (protoProps) { core.util.extend(module.prototype, protoProps); }
    module.__super__ = parent.prototype;
    return module;
}

/**
 * Base module of application
 *
 * @param {String} name - model name
 * @param {Object} sandbox - provides access to allowed app API
 * @constructor
 */
function Module( name, sandbox ){
    var selector = this.options.selector;

    // set module name
    this.name = name;

    // cache sandbox to current instance
    this.sandbox = sandbox; // todo: add checking via instanceof

    // select target DOM element
    if ( selector !== "none" ){
        selector = selector || "#" + name;

        this.el = document.querySelector( selector );

        if ( ! this.el ){
            sandbox.logger.warn( "Target element '" + selector + "' isn't found" );
        }
    }

    // call instance init method if exists
    if ( typeof this.init === "function" ){
        this.init();
    }

    if ( ENV === "development" ){
        sandbox.logger.log( "module has been initialized." );
    }
}

Module.prototype = {
    constructor: Module,

    type: "base",

    options: {
        selector: null
    },

    render: function(){},

    destroy: function(){
        delete this.sandbox;
    },

    extend: extend
};

var ModuleManager = {

};