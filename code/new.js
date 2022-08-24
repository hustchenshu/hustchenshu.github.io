function createNew() {
    // 1. 创建空对象
    const obj = {};
    // 2. 链接原型链
    const constructor = [].shift.call(arguments);
    obj.__proto__ = constructor.prototype;
    // 3. 绑定this值
    const result = constructor.apply(obj, arguments);

    return typeof result === 'object' ? result : obj;
}

function dog(name, age) {
    this.name = name || 'jack';
    this.age = age || 1;
    this.bark = () => {
        console.log('www, i am', this.name)
    }
}

dog.prototype.hello = function() {
    console.log('hello:', this.name);
}

const jack = createNew(dog, 'mardin', 22);
jack.bark();
jack.hello();
console.log(jack.__proto__ === dog.prototype)
