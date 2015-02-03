// replace jQuery ajax method to native within Backbone
require("backbone").ajax = require("backbone.nativeajax");

var ModuleManager = require( "./core/module" ).ModuleManager
var modules       = require.context( "./modules", true, /\.\/\w+\/index\.js/ );

modules.keys().forEach(function( filename ){
    modules( filename );
});

new ModuleManager( modules ).initModules();
