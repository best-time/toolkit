/**
 * Created by yy on 2015-12-18.
 */
require.config({
    paths: {
        jquery: "jquery.1.11.1.min",
        underscore: "underscore-min"
    }
});

require(["a1"], function(bb) {
    console.log(bb)
    bb.func1();
});