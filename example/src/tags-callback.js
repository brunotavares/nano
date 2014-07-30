//Documenting a class-specific callback
/**
 * @class
 */
function Requester() {}

/**
 * Send a request.
 * @param {Requester~requestCallback} cb - The callback that handles the response.
 */
Requester.prototype.send = function(cb) {
    // code
};

/**
 * This callback is displayed as part of the Requester class.
 * @callback Requester~requestCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */


//Documenting a global callback
/**
 * @class
 */
function Requester2() {}

/**
 * Send a request.
 * @param {requestCallback2} cb - The callback that handles the response.
 */
Requester2.prototype.send = function(cb) {
    // code
};

/**
 * This callback is displayed as a global member.
 * @callback requestCallback2
 * @param {number} responseCode
 * @param {string} responseMessage
 */
