define(function(require, exports, module) { // jshint ignore:line
    'use strict';

    var $ = require('jquery');

    /**
     * An object of strings used by this view
     * @default null
     * @property STRINGS
     * @type {Object}
     * @final
     */
    var STRINGS = {
        TRIGGER: 'data-modal-trigger',
        TARGET: 'data-modal-target',
        SNEEZEGUARD: 'sneezeguard',
        IS_ACTIVE: 'isActive',
        HAS_MODAL: 'hasModal'
    };

    /**
     * An object of the selectors used by this view
     * @default null
     * @property SELECTORS
     * @type {Object}
     * @final
     */
    var SELECTORS = {
        TARGET: '[' + STRINGS.TRIGGER + ']',
        TRIGGER: '[' + STRINGS.TARGET + ']',
        MODAL_TARGET: '.js-modal-target',
        MODAL_CONTENT: '.js-modal-wrapper',
        MODAL_CLOSE: '.js-modal-close'
    };

    /**
     * Utility method for getting positioning offsets
     * @method _getOffset
     * @private
     * @param {Integer} number
     * @return {Integer} offset
     */
    var _getOffset = function(number) {
        var offset = Math.round(number / 2) * -1;

        return offset;
    };

    /**
     * Skeleton modal view.
     *
     * @class ModalView
     * @param {jQuery} $element A reference to the containing DOM element
     * @param {Object} [options] Pass in an override to default options
     * @param {Integer} [options.duration] User-defined duration value for the modal show/hide transition
     * @param {String} [options.timing] User-defined CSS transition timing function for the modal show/hide transition
     * @param {Boolean} [options.autoPosition] Whether or not to auto position the modal when the
     * content height does not exceed the window height
     * @constructor
     */

    var ModalView = function($element, options) {
        /**
         * A reference to the containing DOM element
         *
         * @default null
         * @property $element
         * @type {jQuery}
         * @public
         */
        this.$element = $element;

        /**
         * A reference to the html element
         *
         * @default null
         * @property $html
         * @type {jQuery}
         * @public
         */
        this.$html = null;

        /**
         * A reference to the body element
         *
         * @default null
         * @property $body
         * @type {jQuery}
         * @public
         */
        this.$body = null;

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
         * A reference to the document
         *
         * @default null
         * @property $window
         * @type {jQuery}
         * @public
         */
        this.$document = null;

        /**
         * Default configuration settings
         * Merged with local settings at instantiation
         * @property config
         * @type {Object}
         */
        this.settings = {
            duration: 400,
            timing: 'linear',
            autoPosition: true
        };

        // Merge options passed in with default settings object
        this.options = $.extend({}, this.settings, options);

        /**
         * Tracks whether component is enabled
         *
         * @default false
         * @property isEnabled
         * @type {bool}
         * @public
         */
        this.isEnabled = false;

        /**
         * Tracks whether modal is present
         *
         * @default false
         * @property modalIsActive
         * @type {bool}
         * @public
         */
        this.modalIsActive = false;

        // If no modal is found, return early
        if (!$element.length) {
            return;
        }

        this.init();

    };

    var proto = ModalView.prototype;

    /**
     * Initializes the UI Component View
     * Runs a single setupHandlers call, followed by createChildren and enable
     *
     * @method init
     * @private
     * @chainable
     */
    proto.init = function() {
        this.setupHandlers()
            .createChildren()
            .enable();

        return this;
    };

    /**
     * Binds the scope of any handler functions
     * Should only be run on initialization of the view
     *
     * @method setupHandlers
     * @private
     * @chainable
     */
    proto.setupHandlers = function() {
        this.onTriggerClickHandler = this.onTriggerClick.bind(this);
        this.onKeyUpHandler = this.onKeyUp.bind(this);
        this.onDocumentClickHandler = this.onDocumentClick.bind(this);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements
     * Should only be run on initialization of the view
     *
     * @method createChildren
     * @private
     * @chainable
     */

    proto.createChildren = function() {
        this.$html = $('html');
        this.$body = $('body');
        this.$window = $(window);
        this.$document = $(document);
        this.$target = this.$element.find(SELECTORS.TARGET);
        this.$modal = $(SELECTORS.MODAL_TARGET);
        this.$trigger = $(SELECTORS.TRIGGER);
        this.$content = this.$element.find(SELECTORS.MODAL_CONTENT);
        this.$close = this.$element.find(SELECTORS.MODAL_CLOSE);
        this.$sneezeguard = $('<div />', {
                class: STRINGS.SNEEZEGUARD
            })
            .prependTo(this.$body);

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
        this.$html = null;
        this.$body = null;
        this.$window = null;
        this.$document = null;
        this.$target = null;
        this.$modal = null;
        this.$trigger = null;
        this.$content = null;
        this.$close = null;
        this.$sneezeguard = null;

        return this;
    };

    /**
     * Enables the component
     * Performs any event binding to handlers
     * Exits early if it is already enabled
     *
     * @method enable
     * @public
     * @chainable
     */
    proto.enable = function() {
        if (this.isEnabled) {
            return this;
        }

        this.$trigger.on('click', this.onTriggerClickHandler);
        this.$document.on('click', this.onDocumentClickHandler);
        this.$document.on('keyup', this.onKeyUpHandler);

        this.isEnabled = true;

        return this;

    };

    /**
     * Disables the component
     * Tears down any event binding to handlers
     * Exits early if it is already disabled
     *
     * @method disable
     * @public
     * @chainable
     */
    proto.disable = function() {
        if (!this.isEnabled) {
            return this;
        }

        this.$trigger.off('click', this.onTriggerClickHandler);
        this.$document.off('click', this.onDocumentClickHandler);
        this.$document.off('keyup', this.onKeyUpHandler);

        this.isEnabled = false;

        return this;

    };

    /**
     * Destroys the component
     * Tears down any events, handlers, elements
     * Should be called when the object should be left unused
     *
     * @method destroy
     * @chainable
     * @public
     */
    proto.destroy = function() {
        this.disable()
            .removeChildren();

        return this;

    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Click handler toggles modal visibility
     * @method onTriggerClick
     * @public
     * @param {Object} e The event object returned by the click
     */
    proto.onTriggerClick = function(e) {
        var name = $(e.currentTarget).attr(STRINGS.TARGET);
        var $modalTarget = $('[' + STRINGS.TRIGGER + '=' + name + ']');
        e.preventDefault();

        this._toggle($modalTarget);
    };

    /**
     * Handles keyup events
     * @method onKeyUp
     * @public
     * @param {Object} e The event object returned by the keyup
     */
    proto.onKeyUp = function(e) {
        var code = e.keyCode;

        // keyCode 27 = escape key
        if (code === 27 && this.modalIsActive) {
            this._clean();
        }
    };

    /**
     * Closes modal when the document is clicked outside the modal
     * @method onDocumentClick
     * @public
     * @param {Object} e The event object returned by the click
     */
    proto.onDocumentClick = function(e) {
        var hitArea = this.$element.find(SELECTORS.MODAL_CONTENT);
        var eTarget = $(e.target);

        // If the modal is active, return early
        if (!this.modalIsActive) {
            return;
        }

        if(!eTarget.closest(hitArea).length) {
            this._clean();
        }

    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Toggles the modal visibility
     * @method _toggle
     * @private
     * @param {jQuery} $modalTarget A jQuery object of the modal
     */
    proto._toggle = function($modalTarget) {
        if ($modalTarget.hasClass(STRINGS.IS_ACTIVE)) {
            this._hide($modalTarget);
            this._toggleSneezeguard(false);
            this._setupContext(false);
        } else {
            this._show($modalTarget);
            this._toggleSneezeguard(true);
            this._setupContext(true);
            this.$close.focus(); // Set focus to the close element
        }
    };

    /**
     * Shows the modal
     * Triggers auto positioning if applicable
     * @method _show
     * @private
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     */
    proto._show = function($modalTarget) {
        var self = this;

        $modalTarget.css({
            display: 'block',
            opacity: 0
        });

        if (this.$content.height() < this.$window.height() && this.options.autoPosition) {
            this._autoPosition($modalTarget);
        }

        $modalTarget
            .animate({
                opacity: 1
            },
            this.options.duration,
            function() {
                $modalTarget.addClass(STRINGS.IS_ACTIVE);
                self._onComplete($modalTarget);
            });
    };

    /**
     * Hides the modal
     * @method _hide
     * @private
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     */
    proto._hide = function($modalTarget) {
        var self = this;

        $modalTarget
            .animate({
                opacity: 0
            },
            this.options.duration,
            function() {
                $modalTarget.removeClass(STRINGS.IS_ACTIVE);
                self._onComplete($modalTarget);
            });
    };

    /**
     * DOM and state updates after the modal is shown or hidden
     * @method _onComplete
     * @private
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     */
    proto._onComplete = function($modalTarget) {
        if ($modalTarget.hasClass(STRINGS.IS_ACTIVE)) {
            this.modalIsActive = true;
        } else {
            this.modalIsActive = false;
            $modalTarget.hide();
            this.$sneezeguard.hide();
        }
    };

    /**
     * Centers the modal in the viewport
     * @method _autoPosition
     * @private
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     */
    proto._autoPosition = function($modalTarget) {
        var measurement = this._measure($modalTarget);

        this.$content.css({
            position: 'absolute',
            top: '50%',
            marginLeft: measurement.y + 'px',
            marginTop: measurement.x  + 'px'
        });

    };

    /**
     * Helper function that returns measurements
     * @method _measure
     * @private
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     * @return {measurement} An object of dimensions and position offsets
     */
    proto._measure = function($modalTarget) {
        var measurement = {};
        measurement.w = this.$content.innerWidth();
        measurement.h = this.$content.innerHeight();
        measurement.x = _getOffset(measurement.h);
        measurement.y = _getOffset(measurement.w);

        return measurement;
    };

    /**
     * Handles showing and hiding the opaque modal overlay.
     * @method _toggleSneezeguard
     * @private
     * @param {bool} state True when the modal is showing, false when the modal is hiding
     */
    proto._toggleSneezeguard = function(state) {
        var self = this;

        if (!state) {
            this.$sneezeguard
                .animate({
                    opacity: 0
                },
                this.options.duration,
                function() {
                    self.$sneezeguard.removeClass(STRINGS.IS_ACTIVE);
                });
        } else {
            this.$sneezeguard.css({
                display: 'block',
                opacity: 0
            });
            this.$sneezeguard
                .animate({
                    opacity: 1
                },
                this.options.duration,
                function() {
                    self.$sneezeguard.addClass(STRINGS.IS_ACTIVE);
                });
        }
    };

    /**
     * Adds a class to the html element
     * This avoids double scrollbars when the modal is scrollable
     * @method _setupContext
     * @private
     * @param {bool} state True when the modal is showing, false when the modal is hiding
     */
    proto._setupContext = function(state) {
        if (!state) {
            this.$html.removeClass(STRINGS.HAS_MODAL);
        } else {
            this.$html.addClass(STRINGS.HAS_MODAL);
        }
    };

    /**
     * Hides any modals that may be showing in the DOM
     * @method _clean
     * @private
     */
    proto._clean = function() {
        var self = this;
        var $modalTarget = $(SELECTORS.MODAL_TARGET);

        $.each(
            $modalTarget,
            function() {
                self._hide($(this));
            }
        );
    };

    return ModalView;

});