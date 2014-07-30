//Using the @namespace tag with an object

/**
 * My namespace.
 * @namespace
 */
var MyNamespaceA = {
    /** documented as MyNamespaceA.foo */
    foo: function() {},
    /** documented as MyNamespaceA.bar */
    bar: 1
};




//Using the @namespace tag for virtual comments
/**
 * A namespace.
 * @namespace MyNamespaceB
 */

/**
 * A function in MyNamespaceB (MyNamespaceB.myFunction).
 * @function myFunction
 * @memberof MyNamespaceB
 */





//Using the @namespace tag with unusual member names
/** @namespace window */

/**
 * Shorthand for the alert function.
 * Refer to it as {@link window."!"} (note the double quotes).
 */
window["!"] = function(msg) {
    alert(msg);
};