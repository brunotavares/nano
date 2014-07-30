//Documenting methods added to built-in classes.
/**
 * The built in string object.
 * @external String
 * @see {@link https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String String}
 */

/**
 * Adds a new method to the built-in string.
 * @function external:String#rot13
 * @example
 * var greeting = new String('hello world');
 * console.log( greeting.rot13() ); // uryyb jbeyq
 */

 //Documenting external namespaces.

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
 */

/**
 * A jQuery plugin to make stars fly around your home page.
 * @function external:"jQuery.fn".starfairy
 */

 //Extending an external.

/**
 * Namespace provided by the browser.
 * @external XMLHttpRequest
 * @see https://developer.mozilla.org/en/xmlhttprequest
 */

/**
 * Extends the built in XMLHttpRequest to send data encoded with a secret key.
 * @class EncryptedRequest
 * @extends external:XMLHttpRequest
 */
