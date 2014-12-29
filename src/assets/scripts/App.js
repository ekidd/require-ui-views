define(function(require, exports, module) { // jshint ignore:line
    'use strict';

    var $ = require('jquery');
    var ModalView = require('./views/ModalView');
    var BreakpointListener = require('./utils/BreakpointListener');

    /**
     * Initial application setup. Runs once upon every page load.
     *
     * @class App
     * @constructor
     */
    var App = function() {
        this.init();
    };

    var proto = App.prototype;

    /**
     * Initializes the application and kicks off loading of prerequisites.
     *
     * @method init
     * @private
     */
    proto.init = function() {
        // Breakpoint Listener
        this.breakpointListener = new BreakpointListener();

        // Modal View
        // Optional: pass in an object of config options as a second argument
        // i.e. { duration: 1000, timing: linear, autoPosition: false }
        this.modalView = new ModalView($('#myModal'));
    };

    return App;

});