/**
 * Bar function.
 * @alias bar
 */
function fooAlias() {}


//Using @alias with an anonymous constructor function
Klass('trackr.CookieManager',

    /**
     * @class
     * @alias trackr.CookieManager
     * @param {Object} kv
     */
    function(kv) {
        /** The value. */
        this.value = kv;
    }

);


//Using @alias for static members of a namespace
/** @namespace */
var Apple = {};

(function(ns) {
    /**
     * @namespace
     * @alias Apple.Core
     */
    var core = {};

    /** Documented as Apple.Core.seed */
    core.seed = function() {};

    ns.Core = core;
})(Apple);


//Using @alias for an object literal
// Documenting objectA with @alias

var objectA = (function() {

    /**
     * Documented as objectA
     * @alias objectA
     * @namespace
     */
    var x = {
        /**
         * Documented as objectA.myProperty
         * @member
         */
        myProperty: 'foo'
    };

    return x;
})();

// Documenting objectB with @lends

/**
 * Documented as objectB
 * @namespace
 */
var objectB = (function() {

    /** @lends objectB */
    var x = {
        /**
         * Documented as objectB.myProperty
         * @member
         */
        myProperty: 'bar'
    };

    return x;
})();
