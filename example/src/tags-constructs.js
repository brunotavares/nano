//Using the @constructs tag with @lends
var PersonB = makeClass(
    /** @lends PersonB.prototype */
    {
        /** @constructs */
        initialize: function(name) {
            this.name = name;
        },
        /** Describe me. */
        say: function(message) {
            return this.name + " says: " + message;
        }
    }
);

//Without @lends you must provide the name of the class
makeClass('Menu',
    /**
     * @constructs Menu
     * @param items
     */
    function(items) {}, {
        /** @memberof Menu# */
        show: function() {}
    }
);
