webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	__webpack_require__(3);
	module.exports = __webpack_require__(4);


/***/ },

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__( 15 );

	var React = __webpack_require__( 7 ),
	    View  = __webpack_require__( 12 );

	var element = document.getElementById( "quiz" );

	React.render( React.createElement( View, null ), element );


/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__( 17 );

	var React = __webpack_require__( 7 ),
	    View  = __webpack_require__( 13 );

	var element = document.getElementById( "clocks" );

	React.render( React.createElement( View, null ), element );

/***/ },

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__( 19 );

	var React = __webpack_require__( 7 ),
	    View  = __webpack_require__( 14 );

	var element = document.getElementById( "feed" );

	React.render( React.createElement( View, null ), element );

/***/ },

/***/ 12:
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__( 7 ),
	    Reflux = __webpack_require__( 5 ),

	    QuizStatuses = __webpack_require__( 260 ),

	    QuizWelcome = __webpack_require__( 61 ),
	    QuizBoard   = __webpack_require__( 62 ),

	    QuizStore = __webpack_require__( 63 ).quizStore;

	module.exports = React.createClass({displayName: "exports",
	    mixins: [Reflux.listenTo( QuizStore, "onDataReceived" )],

	    getInitialState: function(){
	        return {
	            status: QuizStatuses.BOOTSTRAP,
	            quizData: {
	                cases: [],
	                count: 0,
	                passedCount: 0
	            }
	        };
	    },

	    onDataReceived: function( data ){
	        this.setState({
	            status: data.status,
	            quizData: data.payload
	        });
	    },

	    getCurrentContainer: function(){
	        switch ( this.state.status ){

	            case QuizStatuses.BOOTSTRAP:
	                return React.createElement(QuizWelcome, null);

	            case QuizStatuses.PROGRESS:
	                return React.createElement(QuizBoard, React.__spread({},  this.state.quizData));

	            case QuizStatuses.RESULT:
	                return React.createElement("h2", null, "This is the end");// todo: add result container
	        }
	    },

	    render: function(){
	        var container = this.getCurrentContainer();

	        return (
	            React.createElement("div", null, 
	                React.createElement("div", {className: "page-header"}, 
	                    React.createElement("h1", null, "Quiz section")
	                ), 

	                React.createElement("div", {className: "jumbotron"}, 
	                    container
	                )
	            )
	        );
	    }
	});

/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	var React = __webpack_require__( 7 );

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

	module.exports = React.createClass({displayName: "exports",

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
	            React.createElement("div", {className: "clocks-widget"}, 
	                React.createElement("h3", null, "Current Time"), 
	                React.createElement("p", {className: "clocks-value"}, 
	                    React.createElement("span", null, state.hours), 
	                    React.createElement("span", null, state.minutes), 
	                    React.createElement("span", null, state.seconds)
	                )
	            )
	        );
	    },

	    componentWillUnmount: function(){
	        clearInterval( this._timer );
	    }
	});

/***/ },

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	var React     = __webpack_require__( 7 ),
	    Reflux    = __webpack_require__( 5 ),
	    feedStore = __webpack_require__( 64 );

	var FeedItemBox = React.createClass({displayName: "FeedItemBox",

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
	            React.createElement("div", {className: "feed-item"}, 
	                React.createElement("h4", null, props.title), 
	                React.createElement("p", {className: "feed-date"}, props.date), 
	                React.createElement("p", {className: "feed-desc"}, props.desc)
	            )
	        );
	    }
	});

	module.exports = React.createClass({displayName: "exports",
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
	                React.createElement(FeedItemBox, {
	                    key: item.id, 
	                    title: item.title, 
	                    desc: item.desc, 
	                    date: item.date}
	                )
	            );
	        });

	        return (
	            React.createElement("div", {className: "feed-inner"}, 
	                React.createElement("h2", null, "Last News"), 
	                React.createElement("div", {className: "feed-content"}, 
	                    feed
	                )
	            )
	        );
	    }
	});

/***/ },

/***/ 15:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(16);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(21)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!D:\\projects\\webpack-app\\node_modules\\css-loader\\index.js!D:\\projects\\webpack-app\\node_modules\\less-loader\\index.js!D:\\projects\\webpack-app\\public\\styles\\less\\quiz.less", function() {
			var newContent = require("!!D:\\projects\\webpack-app\\node_modules\\css-loader\\index.js!D:\\projects\\webpack-app\\node_modules\\less-loader\\index.js!D:\\projects\\webpack-app\\public\\styles\\less\\quiz.less");
			if(typeof newContent === 'string') newContent = [module.id, newContent, ''];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(60)();
	exports.push([module.id, ".thumbnail > img,\n.thumbnail a > img,\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n.btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33;\n  border-radius: 6px;\n}\n.btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.dl-horizontal dd:before,\n.dl-horizontal dd:after,\n.container:before,\n.container:after,\n.container-fluid:before,\n.container-fluid:after,\n.row:before,\n.row:after,\n.form-horizontal .form-group:before,\n.form-horizontal .form-group:after,\n.btn-toolbar:before,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:before,\n.btn-group-vertical > .btn-group:after,\n.nav:before,\n.nav:after,\n.navbar:before,\n.navbar:after,\n.navbar-header:before,\n.navbar-header:after,\n.navbar-collapse:before,\n.navbar-collapse:after,\n.pager:before,\n.pager:after,\n.panel-body:before,\n.panel-body:after,\n.modal-footer:before,\n.modal-footer:after {\n  content: \" \";\n  display: table;\n}\n.dl-horizontal dd:after,\n.container:after,\n.container-fluid:after,\n.row:after,\n.form-horizontal .form-group:after,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:after,\n.nav:after,\n.navbar:after,\n.navbar-header:after,\n.navbar-collapse:after,\n.pager:after,\n.panel-body:after,\n.modal-footer:after {\n  clear: both;\n}\n.quiz .quiz-welcome {\n  -webkit-transition: height 0.5s;\n  -o-transition: height 0.5s;\n  transition: height 0.5s;\n}\n.quiz .quiz-welcome .desc {\n  text-align: justify;\n}\n", ""]);

/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(21)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!D:\\projects\\webpack-app\\node_modules\\css-loader\\index.js!D:\\projects\\webpack-app\\node_modules\\less-loader\\index.js!D:\\projects\\webpack-app\\public\\styles\\less\\clocks.less", function() {
			var newContent = require("!!D:\\projects\\webpack-app\\node_modules\\css-loader\\index.js!D:\\projects\\webpack-app\\node_modules\\less-loader\\index.js!D:\\projects\\webpack-app\\public\\styles\\less\\clocks.less");
			if(typeof newContent === 'string') newContent = [module.id, newContent, ''];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(60)();
	exports.push([module.id, ".thumbnail > img,\n.thumbnail a > img,\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n.btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33;\n  border-radius: 6px;\n}\n.btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px;\n}\n.dl-horizontal dd:before,\n.dl-horizontal dd:after,\n.container:before,\n.container:after,\n.container-fluid:before,\n.container-fluid:after,\n.row:before,\n.row:after,\n.form-horizontal .form-group:before,\n.form-horizontal .form-group:after,\n.btn-toolbar:before,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:before,\n.btn-group-vertical > .btn-group:after,\n.nav:before,\n.nav:after,\n.navbar:before,\n.navbar:after,\n.navbar-header:before,\n.navbar-header:after,\n.navbar-collapse:before,\n.navbar-collapse:after,\n.pager:before,\n.pager:after,\n.panel-body:before,\n.panel-body:after,\n.modal-footer:before,\n.modal-footer:after {\n  content: \" \";\n  display: table;\n}\n.dl-horizontal dd:after,\n.container:after,\n.container-fluid:after,\n.row:after,\n.form-horizontal .form-group:after,\n.btn-toolbar:after,\n.btn-group-vertical > .btn-group:after,\n.nav:after,\n.navbar:after,\n.navbar-header:after,\n.navbar-collapse:after,\n.pager:after,\n.panel-body:after,\n.modal-footer:after {\n  clear: both;\n}\n.clocks {\n  padding: 20px;\n}\n.clocks .clocks-widget {\n  max-width: 250px;\n  margin: 0 auto;\n  border-radius: 5px;\n  background-color: #ccc;\n  padding: 5px 10px;\n  -webkit-box-shadow: inset 0 0 10px 5px #bbbbbb;\n  box-shadow: inset 0 0 10px 5px #bbbbbb;\n}\n.clocks .clocks-widget h3 {\n  font-size: 14px;\n  font-weight: 600;\n  color: #555;\n  text-align: center;\n  margin-bottom: 5px;\n}\n.clocks .clocks-widget .clocks-value {\n  font-size: 28px;\n  font-weight: 600;\n  letter-spacing: 2px;\n  text-align: center;\n}\n.clocks .clocks-widget .clocks-value span:not(:last-child):after {\n  content: ':';\n  padding: 0 3px;\n}\n", ""]);

/***/ },

/***/ 19:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(21)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!D:\\projects\\webpack-app\\node_modules\\css-loader\\index.js!D:\\projects\\webpack-app\\node_modules\\less-loader\\index.js!D:\\projects\\webpack-app\\public\\styles\\less\\feed.less", function() {
			var newContent = require("!!D:\\projects\\webpack-app\\node_modules\\css-loader\\index.js!D:\\projects\\webpack-app\\node_modules\\less-loader\\index.js!D:\\projects\\webpack-app\\public\\styles\\less\\feed.less");
			if(typeof newContent === 'string') newContent = [module.id, newContent, ''];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 20:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(60)();
	exports.push([module.id, ".feed {\n  width: 50%;\n  min-width: 350px;\n  margin: 50px auto;\n}\n.feed .feed-inner {\n  border: 1px solid #aaa;\n  border-radius: 5px;\n}\n.feed .feed-inner h2 {\n  font-size: 20px;\n  text-align: center;\n  margin: 10px;\n  text-decoration: underline;\n}\n.feed .feed-inner .feed-content {\n  max-height: 300px;\n  margin-top: 10px;\n  padding: 5px;\n  overflow: hidden;\n  overflow-y: visible;\n  border-top: 1px solid #999;\n}\n.feed .feed-inner .feed-content .feed-item {\n  border-bottom: 1px solid #999;\n}\n.feed .feed-inner .feed-content .feed-item:first-child {\n  background-color: #fff8dc;\n}\n.feed .feed-inner .feed-content .feed-item h4 {\n  font-size: 12px;\n  font-weight: 800;\n}\n.feed .feed-inner .feed-content .feed-item p {\n  margin-bottom: 5px;\n}\n.feed .feed-inner .feed-content .feed-item .feed-date {\n  font-size: 10px;\n  color: #aaa;\n}\n.feed .feed-inner .feed-content .feed-item .feed-desc {\n  font-size: 12px;\n}\n", ""]);

/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:stylesheet/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },

/***/ 60:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },

/***/ 61:
/***/ function(module, exports, __webpack_require__) {

	var Reflux     = __webpack_require__( 5),
	    React      = __webpack_require__( 7 ),
	    Actions    = __webpack_require__( 126 ),
	    CSSAnimate = __webpack_require__( 127 );

	module.exports = React.createClass({displayName: "exports",

	    mixins: [CSSAnimate],

	    getInitialState: function(){
	        return {
	            className: "quiz-welcome",
	            animateEnter: "fadeIn"
	        };
	    },

	    onFadeOutEnd: function(){
	        Actions.startQuiz();
	    },

	    onStart: function(){
	        this.triggerAnimation( "fadeOut", "invisible" );
	    },

	    render: function(){
	        return (
	            React.createElement("div", {className: this.state.className}, 
	                React.createElement("p", {className: "desc"}, 
	                    "Flux is the application architecture that Facebook uses for building client-side web applications. It complements React's composable view components by utilizing a unidirectional data flow.                "), 
	                React.createElement("p", null, 
	                    React.createElement("button", {className: "btn btn-primary btn-lg", onClick: this.onStart}, "Get started")
	                )
	            )
	        );
	    }
	});

/***/ },

/***/ 62:
/***/ function(module, exports, __webpack_require__) {

	var Reflux     = __webpack_require__( 5),
	    React      = __webpack_require__( 7 ),
	    Actions    = __webpack_require__( 126 ),
	    CSSAnimate = __webpack_require__( 127 );


	var QuizCase = React.createClass({displayName: "QuizCase",

	    onSelectCase: function( event ){
	        var index = event.target.getAttribute( "data-index" );

	        if ( index ){
	            Actions.selectQuizItem( index );
	        }
	    },

	    render: function(){
	        var props = this.props;

	        return (
	            React.createElement("a", {href: "#", "data-index": props.index, className: "list-group-item", onClick: this.onSelectCase}, props.value)
	        );
	    }
	});

	var QuizItem = React.createClass({displayName: "QuizItem",

	    render: function(){
	        var cases = this.props.cases.map(function( value, i ){
	            return React.createElement(QuizCase, {key: i, index: i, value: value});
	        }.bind(this));

	        return (
	            React.createElement("div", {className: "list-group col-xs-12"}, 
	                cases
	            )
	        );
	    }
	});

	module.exports = React.createClass({displayName: "exports",
	    mixins: [CSSAnimate],

	    getInitialState: function(){
	        return {
	            className: "quiz-board",
	            animateEnter: "fadeIn"
	        };
	    },

	    render: function(){
	        return (
	            React.createElement("div", {className: this.state.className}, 
	                React.createElement("div", {className: "container"}, 
	                    React.createElement("div", {className: "row"}, 
	                        React.createElement(QuizItem, {cases: this.props.cases})
	                    )
	                )
	            )
	        );
	    }
	});

/***/ },

/***/ 63:
/***/ function(module, exports, __webpack_require__) {

	var Reflux       = __webpack_require__( 5 ),
	    Backbone     = __webpack_require__( 6 ),
	    Actions      = __webpack_require__( 126 ),
	    QuizStatuses = __webpack_require__( 260 );

	var QUIZ_LIST_URL = '/quizzes';

	// ------------- Store models -------------
	var QuizItem = Backbone.Model.extend({

	    defaults: {
	        cases: [],
	        target: null
	    },

	    getCases: function(){
	        return this.get( "cases" );
	    },

	    /**
	     * Checks case with right answer
	     *
	     * @param {Number} caseIndex - index of case in current case array
	     * @returns {boolean}
	     */
	    pass: function( caseIndex ){
	        var result = this.get( "target" ) === +caseIndex;

	        if ( result ){
	            this.set( "passed", true );
	        }

	        return result;
	    }
	});

	var QuizList = Backbone.Collection.extend({
	    model: QuizItem,
	    url: QUIZ_LIST_URL,

	    // current index of item in game iteration
	    itemIndex: 0,

	    current: function(){
	        return this.at( this.itemIndex );
	    },

	    next: function(){
	        if ( this.itemIndex + 1 >= this.length ){
	            return null;
	        }

	        return this.at( ++this.itemIndex );
	    },

	    reset: function(){
	        this.itemIndex = 0;

	        Backbone.Collection.prototype.reset.apply( this, arguments );
	    },

	    passedCount: function(){
	        return this.where({ passed: true }).length;
	    }
	});


	// ------------- Store classes -------------
	var quizStore = Reflux.createStore({
	    listenables: Actions,

	    init: function(){
	        this.quizzes = new QuizList;
	        this.quizzes.on( "sync", this._onQuizReceived, this );
	    },

	    getQuizCount: function(){
	        return this.quizzes.length;
	    },

	    getPassedCount: function(){
	        return this.quizzes.passedCount();
	    },

	    dispatchQuizData: function(){
	        var model = this.quizzes.next(),
	            message = {
	                status: model ? QuizStatuses.PROGRESS : QuizStatuses.RESULT,
	                payload: {
	                    cases: model ? model.getCases() : [],
	                    count: this.getQuizCount(),
	                    passedCount: this.getPassedCount()
	                }
	            };

	        console.log( "dispatchQuizData: ", message );

	        this.trigger( message );
	    },

	    _onQuizReceived: function(){
	        this.dispatchQuizData();
	    },

	    // --------- action callbacks ---------
	    onStartQuiz: function(){
	        this.quizzes.fetch();
	    },

	    onSelectQuizItem: function( selected ){
	        this.quizzes
	            .current()
	            .pass( selected );

	        this.dispatchQuizData();
	    }
	});

	var quizItemState = Reflux.createStore({

	});

	module.exports = {
	    quizStore: quizStore,
	    quizItemState: quizItemState
	};

/***/ },

/***/ 64:
/***/ function(module, exports, __webpack_require__) {

	var Reflux   = __webpack_require__( 5 ),
	    Backbone = __webpack_require__( 6 );

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

/***/ },

/***/ 126:
/***/ function(module, exports, __webpack_require__) {

	var Reflux = __webpack_require__( 5 );

	module.exports = Reflux.createActions([
	    "startQuiz",
	    "selectQuizItem",
	    "nextQuizItem",
	    "timeout",
	    "resetQuiz"
	]);

/***/ },

/***/ 127:
/***/ function(module, exports, __webpack_require__) {

	/**
	* React mixin provides animation feature with Animate.css
	*/

	if ( typeof document === 'object' && document.nodeType === 9 ){
	    // Constants
	    var ANIMATE_CLASS   = "animated",
	        ANIMATION       = "animation webkitAnimation oAnimation MSAnimation",
	        ANIMATION_START = "animationstart webkitAnimationStart oanimationstart MSAnimationStart",
	        ANIMATION_ITER  = "animationiteration webkitAnimationIteration oanimationiteration	MSAnimationIteration",
	        ANIMATION_END   = "animationend webkitAnimationEnd oanimationend MSAnimationEnd";

	    function capitalize( string ){
	        return string.charAt(0).toUpperCase() + string.slice(1);
	    }

	    var DOMstyles   = document.documentElement.style,
	        animations  = ANIMATION.split( " " ),
	        animationStart, animationIter, animationEnd, i;

	    // determine vendor
	    for ( i = 0; i < animations.length; i++ ){
	        if ( DOMstyles[ animations[i] ] !== undefined ){
	            animationStart  = ANIMATION_START.split( " " )[i];
	            animationIter   = ANIMATION_ITER.split( " " )[i];
	            animationEnd    = ANIMATION_END.split( " " )[i];

	            break;
	        }
	    }

	    if ( ! animationStart && typeof console === "object" ){
	        window.console && console.warn( "Current browser doesn't support CSS Animation" );
	    }

	    /**
	     * Remove animation-specific classes and update component state
	     *
	     * @param {Object} component - target React component
	     */
	    function clearAnimation( component ){
	        var classes    = ( component.state.className || "" ).trim().split(/\s+/),
	            isAnimated = classes.indexOf( ANIMATE_CLASS ),
	            endClass;

	        if ( isAnimated !== -1 ){
	            classes.splice( isAnimated, 2 );

	            endClass = component.__animationEndClass__;

	            if ( endClass ){
	                classes.push( endClass );
	                delete component.__animationEndClass__;
	            }

	            component.setState({
	                className: classes.join(" ")
	            })
	        }
	    }

	    /**
	     * Common handler for animation specific events
	     *
	     * @param {Event} event
	     */
	    function onAnimate( event ){
	        var type = event.type.replace( /^\w*animation/i, "" ),
	            name = event.animationName,
	            callbackName;

	        if ( ! type || ! name ){
	            return;
	        }

	        callbackName = "on" + capitalize( name ) + capitalize( type );

	        if ( typeof this[callbackName] === "function" ){
	            this[callbackName]( event );
	        }

	        if ( type === "End" ){
	            clearAnimation( this );
	        }
	    }

	    // AnimateCSS Mixin
	    module.exports = {
	        componentDidMount: function(){
	            var node           = this.getDOMNode(),
	                animateEnter   = this.state.animateEnter,
	                curOnAnimation = this._onAniation = onAnimate.bind(this);

	            [animationStart, animationIter, animationEnd].forEach(function( eventName ){
	                node.addEventListener( eventName, curOnAnimation, false );
	            });

	            if ( animateEnter ){
	                this.triggerAnimation( animateEnter );
	            }
	        },

	        componentWillUnmount: function(){
	            var node           = this.getDOMNode(),
	                curOnAnimation = this._onAniation;

	            [animationStart, animationIter, animationEnd].forEach(function( eventName ){
	                node.removeEventListener( eventName, curOnAnimation );
	            });

	            delete this._onAniation;
	        },

	        triggerAnimation: function( animateClass, animationEndClass ){
	            var classes    = ( this.state.className || "" ).trim().split( /\s+/ ),
	                isAnimated = classes.indexOf( ANIMATE_CLASS );

	            if ( isAnimated !== -1 ){
	                classes.splice( isAnimated, 2 );
	            }

	            if ( animationEndClass ){
	                this.__animationEndClass__ = animationEndClass;
	            }

	            classes.push( ANIMATE_CLASS, animateClass );

	            this.setState({
	                className: classes.join( " " )
	            })
	        }
	    };
	}

/***/ },

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	var keyMirror = __webpack_require__(261);

	module.exports = keyMirror({
	    BOOTSTRAP: null,
	    PROGRESS: null,
	    RESULT: null
	});

/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	"use strict";

	/**
	 * Constructs an enumeration with keys equal to their value.
	 *
	 * For example:
	 *
	 *   var COLORS = keyMirror({blue: null, red: null});
	 *   var myColor = COLORS.blue;
	 *   var isColorValid = !!COLORS[myColor];
	 *
	 * The last line could not be performed if the values of the generated enum were
	 * not equal to their keys.
	 *
	 *   Input:  {key1: val1, key2: val2}
	 *   Output: {key1: key1, key2: key2}
	 *
	 * @param {object} obj
	 * @return {object}
	 */
	var keyMirror = function(obj) {
	  var ret = {};
	  var key;
	  if (!(obj instanceof Object && !Array.isArray(obj))) {
	    throw new Error('keyMirror(...): Argument must be an object.');
	  }
	  for (key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = key;
	  }
	  return ret;
	};

	module.exports = keyMirror;


/***/ }

});