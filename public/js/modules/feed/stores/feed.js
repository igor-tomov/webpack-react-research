var Reflux   = require( "reflux" ),
    Backbone = require( "backbone" );

// Constants
var FEED_URL        = "/feed";
var LAST_FEED_URL   = "/feed/last";
var UPDATE_INTERVAL = 10000;

// Models
var FeedItem = Backbone.Model.extend({

    defaults: {
        date: ( new Date ).toDateString(),
        title: "Untitled",
        desc: "---"
    }
});

var Feed = Backbone.Collection.extend({
    model: FeedItem,
    url: FEED_URL
});

// Stores
module.exports = Reflux.createStore({

    init: function(){
        var feed     = this.feed = new Feed,
            feedItem = this.feedItem = new FeedItem;

        feedItem.url = LAST_FEED_URL;

        feed.on( "sync", this._onReceived, this )
            .fetch();

        setTimeout( function(){
            feedItem.on( "change", this._onLastReceived, this  )
                    .fetch();
        }.bind(this), UPDATE_INTERVAL );
    },

    _onReceived: function( feed, data ){
        this.trigger(data);
    },

    _onLastReceived: function(){
        var feedItem = this.feedItem;

        this.trigger( [feedItem.toJSON()] );

        setTimeout( function(){
            feedItem.fetch();
        }, UPDATE_INTERVAL );
    }
});