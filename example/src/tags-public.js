//Using the @public tag
/**
 * The Thingy class is available to all.
 * @public
 * @class
 */
function ThingyPublic() {
    /**
     * The Thingy~foo member. Note that 'foo' is still an inner member
     * of 'Thingy', in spite of the @public tag.
     * @public
     */
    var foo = 0;
}
