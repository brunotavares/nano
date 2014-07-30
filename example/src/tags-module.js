//Basic @module use

/** @module myModuleA */

/** will be module:myModuleA~foo */
var foo = 1;

/** will be module:myModuleA.bar */
var bar = function() {};





//Defining exported symbols as a member of &#39;this&#39;

/** @module bookshelf */

/** @class */
this.Book = function(title) {
    /** The title. */
    this.title = title;
};






//Defining exported symbols as a member of &#39;module.exports&#39; or &#39;exports&#39;

/** @module color/mixer */
module.exports = {
    /** Blend two colours together. */
    blend: function(color1, color2) {}
};
/** Darkens a color. */
exports.darken = function(color, shade) {};