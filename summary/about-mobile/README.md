# 移动端前端一些坑
>
> 魅族手机 localStorage的坑
>
> 1. 魅族自带浏览器 存在window.localStorage setItem removeItem 等api, 设置值时不会报错,但存进去的变量, '取不到', 实际上是不能存取数据
> 好多类库都没有严格判断. 不能仅仅依靠setItem等方法是否存在来判断. 导致我之前调spa项目的bug, 页面间传值, 下个页面一直取不到.<br />
> 最好是 window.localStorage.setItem('a', 'aa');  window.localStorage.getItem('a') === 'aa'
>
> 2. 魅族自带浏览器 对于页面底部 fixed 定位存在bug, 如果底部正下放对的恰巧是a标签, 会不触发底部绑定的事件, 直接触发a标签事件.<br />
> 解决方案: 参照 m.taobao.com 首页. 内容区域flex + 内容区域js控制滚动 (如果底部是按钮, 且要定位,也推荐使用)
>
> placeholder属性设置的文字向上偏移的厉害. Android4.x部分机型. 推荐: line-height:normal