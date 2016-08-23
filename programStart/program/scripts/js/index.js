//spa :https://github.com/coderLMN/framework-free-single-page-app

$(function() {
    var router = new Router({
        container: '#container',
        enter: 'enter',
        leave: 'leave',
        enterTimeout: 150,
        leaveTimeout: 150
    });

// console.log(router)
    var home = {
        url: '/',
        className: 'home',
        render: function () {
            // console.log(router)
            console.log('enter in homepage')
            $(document).on('click', '.container a', function() {
                window.location.href = $(this).data('href')
            });

            return $('#tpl_home').html();
        },
        bind: function() {
            // console.log(router)

        }
    };

    var border = {
        url: '/border',
        className: 'border',
        render: function () {
            var aa = ''
            $.ajax({
                url: 'tpl/tpl_border.html',
                data: {},
                type: 'get',
                dataType: 'text',
                async: false,
                success: function(res) {
                    aa = res
                }
            })
            return aa
        }
    };


    
    router.push(home)
        .push(border)
        .setDefault('/')
        .init();

    // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
    // 相关 issue: https://github.com/weui/weui/issues/15
    // 解决方法:
    // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
    // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
    //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
    if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }
});