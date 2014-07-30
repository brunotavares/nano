//Using @kind
// The following examples produce the same result:

/**
 * A constant.
 * @kind constant
 */
const asdf = 1;

/**
 * A constant.
 * @constant
 */
const asdf2 = 1;

 //Conflicting @kind statements

/**
 * This will show up as a constant
 * @module myModuleF
 * @kind constant
 */

/**
 * This will show up as a module.
 * @kind constant
 * @module myModuleG
 */
