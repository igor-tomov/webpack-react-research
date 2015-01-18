/**
* React mixin provides animation feature with Animate.css: http://daneden.github.io/animate.css/
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
                classes.indexOf( endClass ) === -1 && classes.push( endClass );
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

        // invoke callback by type
        callbackName = "onAnimation" + capitalize( type );

        if ( typeof this[callbackName] === "function" ){
            this[callbackName]( event );
        }

        // invoke callback by type and name
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

        /**
         * Bind specific animation event handlers
         */
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

        /**
         * Unbind specific animation event handlers
         */
        componentWillUnmount: function(){
            var node           = this.getDOMNode(),
                curOnAnimation = this._onAniation;

            [animationStart, animationIter, animationEnd].forEach(function( eventName ){
                node.removeEventListener( eventName, curOnAnimation );
            });

            delete this._onAniation;
        },

        /**
         * Trigger animation with supplied name.
         * Syntax of hook classes:
         *      {
         *          start: "this class will be added before animation start",
         *          end: "this class will be added after animation complete"
         *      }
         *
         * @param {String} name - animation name which is defined in animate.css
         * @param {Object} [hookClasses] - class names which is should be added to node before or after animationEnd,
         *                                 in case of supplied string, it will be treated as end hook
         */
        triggerAnimation: function( name, hookClasses ){
            hookClasses = hookClasses || {};

            if ( typeof hookClasses === "string" ){
                hookClasses = {end: hookClasses};
            }

            var classes    = ( this.state.className || "" ).trim().split( /\s+/ ),
                isAnimated = classes.indexOf( ANIMATE_CLASS );

            if ( isAnimated !== -1 ){
                classes.splice( isAnimated, 2 );
            }

            if ( hookClasses.start && classes.indexOf( hookClasses.start ) === -1 ){
                classes.push( hookClasses.start );
            }

            classes.push( ANIMATE_CLASS, name );

            this.setState({
                className: classes.join( " " )
            });

            if ( hookClasses.end ){
                this.__animationEndClass__ = hookClasses.end;
            }
        }
    };
}