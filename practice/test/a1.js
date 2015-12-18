/**
 * Created by yy on 2015-12-18.
 */
define(["jquery", "underscore"], function($, _) {
    var test = {
        func1: function() {
            $("#box").on("click", function() {
                var res = _.map([1, 2, 3], function(num){ return num * 3; })
                console.log(res);
            })
        }

    };


    return test
});