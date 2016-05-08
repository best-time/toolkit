/**
 * Created by Administrator on 2016/5/9 0009.
 */

//原始模式
var person1 = {
    name: 'jack',
    age: 30,
    sayName: function() {
        alert(this.name);
    }
};
var person2 = new Object();
person2.name = 'jack';
person2.age = 33;
person2.sayName = function() {
    alert(this.anme);
};

//工厂模式
//分不清实例
function createPerson(name, age) {
    var person = new Object();
    person.name = name;
    person.age = age;
    person.sayName = function() {
        alert(this.name);
    };
    return person;
}

//构造函数
//属性独有, 方法应该共用
function Person3(name, age) {
    this.name = name;
    this.age = age;
    this.sayName = function() {
        alert(this.name);
    }
}

//原型模式
    //直接定义prototype属性
/*
 这里需要注意的是原型属性和方法的共享，
 即所有实例中都只是引用原型中的属性方法，任何一个地方产生的改动会引起其他实例的变化。
 */
function Person4() {}
Person4.prototype.name= 'jack';
Person4.prototype.age= 44;
Person4.prototype.sayName= function() {
    alert(this.name)
};
    //字面量定义方式
function Person5() {}
Person5.prototype = {
    name: "jack",
    age: 44,
    sayName: function() {
        alert(this.name);
    }
};

//混合模式(构造 + 原型)
function Person6(name, age) {
    this.name = name;
    this.age = age;
}
Person6.prototype = {
    hobby: ["football", "running"],
    sayName: function() {
        console.log(this.name)
    },
    sayAge: function() {
        console.log(this.age);
    }
};