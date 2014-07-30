//Using @inner to make a virtual doclet an inner member
/** @namespace MyNamespace */
/**
 * myFunctionC is now MyNamespace~myFunctionC.
 * @function myFunctionC
 * @memberof MyNamespace
 * @inner
 */

//Using @inner
/** @namespace */
var MyNamespace = {
    /**
     * foo is now MyNamespace~foo rather than MyNamespace.foo.
     * @inner
     */
    foo: 1
};
