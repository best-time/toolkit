;(function () {
    //switch button
    var _PASS_ = []
    var but = document.getElementsByClassName("vc-switch")[0];

    but.addEventListener("click", function () {
        document.getElementById("__vconsole").setAttribute('class', 'vc-toggle');
        $(".vc-panel, .vc-mask, .vc-content").on('touchmove', function(e) {
            e.preventDefault();
        })
        // $(".vc-mask").on('touchmove', function(e) {
        //     e.preventDefault();
        // })
        // $(".vc-content").on('touchmove', function(e) {
        //     e.preventDefault();
        // })
    }, false);

    function hide() {
        document.getElementById("__vconsole").removeAttribute('class');
        resetPass();
    }

    //遮罩层
    var mask = document.getElementsByClassName("vc-mask")[0];
    mask.addEventListener("click", function () {
        hide();
    }, false);

    $(".close").on("click", function(){
        hide();
    });

    writeIn();

    function writeIn() {
        $("#table_keyboard td").on('click', function() {
            var index = $('.keyboard-char span.on').length;
            var text = +$(this).text();
            if(text >= 0) {
                _PASS_.push(text);
                if($('.keyboard-char span.on').length >=5) {
                    // window.location.href = 'http://www.baidu.com';
                    return;
                }
                $('.keyboard-char span').eq(index).addClass('on').find('i').addClass('on');
            } else {
                _PASS_.pop();
                $('.keyboard-char span').eq(index-1).removeClass('on').find('i').removeClass('on');
            }
        })
    }
    function resetPass() {
        $('.keyboard-char span').removeClass("on").find('i').removeClass('on');
    }
}());