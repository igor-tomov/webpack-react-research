var _       = require( "underscore" ),
    Sandbox = require( "./mediator" ).Sandbox,
    Logger  = require( "./logger" );

// Stolen from Backbone 1.1.2 !
// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
function extend ( protoProps, staticProps ){
    var parent = this;
    var module;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
        module = protoProps.constructor;
    } else {
        module = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(module, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Module = function(){ this.constructor = module; };

    Module.prototype = parent.prototype;
    module.prototype = new Module;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(module.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    module.__super__ = parent.prototype;

    return module;
};
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
    if ( ! ( sandbox instanceof Sandbox ) ){
        throw new Error( name + ": invalid supplied sandbox" );
    }

    this.sandbox = sandbox;

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

    render: function(){
        this.sandbox.warn( "render() isn't implemented" );
    },

    destroy: function(){
        this.sandbox.removeSandboxListeners();
        delete this.sandbox;
        delete this.el;
    },

    extend: extend
};

Module.extend = extend;

/**
 * Manages modules lifecycle within current app environment
 *
 * @param {Function} require - module loader. This is Webpack specific feature: http://webpack.github.io/docs/context.html
 * @constructor
 */
function ModuleManager( require ){
    this._require       = require;
    this._loadedModules = {};

    // instantiate logger
    this.logger = new Logger( "Module manager" );

    if ( LOGGING ){
        this.logger.enable();
    }
}

ModuleManager.prototype = {
    constructor: ModuleManager,

    MODULE_NAME_PATTERN: /(\w+)(?:\/index\.js)?$/i,

    /**
     * Initialize all models that is provided by current require context
     */
    initModules: function(){

        if ( ENV === "development" ){
            this.logger.groupStart();
        }

        this._require.keys().forEach(function( path ){
            var prototype = this._require( path ),
                ModuleConstructor, sandbox, name;

            // retrieve module name from path
            name = path.match( this.MODULE_NAME_PATTERN );

            if ( name ){
                name = name[1];
            }else{
                throw new Error( "ModuleManager.initModules: module name isn't retrieved from path: ", path );
            }

            if ( this._loadedModules[name] ){
                this.logger.error( "module '" + name + "' is already initialized." );
                return;
            }

            // instantiate Sandbox
            sandbox = new Sandbox( name );

            // get module constructor
            ModuleConstructor = this.factoryModuleConstructor( prototype.type || "base", prototype );

            // instantiate module and cache to list
            this._loadedModules[name] = {
                sandbox: sandbox,
                instance: new ModuleConstructor( name, sandbox )
            };

        }.bind(this));

        if ( ENV === "development" ){
            this.logger.groupEnd();
        }
    },

    /**
     * Define module constructor
     *
     * @param {String} type - module name
     * @param {Function} constructor - module constructor, should be inherited from base model
     */
    registerModuleType: function( type, constructor ){
        if ( ModuleManager._moduleTypes[type] ){
            throw new Error( "ModuleManager.registerModuleType: module '" + type + "' has already defined" );
        }

        if ( typeof constructor !== "function" ){
            throw new Error( "ModuleManager.registerModuleType: module constructor must be function", constructor );
        }

        ModuleManager._moduleTypes[type] = constructor;
    },

    /**
     * Return module constructor according to supplied type
     *
     * @param {String} type - module constructor name
     * @param {Object} prototype - describe concrete functional of module
     */
    factoryModuleConstructor: function( type, prototype ){
        if ( ! ModuleManager._moduleTypes[type] ){
            throw new Error( "ModuleManager.factoryModuleCreator: unrecognized module type: ", type );
        }

        return ModuleManager._moduleTypes[type].extend( prototype );
    },

    /**
     * Destroy supplied module
     * @param {String} name - module name
     */
    destroyModule: function( name ){
        var module = this._loadedModules[name];

        if ( ! module ){
            this.logger.error( "destroyModule(): module '" + name + "' is not defined" );
            return;
        }

        module.instance.destroy();

        delete this._loadedModules[name];
    },

    /**
     * Destroy all modules
     */
    destroy: function(){
        var loadedModules = this._loadedModules;

        for ( var name in loadedModules ){
            if ( loadedModules.hasOwnProperty( name ) ){
                this.destroyModule( name );
            }
        }
    }
};

/**
 * Module constructors list
 * @type {{base: Module}}
 * @private
 */
ModuleManager._moduleTypes = {
    base: Module
};

module.exports = {
    Module: Module,
    ModuleManager: ModuleManager
};