Function.prototype.myCall = function (context, ...arr) {
    if(typeof this !== 'function') {
        throw 'not function'
    }
    const self = context || window;
    const fnSymbol = Symbol('fn');
    self[fnSymbol] = this;
    const result = self[fnSymbol](...arr);
    delete self[fnSymbol];

    return result;
}

const callDemo = {
    name: 'aa',
    say(word1, word2) {
        console.log(`hello, ${this.name}!${word1},${word2}`)
    }
}

const callObj = {
    name: 'cccc',
};

callDemo.say.myCall(callObj, 'i am fine', 'ok');


Function.prototype.myApply = function (context, arr) {
    if(typeof this !== 'function') {
        throw 'not function'
    }
    if(arr && !Array.isArray(arr)) {
        throw 'not valid params'
    }

    const self = context || window;
    self.fn = this;
    const result = self.fn(...arr);
    delete self.fn;

    return result;
}

callDemo.say.myApply(callObj, ['i am fine', 'ok','mu']);

Function.prototype.myBind = function (context) {
    if(typeof this !== 'function') {
        throw 'not function'
    }

    context.fn = this;
    return (...args) => {
        const result = context.fn(...args);
        delete context.fn;
        return result;
    }
}

const bindDemo = function (txt) {
    console.log(this.name + txt);
}

const bot = {
    name: 'aimi',
}

const bindfn = bindDemo.myBind(bot);
console.log(bindfn('aaa'));

const curry = function (fn, ...arr) {
    return (...args) => {
        const newArgs = [...arr, ...args];
        if(newArgs.length >= fn.length) {
            return fn(...newArgs);
        } else {
            return curry(fn, ...newArgs);
        }
    }
}

const plus = (a, b ,c) => a+b+c;

const curryPlus = curry(plus);

console.log(curryPlus(1,2)(3), curryPlus(1)(3,6), curryPlus(1)(8)(3), curryPlus(1,2))
