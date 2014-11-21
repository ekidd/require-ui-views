define(function(require, exports, module) { // jshint ignore:line
    'use strict';

    // require('modernizr'); TODO: turn this on when adding feature detection
    var $ = require('jquery');
    // var modernizr = window.Modernizr; TODO: turn this on when adding feature detection

    /**
     * An object of strings used in this view
     * @default null
     * @property STRINGS
     * @type {Object}
     * @final
     */
    var STRINGS = {
        TARGET: 'data-modal-target',
        SNEEZEGUARD: 'sneezeguard',
        IS_ACTIVE: 'isActive',
        IS_VISUALLY_HIDDEN: 'isVisuallyHidden',
        HAS_MODAL: 'hasModal'
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
        MODAL_TARGET_CLASS: '.js-modal-target',
        MODAL_CONTENT_CLASS: '.js-modal-wrapper',
        MODAL_CLOSE_CLASS: '.js-modal-close'
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Utility method for getting positioning offsets
     * @method _getOffset
     * @private
     * @param {Integer} number
     * @return {Integer} offset
     */
    var _getOffset = function(number) {
        return Math.round(number / 2) * -1;
    };

    /**
     * Get the target modal
     * @method _getModalTarget
     * @private
     * @param {Object} e The event object
     * @return {Object} $modalTarget A jQuery object of the intended modal target
     */
    var _getModalTarget = function(e) {
        return $('#' + $(e.currentTarget).attr(STRINGS.TARGET));
    };

    /**
     * Centers the modal in the viewport
     * @method _setPosition
     * @private
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     */
    var _setPosition = function($modalTarget) {
        var $modalContent = $modalTarget.find(SELECTORS.MODAL_CONTENT_CLASS);

        $modalContent.css({
            marginLeft: _getOffset($modalContent.innerWidth()) + 'px',
            marginTop: _getOffset($modalContent.innerHeight())  + 'px'
        });
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
        this.onCloseClickHandler = this.onCloseClick.bind(this);
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
        this.$modal = $(SELECTORS.MODAL_TARGET_CLASS);
        this.$trigger = $(SELECTORS.MODAL_TRIGGER_CLASS);
        this.$modalContent = this.$element.find(SELECTORS.MODAL_CONTENT_CLASS);
        this.$modalClose = this.$element.find(SELECTORS.MODAL_CLOSE_CLASS);
        this.$sneezeguard = $('<div />', {
                class: STRINGS.SNEEZEGUARD
            })
            .appendTo(this.$body);

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
        this.$modal = null;
        this.$trigger = null;
        this.$modalContent = null;
        this.$modalClose = null;
        this.$sneezeguard = null;
        this.$returnFocus = null;

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

        this.$trigger.on('click', this.onTriggerClickHandler);
        this.$modalClose.on('click', this.onCloseClickHandler);
        this.$document.on('click', this.onDocumentClickHandler);
        this.$document.on('keyup', this.onKeyUpHandler);

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

        this.$trigger.off('click', this.onTriggerClickHandler);
        this.$modalClose.off('click', this.onCloseClickHandler);
        this.$document.off('click', this.onDocumentClickHandler);
        this.$document.off('keyup', this.onKeyUpHandler);

        this.viewIsEnabled = false;

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

    /**
     * Show the modal
     * Triggers auto positioning if applicable
     * @method showModal
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     */
    proto.showModal = function($modalTarget) {
        // TODO: Add a function to display the modal off screen, measure it, then move on
        // This should allow for width-agnostic modals to still be centered correctly
        // Also may want to move some of this to a layout function to provide better support for no-js
        $modalTarget.removeClass(STRINGS.IS_VISUALLY_HIDDEN);
        this.$html.addClass(STRINGS.HAS_MODAL);
        this.$sneezeguard.show();

        if (this.options.autoPosition && this.$modalContent.height() < this.$window.height()) {
            _setPosition($modalTarget);
        }

        this.toggleModal($modalTarget, true);

        // Set focus to the modal close element
        this.$modalClose.focus();
    };

    /**
     * Hides the modal
     * @method hideModal
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the targeted modal
     */
    proto.hideModal = function($modalTarget) {
        this.toggleModal($modalTarget, false);

        if (this.$returnFocus != null) {
            // Return focus to the element that triggered the modal
            this.$returnFocus.focus();
            this.$returnFocus = null;
        }
    };

    /**
     * Toggles the modal visibility
     * @method toggleModal
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the modal
     * @param {bool}
     */
    proto.toggleModal = function($modalTarget, isActive) {
        var self = this;
        var opacity = isActive ? 1 : 0;

        // TODO: add a check for csstransition support, and if true use jQuery as the fallback
        // if (!modernizr.csstransitions) {
            $modalTarget
                .animate({
                    opacity: opacity
                },
                this.options.duration,
                function() {
                    $modalTarget
                        .toggleClass(STRINGS.IS_ACTIVE)
                        .removeAttr('style');
                    self.onComplete($modalTarget, isActive);
                });

            this.$sneezeguard
                .animate({
                    opacity: opacity
                },
                this.options.duration,
                function() {
                    self.$sneezeguard
                        .toggleClass(STRINGS.IS_ACTIVE)
                        .removeAttr('style');
                });
        // }
    };

    /**
     * Runs tasks on completion of animation
     * @method onComplete
     * @public
     * @param {jQuery} $modalTarget A jQuery object of the modal
     * @param {bool}
     */
    proto.onComplete = function($modalTarget, isActive) {
        if (!isActive) {
            this.$html.removeClass(STRINGS.HAS_MODAL);
            $modalTarget.addClass(STRINGS.IS_VISUALLY_HIDDEN);
            // TODO: clear aria-live="polite"
        } else {
            // TODO: add aria-live="polite"
        }

        this.modalIsActive = isActive;
    };

    /**
     * Hide any modals that may be showing in the DOM
     * @method cleanUp
     * @public
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
    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Click handler shows modal
     * @method onTriggerClick
     * @public
     * @param {Object} e The event object returned by the click
     */
    proto.onTriggerClick = function(e) {
        var $modalTarget = _getModalTarget(e);

        // if the $modalTarget is not found, return early
        if (!$modalTarget.length) {
            return;
        }

        e.preventDefault();

        // Set a reference to the activating trigger
        if (this.$returnFocus == null) {
            this.$returnFocus = $(e.currentTarget);
        }

        this.showModal($modalTarget);
    };

    /**
     * Click handler closes modal
     * @method onCloseClick
     * @public
     * @param {Object} e The event object returned by the click
     */
    proto.onCloseClick = function(e) {
        var $modalTarget = _getModalTarget(e);

        // if the $modalTarget is not found, return early
        if (!$modalTarget.length) {
            return;
        }

        e.preventDefault();
        this.hideModal($modalTarget);
    };

    /**
     * Handles keyup events
     * @method onKeyUp
     * @public
     * @param {Object} e The event object returned by the keyup
     */
    proto.onKeyUp = function(e) {
        // keyCode 27 = escape key
        if (e.keyCode === 27 && this.modalIsActive) {
            this.cleanUp();
        }
    };

    /**
     * Closes modal when the document is clicked outside the modal
     * @method onDocumentClick
     * @public
     * @param {Object} e The event object returned by the click
     */
    proto.onDocumentClick = function(e) {
        // If the modal is not active, return early
        if (!this.modalIsActive) {
            return;
        }

        if(!$(e.target).closest(this.$modalContent).length) {
            this.cleanUp();
        }
    };

    return ModalView;

});