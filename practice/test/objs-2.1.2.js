/**
 * @classDescription
 * A minimalistic library intended to help in using namespaces and class
 * inheritance in JavaScript.
 *
 * @see Sources - https://github.com/tekool/objs
 * @see Documentation - https://github.com/tekool/objs/wiki
 * @author   Frederic Saunier - www.tekool.net
 * @version 2.1
 *
 * @license
 *
 * Copyright (C) 2006-2012 Frederic Saunier, www.tekool.net
 * Objs may be freely distributed under the MIT license.
 * For all details and documentation: https://github.com/tekool/objs/
 */

/**
 * Create or retrieve a class constructor using its unique classpath.
 *
 * <P>
 * If a class is declared twice with the same namespace, the last class
 * will replace the previous one (previous is eligible for garbage
 * collection.
 * 如果同一个类声明多次, 最后一次会替换前面的声明
 *
 * @param {String} classpath
 *        The classpath of the class to create or retrieve.
 *
 *        <P>Retrieve:
 *        If <code>classpath</code> is the only parameter passed when calling
 *        Objs, the class constructor corresponding to the given classpath is
 *        returned. A new class constructor is returned if no constructor for
 *        the given classpath first exists.
 *
 *        <P>Create:
 *        If <code>classpath</code> parameter is followed by one or two valid
 *        parameters it will create a class.
 *
 * @param {String|Function|Object} second
 *        {String} A superclass path to inherit from typed as a string.
 *        {Function} A superclass to inherit from typed as a function.
 *        {Object} The object used to declare class properties and methods.
 *        {null} A strict null will remove the associated classpath.
 *
 * @param {Object} third
 *        (optional) The object used to declare class properties and methods
 *        when declaring a class which extends another one.
 *
 * @return {Function}
 *        The constructor method of the class corresponding to the given
 *        classpath.
 */
var Objs;
//new function() {
(function () {
    var Tstring = "string",
        $constructing = "$Objs$c",
        $extending = "$Objs$e",
    //A map of <code>ClassInfo</code> objects used to manage classes
        map = {};

    Objs = function (classpath, second, third) {
        var func/*Function*/,
            path/*String*/,
            superclass/*Function*/,
            secondType/*String*/,
            protobject/*Object*/,
            i/*Number*/,
            temp/*Object*/;

        // Retrieve
        if (typeof classpath != Tstring) { //路径不是字符串, 直接抛错
            throw Error("invalid classpath: " + classpath);
        }
        // 类名加个前缀
        path = "$Objs$" + classpath;

        /*
         * If <code>classpath</code> was the only parameter passed to Objs, the
         * developer only wants to get the class constructor corresponding to
         * the given classpath.
         */
        if (second == null) { //第二个参数传入 undefined 或者 null

            //The developer want to remove a class from the Objs class map.
            if (second === null) {
                func = map[path];
                delete map[path];
                return func; //如果第二个参数传 null, 就返回 undefined
            }

            if (func = map[path]) return func;

            //如果第二个参数传入 undefined 或者 不传参 就抛此处错
            throw Error("non-existent class: " + classpath);
        }

        // Superclass definition

        //The 2nd argument is a string representation for a superclass classpath.
        //第二个参数是字符串, 相当于传入了父类
        if ((secondType = typeof second) == Tstring) {
            superclass = map["$Objs$" + second]; //把第二个参数当做superclass
            i = 1;
        }
        //2nd argument is a superclass constructor.
        //第二个参数传入函数,相当于传入父类的 constructor
        else if (secondType == "function") { //第二个参数是函数
            superclass = second;
            i = 1;
        }
        // 2nd argument is a protobject.  否则作为 proto 对象
        else { //第二个传参不是 字符串和函数
            protobject = second;
        }

        //There must be a superclass to inherit from.
        if (i) { //第二个参数时 字符或函数类型, 走这分支

            //The developer try to inherit from an unregistered superclass
            //it is important for him to be informed of the error.
            if (!superclass) { // 第二个是字符串, 走这个分支
                throw Error("non-existent superclass: " + second);
            }

            //The developer try to inherit from a registered superclass
            //but with an undefined protobject.
            //如果第二个参数是字符或者函数, 则必须传入第三个参数
            if (!(protobject = third)) {  //第三个参数作为 protobject
                throw Error("invalid protobject for: " + classpath);
            }

        }

        // Create
        func = map[path] = function () { //声明构造函数 赋给 map对象的path属性  和 变量func
            /*
             * The constructor is not called during the extend phase:
             * myClass.prototype = new MySuperClass().
             */
            //在继承阶段不调用constructor
            if (!func[$extending]) {
                //A superclass is registered.
                if (func.$superclass) {
                    func.$superclass[$constructing] = 1;
                    func.$superclass.call(this);
                    //delete func.$superclass[$constructing];
                }

                /*
                 * The initialize method must only be called automatically on the
                 * first called constructor in the inheritance chain.
                 */
                if (!func[$constructing] && func.prototype.initialize) {
                    func.prototype.initialize.apply(this, arguments); //
                }
            }

        };

        /*
         * Each class in Objs has a "$classpath" property to identify its
         * classpath.
         */

        func.$classpath = classpath; //构造函数func 添加属性 $classpath

        // Protobject
        //There is superclass to extend from.
        if (superclass) { //存在继承
            superclass[$extending] = 1;
            func.prototype = new superclass();// 重写 func 原型
            delete superclass[$extending];
            // delete可以删除对象属性及变量, 不能删除原型上的属性

            /*
             * Each subclass in Objs have a "$super" shortcut to its superclass
             * prototype and a "$superclass" shortcut to its superclass
             * constructor when an Objs superclass is defined for it.
             */
            func.$superclass = superclass; // superclass 就是 父类的func
            func.$super = superclass.prototype;
        }

        /*
         * Protobject properties and methods are copied into the prototype of
         * the returned constructor.
         */
        temp = func.prototype;
        for (var propName in protobject) { //把第二个参数的方法放到构造函数func原型中
            if (protobject.hasOwnProperty(propName)) {
                temp[propName] = protobject[propName];
            }
        }


        //Some Object methods are not enumerable on Internet Explorer
        //兼容ie
        temp.toString = protobject.toString;
        temp.valueOf = protobject.valueOf;
        temp.toLocaleString = protobject.toLocaleString;
//console.log(func.prototype)
//console.log(map)
        return func;
    };

}());
//};
