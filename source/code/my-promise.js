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
        const thenPromise = new MyPromise((resolve, reject) => {
            const resolvePromise = cb => {
                try{
                    const x = cb(this.value);
                    // 本身
                    if(x === thenPromise) {
                        throw new Error('cannot return self')
                    }
                    if(x instanceof MyPromise) {
                        x.then(resolve, reject);
                    } else {
                        resolve(x);
                    }
                } catch (e) {
                    reject(e);
                }
            };

            switch(this.status) {
                case PROMISE_STATUS.PENDING:
                    // onFulfilled && this.resolveCallbacks.push(onFulfilled);
                    this.resolveCallbacks.push(resolvePromise.bind(this, onFulfilled));
                    this.rejectCallbacks.push(resolvePromise.bind(this, onRejected));
                    // onRejected && this.rejectCallbacks.push(onRejected);
                    break;
                case PROMISE_STATUS.FUIFILLED:
                    // onFulfilled(this.value);
                    resolvePromise(onFulfilled);
                    break;
                case PROMISE_STATUS.REJECTED:
                    // onRejected(this.error);
                    resolvePromise(onRejected);
                    break;
            }

        })

        return thenPromise;
    }
}

const demo = new MyPromise((resolve, reject) => {
    console.log('promise init');
    setTimeout(() => {
        resolve(111);
    }, 3000)
}).then((value) => {
    console.log('resolve1', value)
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