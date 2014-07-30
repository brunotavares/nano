//Document an inner variable as a global
(function() {
    /** @global */
    var foo = 'hello foo';

    this.foo = foo;
}).apply(window);
