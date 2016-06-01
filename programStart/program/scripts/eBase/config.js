compose.require('scripts/eBase/config.js',[
    'window.$',
    'scripts/eBase/eBase.js',
    'scripts/lib/exp.js'
], function ($, eBase, Exp) {
    //是否有动画条件判断
    var noAnimate = window.navigator.userAgent.match(/MQQBrowser\/([\w\.]*)/);
    //解决安卓版qq最新版浏览器加载问题
    if(noAnimate && !Exp.getVersion().ios){
        noAnimate = noAnimate[1]-0 >= 6.6
    }
    else{
        noAnimate = false;
    }
    window.eBase.Config = {
        view:{
            requireTimes:{
                'always': 'always',
                'once': 'once'
            },
            //loading加载显示最小时长
            loadingMinTime: 500,
            prefetch: true
        },
        router:{
            resources:{
            },
            //根目录,未启动
            closeRoot: true,
            //是否打开目录path
            openPath: true,
            //path参数名称
            pathName: 'path'
        },
        service:{
            urls:{
                templatePath: appConfig.templatePath || 'data/html'
            },
            timeout: 15000
        },
        layout:{
            animateDuration: 600,
            noAnimate: noAnimate
        },
        //用于模拟配置
        simulate: {
            reqResFail: false,
            timeout: 3000
        },
        //sit、pre、prd可关闭
        debug: true,
        //会员体系，默认epp的会员，过滤认证功能
        member:'epp',
        //部分会员认证，默认全局会员
        partMemberRequire: true
    }
    return eBase;
});



