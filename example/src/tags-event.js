//Documenting a function call as an event
/**
 * Throw a snowball.
 *
 * @fires Hurl#snowball
 */
Hurl.prototype.snowball = function() {
    /**
     * Snowball event.
     *
     * @event Hurl#snowball
     * @type {object}
     * @property {boolean} isPacked - Indicates whether the snowball is tightly packed.
     */
    this.emit('snowball', {
        isPacked: this._snowball.isPacked
    });
};
 //Using a named doclet to document an event
/**
 * Throw a snowball.
 *
 * @fires Hurl#snowball
 */
Hurl.prototype.snowball = function() {
    // ...
};

/**
 * Snowball event.
 *
 * @event Hurl#snowball
 * @type {object}
 * @property {boolean} isPacked - Indicates whether the snowball is tightly packed.
 */

//Documenting events in AMD modules
define('playground/monitor', [], function() {
    /**
     * Keeps an eye out for snowball-throwers.
     *
     * @module playground/monitor
     */
    var exports = {
        /**
         * Report the throwing of a snowball.
         *
         * @method
         * @param {module:hurler#event:snowball} e - A snowball event.
         * @listens module:hurler#snowball
         */
        reportThrowage: function(e) {
            this.log('snowball thrown: velocity ' + e.velocity);
        }
    };

    return exports;
});

define('hurler', [], function() {
    /**
     * Event reporting that a snowball has been hurled.
     *
     * @event module:hurler#snowball
     * @property {number} velocity - The snowball's velocity, in meters per second.
     */

    /**
     * Snowball-hurling module.
     *
     * @module hurler
     */
    var exports = {
        /**
         * Attack an innocent (or guilty) person with a snowball.
         *
         * @method
         * @fires module:hurler#snowball
         */
        attack: function() {
            this.emit('snowball', {
                velocity: 10
            });
        }
    };

    return exports;
});
