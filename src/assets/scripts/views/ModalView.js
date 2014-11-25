define(function(require, exports, module) { // jshint ignore:line
    'use strict';

    require('modernizr');
    var $ = require('jquery');
    var modernizr = window.Modernizr;

    /**
     * An object of class names used in this view
     * @default null
     * @property CLASSES
     * @type {Object}
     * @final
     */
    var CLASSES = {
        SNEEZEGUARD: 'sneezeguard',
        IS_ACTIVE: 'isActive',
        IS_TRANSITIONING: 'isTransitioning',
        IS_VISUALLY_HIDDEN: 'isVisuallyHidden',
        IS_BEING_MEASURED: 'isBeingMeasured',
        HAS_MODAL: 'hasModal'
    };

    /**
     * An object of events used in this view
     * @default null
     * @property EVENTS
     * @type {Object}
     * @final
     */
    var EVENTS = {
        CLICK: 'click',
        KEY_UP: 'keyup',
        TRANSITION_END: 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'
    };

    /**
     * An object of the selectors used in this view
     * @default null
     * @property SELECTORS
     * @type {Object}
     * @final
     */
    var SELECTORS = {
        MODAL_TRIGGER_CLASS: '.js-modal-trigger',
        MODAL_TARGET_NAME: 'data-modal-target',
        MODAL_TARGET_CLASS: '.js-modal-target',
        MODAL_CONTENT_CLASS: '.js-modal-wrapper',
        MODAL_CLOSE_CLASS: '.js-modal-close'
    };

    /**
     * An array of key codes used in this view
     * @default null
     * @property KEYS
     * @type {Object}
     * @final
     */
    var KEYS = [
        27 // escape key
    ];

    //////////////////////////////////////////////////////////////////////////////////
    // HELPERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Utility method for getting positioning offsets
     * @method _getOffset
     * @private
     * @param {Integer} number
     * @return {Integer}
     */
    var _getOffset = function(number) {
        return Math.round(number / 2) * -1;
    };

    /**
     * Get the target modal
     * @method _getModalTarget
     * @private
     * @param {Object} event
     * @return {Object} $modalTarget A jQuery object of the intended modal target
     */
    var _getModalTarget = function(event) {
        return $('#' + $(event.currentTarget).attr(SELECTORS.MODAL_TARGET_NAME));
    };

    /**
     * Measures the content of the modal
     * @method _getMeasurements
     * @private
     * @param {jQuery} $modalContent A jQuery object of the target modal content
     * @return {Object} measurements
     */
    var _getMeasurements = function($modalContent) {
        var measurements = {};
        var $window = $(window);

        $modalContent.addClass(CLASSES.IS_BEING_MEASURED);

        measurements.modalWidth = $modalContent.outerWidth();
        measurements.modalHeight = $modalContent.outerHeight();
        measurements.windowWidth = $window.width();
        measurements.windowHeight = $window.height();

        $modalContent.removeClass(CLASSES.IS_BEING_MEASURED);

        return measurements;
    };

    /**
     * Positions the modal in the viewport
     * @method _setPosition
     * @private
     * @param {jQuery} $modalContent A jQuery object of the target modal content
     * @param {Object} measurements An object of dimensions
     * @param {bool} autoPosition
     */
    var _setPosition = function($modalContent, measurements, autoPosition) {
        if (measurements.modalWidth > measurements.windowWidth) {
            $modalContent.css({
                width: measurements.windowWidth,
                marginLeft: _getOffset(measurements.windowWidth) + 'px'
            });
            // Reset modal height because the width just changed
            measurements.modalHeight = $modalContent.outerHeight();
        } else {
            $modalContent.css({
                marginLeft: _getOffset(measurements.modalWidth) + 'px'
            });
        }

        if (autoPosition && measurements.modalHeight < measurements.windowHeight) {
            $modalContent.css({
                top: '50%',
                marginTop: _getOffset(measurements.modalHeight) + 'px'
            });
        }
    };

    //////////////////////////////////////////////////////////////////////////////////
    // CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////////////

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
         * A reference to the document
         *
         * @default null
         * @property $document
         * @type {jQuery}
         * @public
         */
        this.$document = null;

        /**
         * A reference to the clicked modal trigger
         *
         * @default null
         * @property $returnFocus
         * @type {jQuery}
         * @public
         */
        this.$returnFocus = null;

        /**
         * A reference to the modal
         *
         * @default null
         * @property $modal
         * @type {jQuery}
         * @public
         */
        this.$modal = null;

        /**
         * A reference to the modal trigger
         *
         * @default null
         * @property $trigger
         * @type {jQuery}
         * @public
         */
        this.$trigger = null;

        /**
         * A reference to the modal content
         *
         * @default null
         * @property $modalContent
         * @type {jQuery}
         * @public
         */
        this.$modalContent = null;

        /**
         * A reference to the modal close trigger
         *
         * @default null
         * @property $modalClose
         * @type {jQuery}
         * @public
         */
        this.$modalClose = null;

        /**
         * A reference to the sneezeguard
         *
         * @default null
         * @property $sneezeguard
         * @type {jQuery}
         * @public
         */
        this.$sneezeguard = null;

        /**
         * Default configuration settings
         * Merged with local settings at instantiation
         * @property settings
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
         * @property viewIsEnabled
         * @type {bool}
         * @public
         */
        this.viewIsEnabled = false;

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

    // Store a reference to the prototype
    var proto = ModalView.prototype;

    /**
     * Initializes the UI Component View
     * Runs a single setupHandlers call, followed by createChildren, layout and enable
     *
     * @method init
     * @public
     * @chainable
     */
    proto.init = function() {
        this.setupHandlers()
            .createChildren()
            .layout()
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
        this.onTriggerClickHandler = this.onTriggerClick.bind(this);
        this.onCloseClickHandler = this.onCloseClick.bind(this);
        this.onKeyUpHandler = this.onKeyUp.bind(this);
        this.onDocumentClickHandler = this.onDocumentClick.bind(this);
        this.onTransitionEndHandler = this.onTransitionEnd.bind(this);

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
        this.$html = $('html');
        this.$document = $(document);
        this.$modal = $(SELECTORS.MODAL_TARGET_CLASS);
        this.$trigger = $(SELECTORS.MODAL_TRIGGER_CLASS);
        this.$modalContent = this.$element.find(SELECTORS.MODAL_CONTENT_CLASS);
        this.$modalClose = this.$element.find(SELECTORS.MODAL_CLOSE_CLASS);
        this.$sneezeguard = $('<div />').addClass(CLASSES.SNEEZEGUARD).appendTo($('body'));

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
        this.$document = null;
        this.$modal = null;
        this.$trigger = null;
        this.$modalContent = null;
        this.$modalClose = null;
        this.$sneezeguard = null;
        this.$returnFocus = null;

        return this;
    };

    /**
     * Applies specific layout for this view in order to prepare it in the DOM
     *
     * @method layout
     * @public
     * @chainable
     */
    proto.layout = function() {
        this.$modal.show().addClass(CLASSES.IS_VISUALLY_HIDDEN);

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
        if (this.viewIsEnabled) {
            return this;
        }

        this.$trigger.on(EVENTS.CLICK, this.onTriggerClickHandler);
        this.$modalClose.on(EVENTS.CLICK, this.onCloseClickHandler);
        this.$document.on(EVENTS.CLICK, this.onDocumentClickHandler);
        this.$document.on(EVENTS.KEY_UP, this.onKeyUpHandler);
        this.$modal.on(EVENTS.TRANSITION_END, this.onTransitionEndHandler);

        this.viewIsEnabled = true;

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
        if (!this.viewIsEnabled) {
            return this;
        }

        this.$trigger.off(EVENTS.CLICK, this.onTriggerClickHandler);
        this.$modalClose.off(EVENTS.CLICK, this.onCloseClickHandler);
        this.$document.off(EVENTS.CLICK, this.onDocumentClickHandler);
        this.$document.off(EVENTS.KEY_UP, this.onKeyUpHandler);
        this.$modal.off(EVENTS.TRANSITION_END, this.onTransitionEndHandler);

        this.viewIsEnabled = false;

        return this;
    };

    /**
     * Destroys the component
     * Tears down any events, handlers, elements
     * Should be called when the object should be left unused
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
     * Show the modal
     * Triggers auto positioning if applicable
     * @method showModal
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the target modal
     */
    proto.showModal = function($modalTarget) {
        var $modalContent = $modalTarget.find(SELECTORS.MODAL_CONTENT_CLASS);
        var measurements = _getMeasurements($modalContent);

        this.modalIsActive = true;
        this.$sneezeguard.show();
        _setPosition($modalContent, measurements, this.options.autoPosition);
        this.toggleModal($modalTarget);
    };

    /**
     * Hide the modal
     * @method hideModal
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the target modal
     */
    proto.hideModal = function($modalTarget) {
        this.modalIsActive = false;
        this.toggleModal($modalTarget);
    };

    /**
     * Toggles the modal's visibility using feature detection
     * @method toggleModal
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the modal
     * @chainable
     */
    proto.toggleModal = function($modalTarget) {
        if (this.modalIsActive) {
            this.$html.addClass(CLASSES.HAS_MODAL);
            $modalTarget.removeClass(CLASSES.IS_VISUALLY_HIDDEN);
        }

        if (modernizr.csstransitions) {
            this.transitionWithCSS($modalTarget);
        } else {
            this.animateWithJQuery($modalTarget);
        }

        return this;
    };

    /**
     * Transitions the modal's visibility using CSS
     * @method transitionWithCSS
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the modal
     * @chainable
     */
    proto.transitionWithCSS = function($modalTarget) {
        this.$sneezeguard.toggleClass(CLASSES.IS_ACTIVE);
        $modalTarget.toggleClass(CLASSES.IS_ACTIVE);

        return this;
    };

    /**
     * Animates the modal's visibility using jQuery
     * This is the fallback if CSS Transitions are not supported
     * @method animateWithJQuery
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the modal
     * @chainable
     */
    proto.animateWithJQuery = function($modalTarget) {
        var self = this;
        var opacity = this.modalIsActive ? 1 : 0;

        $modalTarget
            .animate({
                opacity: opacity
            },
            this.options.duration,
            this.options.timing,
            function() {
                $modalTarget
                    .toggleClass(CLASSES.IS_ACTIVE);
                self.onComplete($modalTarget);
            });

        this.$sneezeguard
            .animate({
                opacity: opacity
            },
            this.options.duration,
            this.options.timing,
            function() {
                self.$sneezeguard
                    .toggleClass(CLASSES.IS_ACTIVE);
            });

        return this;
    };

    /**
     * Runs tasks on completion of animation
     * @method onComplete
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the modal
     * @chainable
     */
    proto.onComplete = function($modalTarget) {
        if (this.modalIsActive) {
            this.$modalClose.focus();
            $modalTarget.attr('aria-live', 'polite');
        } else {
            this.$sneezeguard.removeAttr('style');
            this.$html.removeClass(CLASSES.HAS_MODAL);
            $modalTarget
                .attr('aria-live', 'off')
                .addClass(CLASSES.IS_VISUALLY_HIDDEN)
                .find(SELECTORS.MODAL_CONTENT_CLASS)
                .removeAttr('style');

            if (this.$returnFocus != null) {
                this.$returnFocus.focus();
                this.$returnFocus = null;
            }
        }

        return this;
    };

    /**
     * Hide any modals that may be showing in the DOM
     * @method cleanUp
     * @public
     * @chainable
     */
    proto.cleanUp = function() {
        var self = this;
        var $modalTarget = $(SELECTORS.MODAL_TARGET_CLASS);

        $.each(
            $modalTarget,
            function() {
                self.hideModal($(this));
            }
        );

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Click handler shows modal
     * @method onTriggerClick
     * @public
     * @param {Object} event The event object returned by the click
     */
    proto.onTriggerClick = function(event) {
        var $modalTarget = _getModalTarget(event);
        var $trigger = $(event.currentTarget);

        if (!$modalTarget.length) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        // Set a reference to the activating trigger in order to return focus to it on close
        if (this.$returnFocus == null) {
            this.$returnFocus = $trigger;
        }

        // Remove focus in order to prevent accidental multiple key press events
        // i.e. hitting the 'return' key twice in quick succession
        $trigger.blur();
        this.showModal($modalTarget);
    };

    /**
     * Click handler closes modal
     * @method onCloseClick
     * @public
     * @param {Object} event The event object returned by the click
     */
    proto.onCloseClick = function(event) {
        var $modalTarget = _getModalTarget(event);
        var $trigger = $(event.currentTarget);

        if (!$modalTarget.length) {
            return;
        }

        event.preventDefault();

        // Remove focus in order to prevent accidental multiple key press events
        // i.e. hitting the 'return' key twice in quick succession
        $trigger.blur();
        this.hideModal($modalTarget);
    };

    /**
     * Handles keyup events
     * @method onKeyUp
     * @public
     * @param {Object} event The event object returned by the keyup
     */
    proto.onKeyUp = function(event) {
        var pressedKey = $.inArray(event.keyCode, KEYS);

        if (pressedKey >= 0 && this.modalIsActive) {
            this.cleanUp();
        }
    };

    /**
     * Closes modal when the document is clicked outside the modal
     * @method onDocumentClick
     * @public
     * @param {Object} event The event object returned by the click
     */
    proto.onDocumentClick = function(event) {
        if (!this.modalIsActive) {
            return;
        }

        if(!$(event.target).closest(this.$modalContent).length) {
            this.cleanUp();
        }
    };

    /**
     * Runs onComplete functions on transition end
     * @method onTransitionEnd
     * @public
     * @param {Object} event The event object returned by the click
     */
    proto.onTransitionEnd = function(event) {
        this.onComplete($(event.currentTarget));
    };

    return ModalView;

});