---
title: js手写系列
date: 2021-07-17 21:43:07
tags:
---

# 节流

```javascript

```

# 防抖

```javascript

```

# promise

```javascript
const PROMISE_STATUS = {
    FUIFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'
}

class MyPromise {
    private status = PROMISE_STATUS.PENDING;
    resolveCallbacks = [];
    rejectCallbacks = [];
    value = null;
    error = null;

    constructor(executor) {
        executor(this.resolve, this.reject);
    }

    resolve(value) {
        if(this.status === PROMISE_STATUS.PENDING) {
            this.status = PROMISE_STATUS.FUIFILLED;
            this.value = value;
            while(this.resolveCallbacks.length) {
                this.resolveCallbacks.shift()(value);
            }
        }
    }

    reject(error) {
        if(this.status === PROMISE_STATUS.PENDING) {
            this.status = PROMISE_STATUS.REJECTED;
            this.error = error;
            while(this.rejectCallbacks.length) {
                this.rejectCallbacks.shift()(value);
            }
        }
    }

    then(onFulfilled, onRejected) {
        swith(this.status) {
            case PROMISE_STATUS.PENDING:
                onFulfilled && this.resolveCallbacks.push(onFulfilled);
                onRejected && this.rejectCallbacks.push(onRejected);
                break;
            case PROMISE_STATUS.FUIFILLED:
                onFulfilled(this.value);
                break;
            case PROMISE_STATUS.REJECTED:
                onRejected(this.error);
                break;
        }
    },
}
```

# 克隆

```javascript

```

# Event

```javascript

```

# new

```javascript
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

```

# apply/call/bind

```javascript

```

# Class

```javascript

```

# 批量请求

```javascript

```

# localStorage

```javascript

```

# instanceof

```javascript

```

# ajax

```javascript

```

# 继承

```javascript

```

# jsonp

```javascript

```
