//Using @instance to make a virtual doclet an instance member

/** @namespace MyNamespaceInstance */
/**
 * myFunctionD is now MyNamespaceInstance#myFunctionD.
 * @function myFunctionD
 * @memberof MyNamespaceInstance
 * @instance
 */

 //Using @instance to identify an instance member

/** @namespace */
var BaseObject = {
    /**
     * foo is now BaseObject#foo rather than BaseObject.foo.
     * @instance
     */
    foo: null
};

/** Generates BaseObject instances. */
function fooFactory(fooValue) {
    var props = {
        foo: fooValue
    };
    return Object.create(BaseObject, props);
}
