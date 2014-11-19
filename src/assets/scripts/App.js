define(function(require, exports, module) { // jshint ignore:line
    'use strict';
    
    var Modernizr = require('modernizr');
    var HasJs = require('nerdery-has-js');

    /**
     * Initial application setup. Runs once upon every page load.
     *
     * @class App
     * @constructor
     */
    var App = function() {
        HasJs.init();
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
        // Create your views here
    };

    return App;

});