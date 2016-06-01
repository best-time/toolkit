compose.require('scripts/eBase/factory.js',[
    'window.$',
    'scripts/eBase/eBase.js'
], function ($, eBase) {
    window.eBase.Factory = {
        types:{

        },
        /*
         * 定义工厂类型
         * @param name [String] 名称
         * @param factory [Function] 生成对象的方法
         * @param args [Array] 生成对象的参数
         * */
        define: function(name, factory, args){
            this.types[name] = {
                factory: factory,
                args: args||[],
                children:[]
            };
            var self = this;
            return {
                /*
                 * 工厂生成对象
                 * */
                create: function(){
                    return self.create(name);
                }
            }
        },
        /*
         * 工厂生成对象
         * @param name [String] 名称
         * */
        create: function(name){
            var typeConfig = this.types[name], child;
            if(typeConfig){
                child = typeConfig.factory.apply(null, typeConfig.args);
                typeConfig.children.push(child);
            }
            return child;
        },
        /*
         * 是否已定义
         * @param name [String] 名称
         * */
        hasDefined: function(name){
            return !!this.types[name];
        }
    }
    return eBase;
});