const PROMISE_STATUS = {
    FUIFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'
}

class MyPromise {
    status = PROMISE_STATUS.PENDING;
    resolveCallbacks = [];
    rejectCallbacks = [];
    value = null;
    error = null;

    constructor(executor) {
        try {
            executor(this.resolve.bind(this), this.reject.bind(this)); 
        } catch (error) {
            this.reject(error);
        }
    }

    static resolve() {

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
                this.rejectCallbacks.shift()(error);
            }
        }
    }

    then(onFulfilled, onRejected) {
        switch(this.status) {
            case PROMISE_STATUS.PENDING:
                onFulfilled && this.resolveCallbacks.push(onFulfilled);
                onRejected && this.rejectCallbacks.push(onRejected);
                break;
            case PROMISE_STATUS.FUIFILLED:
                const value = onFulfilled(this.value);
                break;
            case PROMISE_STATUS.REJECTED:
                onRejected(this.error);
                break;
        }
    }

    static returnPromise(value) {
        if(Object.isProperty)
    }
}

const demo = new MyPromise((resolve, reject) => {
    console.log('promise init');
    setTimeout(() => {
        resolve(111);
    }, 3000)
})

console.log(demo)
demo.then((value) => {
    console.log('resolve2:', value)
})

demo.then((value) => {
    console.log('resolve3:', value)
});

console.log({
    prototype: MyPromise.prototype.resolve,
    resolve: MyPromise.resolve,
    aa: MyPromise.resolve('aaa')
})

MyPromise.deferred = function () {
    const result = {};
    result.promise = new MyPromise(function (resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    });
  
    return result;
}
module.exports = MyPromise;