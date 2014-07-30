//Using @static in a virtual comment
/** @namespace MyNamespaceStatic */

/**
 * @function myFunction
 * @memberof MyNamespaceStatic
 * @static
 */



//Using @static to override the default scope


/** @module Rollerskate */

/**
 * The 'wheel' variable is documented as Rollerskate.wheel
 * rather than Rollerskate~wheel.
 * @static
 */
var wheel = 1;