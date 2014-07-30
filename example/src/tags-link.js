//Linking modules, externals and events.

/**
 * A module. Refer to it using {@link module:foo/bar}.
 * @module foo/bar
 */

/**
 * The built in string object. Refer to it with {@link external:String}.
 * @external String
 */

/**
 * An event. Refer to with {@link module:foo/bar.event:MyEvent}.
 * @event module:foo/bar.event:MyEvent
 */



//Using @link

/** See {@link MyClassLink} and [MyClassLink's foo property]{@link MyClassLink#foo}.
 * Also check out {@link http://www.google.com|Google} and {@link http://github.com GitHub}.
 */
function myFunctionE() {}

/**
 * A class.
 * @class
 */
function MyClassLink() {
    /** foo property */
    this.foo = 1;
}



//Linking to unusually-named objects.

/** @namespace */
var chat = {
    /**
     * Refer to this by {@link chat."#channel"}.
     * @namespace
     */
    "#channel": {
        /**
         * Refer to this by {@link chat."#channel".open}.
         * @type {boolean}
         * @default
         */
        open: true,
        /**
         * Internal quotes have to be escaped by backslash. This is
         * {@link chat."#channel"."say-\"hello\""}.
         */
        'say-"hello"': function(msg) {}
    }
};

/**
 * Now we define an event in our {@link chat.#channel} namespace.
 * @event chat."#channel"."op:announce-motd"
 */




//Example with @linkplain and @linkcode

/**
 * This is a variable {@link FOO}, cleverLinks makes this monospace.
 * This is a link to external site {@link http://www.github.com|GitHub}, not monospace as it's external.
 * This is a link to {@linkplain FOO}, but we forced it not to be monospace.
 * This is a link to {@linkcode http://www.github.com GitHub}, but we forced it to be monospace.
 * @const
 */
var FOO = 1;