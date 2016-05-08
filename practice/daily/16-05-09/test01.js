/**
 * Created by Administrator on 2016/5/9 0009.
 */
function Person(name) {
    this.name = name;
}
function Mother() {}
Mother.prototype = {
    //constructor: Mother,
    age: 33,
    home: ["beijing", "shanghai"]
};
Person.prototype = new Mother();

var p1 = new Person("jack");
var p2 = new Person("Mark");
console.log(p1);
p1.age = 44; //实例不能改变原型的基本属性值
console.log(p1);
p1.home[0] = "jiangsu"; //原型的引用类型属性是共享
console.log(p1);
p1.home = ["yancheng", "nanjing"];
console.log(p1);
delete p1.age;
console.log(p1.age);
Person.prototype.lastName = "fashion"; //改写原型,动态反应到实例中
//console.log(p1)












