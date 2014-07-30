//Using the @readonly tag
/**
 * A constant.
 * @readonly
 * @const {number}
 */
const FOOREADONLY = 1;




//Using the @readonly tag with a getter

/**
 * Options for ordering a delicious slice of pie.
 * @namespace
 */
var pieOptions = {
    /**
     * Plain.
     */
    plain: 'pie',
    /**
     * A la mode.
     * @readonly
     */
    get aLaMode() {
        return this.plain + ' with ice cream';
    }
};
