// replace jQuery ajax method to native within Backbone
require("backbone").ajax = require("backbone.nativeajax");

var modules = require.context( "./modules", true, /\.\/\w+\/index\.js/ );

console.log( "Environment ", ENV );

modules.keys().forEach(function( filename ){
    modules( filename );
});