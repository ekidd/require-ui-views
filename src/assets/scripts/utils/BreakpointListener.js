define(function(require, exports, module) { // jshint ignore:line
    'use strict';

    var $ = require('jquery');
    var sharedConfig = require('sharedConfig');
    var matchMedia = require('matchMedia');

    /**
     * An object of events used in this utility
     * @default null
     * @property EVENTS
     * @type {Object}
     * @final
     */
    var EVENTS = {
        RESIZE: 'resize'
    };

    //////////////////////////////////////////////////////////////////////////////////
    // CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Breakpoint Listener Utility
     *
     * @class BreakpointListener
     * @constructor
     */
    var BreakpointListener = function() {
        /**
         * A reference to the window
         *
         * @default null
         * @property $window
         * @type {jQuery}
         * @public
         */
        this.$window = null;

        /**
         * A reference to the current breakpoint
         *
         * @default null
         * @property currentBreakpoint
         * @type {String}
         * @public
         */
        this.currentBreakpoint = null;

        /**
         * A reference to an object of breakpoints
         *
         * @default null
         * @property breakpoints
         * @type {Object}
         * @public
         */
        this.breakpoints = null;

        /**
         * Tracks whether the utility is enabled or not
         *
         * @default false
         * @property utilityIsEnabled
         * @type {bool}
         * @public
         */
        this.utilityIsEnabled = false;

        this.init();
    };

    // Store a reference to the prototype
    var proto = BreakpointListener.prototype;

    /**
     * Initializes the Breakpoint Listener
     * Runs a single setupHandlers call, followed by createChildren, getCurrentBreakpoint and enable
     *
     * @method init
     * @public
     * @chainable
     */
    proto.init = function() {
        this.setupHandlers()
            .createChildren()
            .getCurrentBreakpoint()
            .enable();

        return this;
    };

    /**
     * Binds the scope of any handler functions
     * Should only be run on initialization of the view
     *
     * @method setupHandlers
     * @public
     * @chainable
     */
    proto.setupHandlers = function() {
        this.onResizeHandler = this.onResize.bind(this);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements
     * Should only be run on initialization of the view
     *
     * @method createChildren
     * @public
     * @chainable
     */
    proto.createChildren = function() {
        this.$window = $(window);
        this.breakpoints = sharedConfig.breakpoints;

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements
     *
     * @method removeChildren
     * @public
     * @chainable
     */
    proto.removeChildren = function() {
        this.$window = null;
        this.breakpoints = null;

        return this;
    };

    /**
     * Enables the utility
     * Performs any event binding to handlers
     * Exits early if it is already enabled
     *
     * @method enable
     * @public
     * @chainable
     */
    proto.enable =function() {
        if (this.utilityIsEnabled) {
            return this;
        }

        this.$window.on(EVENTS.RESIZE, this.onResizeHandler);

        this.utilityIsEnabled = true;

        return this;
    };

    /**
     * Disables the utility
     * Tears down any event binding to handlers
     * Exits early if it is already disabled
     *
     * @method disable
     * @public
     * @chainable
     */
    proto.disable = function() {
        if (!this.utilityIsEnabled) {
            return this;
        }

        this.$window.off(EVENTS.RESIZE, this.onResizeHandler);

        this.utilityIsEnabled = false;

        return this;
    };

    /**
     * Destroys the utility
     * Tears down any events, handlers, elements
     * Should be called when the utility should be left unused
     *
     * @method destroy
     * @public
     * @chainable
     */
    proto.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };

    /**
     * Gets the current breakpoint and stores a reference to it
     *
     * @method getCurrentBreakpoint
     * @public
     * @chainable
     */
    proto.getCurrentBreakpoint =function() {
        var breakpoint;

        for (breakpoint in this.breakpoints) {
            if (this.breakpoints.hasOwnProperty(breakpoint)
                && matchMedia(this.breakpoints[breakpoint]).matches) {
                this.currentBreakpoint = breakpoint;
            }
        }

        // TODO: remove this statement in production code.
        // Logs the current breakpoint to the console for testing and debugging
        console.log(this.currentBreakpoint);

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Preforms the function when the window is resized
     * @method onResize
     * @public
     * @param {Object} event The event object returned by the resize
     */
    proto.onResize =function(event) {
        this.getCurrentBreakpoint();
    };

    return BreakpointListener;
});