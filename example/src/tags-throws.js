//Using the @throws tag with a type

/**
 * @throws {InvalidArgumentException}
 */
function fooThrows(x) {}



 //Using the @throws tag with a description

/**
 * @throws Will throw an error if the argument is null.
 */
function barThrows(x) {}



//Using the @throws tag with a type and description

/**
 * @throws {DivideByZero} Argument x must be non-zero.
 */
function bazThrows(x) {}
