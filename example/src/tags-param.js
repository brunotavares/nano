//Name only
/**
 * @param somebody
 */
function sayHelloA(somebody) {
    alert('Hello ' + somebody);
}
 //Name and type
/**
 * @param {string} somebody
 */
function sayHelloB(somebody) {
    alert('Hello ' + somebody);
}
 //Name, type, and description
/**
 * @param {string} somebody Somebody's name.
 */
function sayHelloC(somebody) {
    alert('Hello ' + somebody);
}
 //Name, type, and description, with a hyphen before the description
/**
 * @param {string} somebody - Somebody's name.
 */
function sayHelloD(somebody) {
    alert('Hello ' + somebody);
}
 //An optional parameter (using JSDoc syntax)
/**
 * @param {string} [somebody] - Somebody's name.
 */
function sayHelloE(somebody) {
    if (!somebody) {
        somebody = 'John Doe';
    }
    alert('Hello ' + somebody);
}
 //An optional parameter (using Google Closure Compiler syntax)
/**
 * @param {string=} somebody - Somebody's name.
 */
function sayHelloF(somebody) {
    if (!somebody) {
        somebody = 'John Doe';
    }
    alert('Hello ' + somebody);
}
 //An optional parameter and default value
/**
 * @param {string} [somebody=John Doe] - Somebody's name.
 */
function sayHelloG(somebody) {
    if (!somebody) {
        somebody = 'John Doe';
    }
    alert('Hello ' + somebody);
}
 //Allows one type OR another type (type union)
/**
 * @param {(string|string[])} [somebody=John Doe] - Somebody's name, or an array of names.
 */
function sayHelloH(somebody) {
    if (!somebody) {
        somebody = 'John Doe';
    } else if (Array.isArray(somebody)) {
        somebody = somebody.join(', ');
    }
    alert('Hello ' + somebody);
}
 //Allows any type
/**
 * @param {*} somebody - Whatever you want.
 */
function sayHelloI(somebody) {
    console.log('Hello ' + JSON.stringify(somebody));
}
 //Allows a parameter to be repeated
/**
 * Returns the sum of all numbers passed to the function.
 * @param {...number} num - A positive or negative number.
 */
function sum(num) {
    var i = 0,
        n = arguments.length,
        t = 0;
    for (; i < n; i++) {
        t += arguments[i];
    }
    return t;
}
 //Parameters that accept a callback
/**
 * This callback type is called `requestCallback3` and is displayed as a global symbol.
 *
 * @callback requestCallback3
 * @param {number} responseCode
 * @param {string} responseMessage
 */

/**
 * Does something asynchronously and executes the callback on completion.
 * @param {requestCallback3} cb - The callback that handles the response.
 */
function doSomethingAsynchronously(cb) {
    // code
};
