var React     = require( 'react' ),
    Reflux    = require( 'reflux' ),
    feedStore = require( '../stores/feed.js' );

var FeedItemBox = React.createClass({

    getDefaultProps: function(){
        return {
            title: "Untitled",
            date: "",
            desc: "---"
        }
    },

    render: function(){
        var props = this.props;

        return (
            <div className="feed-item">
                <h4>{props.title}</h4>
                <p className="feed-date">{props.date}</p>
                <p className="feed-desc">{props.desc}</p>
            </div>
        );
    }
});

module.exports = React.createClass({
    mixins: [Reflux.ListenerMixin],

    getInitialState: function(){
        return {
            items: []
        }
    },

    componentDidMount: function(){
        this.listenTo( feedStore, this.onFeedReceived );
    },

    onFeedReceived: function( items ){
        this.setState({
            items: items.concat( this.state.items )
        });
    },

    render: function(){
        var feed = this.state.items.map(function( item ){
            return (
                <FeedItemBox
                    key={item.id}
                    title={item.title}
                    desc={item.desc}
                    date={item.date}
                />
            );
        });

        return (
            <div className='feed-inner'>
                <h2>Last News</h2>
                <div className="feed-content">
                    {feed}
                </div>
            </div>
        );
    }
});