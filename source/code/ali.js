var arr =[
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

var arr =[
    [1, 2, 3, 4],
    [5, 6, 7,8],
    [9,10,11,12],
]

// 则输出：
// 1，4，2，7，5，3，8，6，9

const print = (arr) => {
    const row = arr.length;
    // console.log(row)
    if(!row) {
        return;
    }
    const column = arr[0].length;
    for(let i = 0; i < row; i++) {
        let j = i;
        while(j >= 0 && arr[j].length) {
            console.log(arr[j].shift());
            j--;
        }
    }
    for(let m = 1; m < column; m++) {
        let n = row - 1;
        while(n >= 0 && arr[n].length) {
            console.log(arr[n].shift());
            n--;
        }
    }
    console.log({arr})
}

print(arr);

function throttle (fn, delay) {
    let valid = true
    return function(...args) {
        const context = this;
        if(!valid){
            return false 
        }
        valid = false
        setTimeout(() => {
            fn.apply(context, args);
            valid = true;
        }, delay)
    }
}

const fn = (a,b) => {
    console.log('aaa', a, b)
}

const throttleFn = throttle(fn, 200);

for(let i = 0; i < 100; i++) {
    setTimeout(throttleFn, i*10, i, i*10)
}