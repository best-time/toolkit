/**
 * Created by Ywy on 15/12/21.
 */
define(function(require, exprots, module) {
    require("./jquery.1.8.3.min");
    var t1 = function() {
        console.log("t1.js的 t1方法")
    };
    var t2 = function() {
        $("#box").on("click", function() {
            console.log("seajs 结合jquery")
        })
    }
    exprots.t1 = t1;
    exprots.t2 = t2;
});