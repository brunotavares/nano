//Using @memberof

/** @namespace */
var Tools = {};

/** @memberof Tools */
var hammer = function() {};

Tools.hammer = hammer;



//Using @memberof with a class prototype

/** @class Observable */
create(
    'Observable', {
        /**
         * This will be a static member, Observable.cache.
         * @memberof Observable
         */
        cache: [],

        /**
         * This will be an instance member, Observable#publish.
         * @memberof Observable.prototype
         */
        publish: function(msg) {},

        /**
         * This will also be an instance member, Observable#save.
         * @memberof Observable#
         */
        save: function() {},

        /**
         * This will also be an instance member, Observable#end.
         * @memberof Observable
         * @instance
         */
        end: function() {}
    }
);




//Using @memberof! for object properties
/** @class */
function Data2() {
    /**
     * @type {object}
     * @property {number} y This will show up as a property of `Data2#point`,
     * but you cannot link to the property as {@link Data2#point.y}.
     */
    this.point = {
        /**
         * The @alias and @memberof! tags force JSDoc to document the
         * property as `point.x` (rather than `x`) and to be a member of
         * `Data2#`. You can link to the property as {@link Data2#point.x}.
         * @alias point.x
         * @memberof! Data2#
         */
        x: 0,
        y: 1
    };
}