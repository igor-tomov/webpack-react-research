// replace jQuery ajax method to native within Backbone
require("backbone").ajax = require("backbone.nativeajax");