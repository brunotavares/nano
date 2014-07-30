//Example class
// We want to document this as being a class
// var PersonC = makeClass(
//     // We want to document these as being methods
//     {
//         initialize: function(name) {
//             this.name = name;
//         },
//         say: function(message) {
//             return this.name + " says: " + message;
//         }
//     }
// );

//Documented as static methods
/** @class */
var PersonD = makeClass(
    /** @lends PersonD */
    {
        initialize: function(name) {
            this.name = name;
        },
        say: function(message) {
            return this.name + " says: " + message;
        }
    }
);

//Documented as instance methods
/** @class */
var PersonE = makeClass(
    /** @lends PersonE.prototype */
    {
        initialize: function(name) {
            this.name = name;
        },
        say: function(message) {
            return this.name + " says: " + message;
        }
    }
);

//Documented with a constructor
var PersonF = makeClass(
    /** @lends PersonF.prototype */
    {
        /** @constructs */
        initialize: function(name) {
            this.name = name;
        },
        say: function(message) {
            return this.name + " says: " + message;
        }
    }
);