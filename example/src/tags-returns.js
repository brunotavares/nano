//Type of the return value

/**
 * Returns the sum of a and b
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function sum2(a, b) {
    return a + b;
}
 //Type and description of the return value
/**
 * Returns the sum of a and b
 * @param {Number} a
 * @param {Number} b
 * @returns {Number} Sum of a and b
 */
function sum3(a, b) {
    return a + b;
}
 //The return value can have different types
/**
 * Returns the sum of a and b
 * @param {Number} a
 * @param {Number} b
 * @param {Boolean} retArr If set to true, the function will return an array
 * @returns {Number|Array} Sum of a and b or an array that contains a, b and the sum of a and b.
 */
function sum4(a, b, retArr) {
    if (retArr) {
        return [a, b, a + b];
    }
    return a + b;
}
