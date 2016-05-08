/**
 * Created by Administrator on 2016/5/9 0009.
 */

//组合继承
function Mother(age) {
    this.age = age;
    this.hobby = ["running", 'football'];
}
Mother.prototype.showAge = function() {
    console.log(this.age);
};

function Person(name, age) {
    Mother.call(this, age);
    this.name = name;
}
Person.prototype = new Mother();
Person.prototype.constructor = Person;
Person.prototype.showName = function() {
    console.log(this.name);
};

var p1 = new Person("jack", 20);
console.log(p1);
p1.hobby.push("basketball");
var p2 = new Person("mark", 18);
console.log(p2);
