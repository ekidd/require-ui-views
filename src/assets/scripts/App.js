define(function(require, exports, module) { // jshint ignore:line
    'use strict';

    require('modernizr');
    var $ = require('jquery');
    var HasJs = require('nerdery-has-js');

    var ModalView = require('./views/ModalView');

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
        // Modal View
        // Optional: pass in an object of config options as a second argument
        // i.e. { duration: 1000, autoPosition: false }
        this.modalView = new ModalView($('#myModal'));
    };

    return App;

});