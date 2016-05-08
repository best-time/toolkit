/**
 * Created by Administrator on 2016/5/9 0009.
 */
/*
 核心只有一个：
 属性共享和独立的控制，当你的对象实例需要独立的属性，
 所有做法的本质都是在对象实例里面创建属性。
 若不考虑太多，你大可以在Person里面直接定义你所需要独立的属性来覆盖掉原型的属性。
 总之，使用原型继承的时候，要对于原型中的属性要特别注意，因为他们都是牵一发而动全身的存在。
 */
/*
 关键点在于 object(o) 里面，这里借用了一个临时对象来巧妙避免了调用new Mother()，
 然后将原型为 o 的新对象实例返回，从而完成了原型链的设置。很绕，
 对吧，那是因为我们不能直接设置 Person.prototype = Mother.prototype 啊。
 */
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function inheritPrototype(Person, Mother) {
    var prototype = object(Mother.prototype);
    prototype.constructor = Person;
    Person.prototype = prototype;
}

function Mother(age) {
    this.age = age;
    this.hobby = ['running', 'football'];
}
Mother.prototype.showAge = function() {
    console.log(this.age)
};
function Person(name, age) {
    Mother.call(this, age);
    this.name = name;
}
inheritPrototype(Person, Mother);
Person.prototype.showName = function() {
    console.log(this.name);
};

var p1 = new Person("jack", 20);
console.log(p1);
p1.hobby.push("jump");
var p2 = new Person("Mark", 30);
console.log(p2);

