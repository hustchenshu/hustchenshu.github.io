/*
    提示，5道时间1个小时，可以使用伪代码方式
*/

/*
 问题1：在移动开发中会有触发比较频繁的事件，比如抢购时用户快速点击一个按钮，会导致频繁调用 API。请完成下面函数 throttle
 */

```js
/**
 * @param {function} func - The function to throttle.
 * @param {number} delay - The number of milliseconds to throttle invocations to.
 * @return {function} Returns the new throttled function.  
 */
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

```

/*
 问题2：列举至少5种常规排序算法，请编写快速排序排序算法。
*/
1、冒泡；2、sort 排序；3、选择排序；4、插入排序；5、快速排序

```js
const partition = (arr, start, end) => {
    let stand = arr[start];
    while(start < end) {
        while(start < end && arr[end] > stand) {
            end--;
        }
        arr[start] = arr[end]; 
        while(start < end && arr[start] <= stand) {
            start++;
        }
        arr[end] = arr[start];
    }
    arr[start] = stand;
    return start;
};

const quickSort = (arr, start = 0, end = arr.length - 1) => {
    if(end <= start) {
        return arr;
    }
    const index = partition(arr, start, end);
    quickSort(arr, start , index - 1);
    quickSort(arr, index + 1, end);
    return arr;
}
```


/*
 问题3：树的深度优先搜索（DFS）广度优先搜索（BFS）
*/
// 深度

```js
function dfs(root) {
    if(!root) {
        return root;
    }
    const { left, right, val } = root;
    exec(val); // do something
    dfs(left);
    dfs(right);
}
```

// 广度
```js
function bfs(root) {
    if(!root) {
        return root;
    }
    const stack = [root];
    while(stack.length) {
        const len = stack.length;
        while(len > 0) {
            const cur = stack.shift();
            const { left, right, val } = cur;
            exec(val); // do something
            left && stack.push(left);
            right && stack.push(right);
            len--;
        }
    }
}
```

/*
 问题4：// 实现一个Promise.all 函数。  假设Promise其他API都存在，仅仅实现Promise.all . 不能使用await async
*/

```js
function promiseAll (promises) {
    if(!promises[Symbol.iterator]) {
        throw new Error('arg is not iterable')
    }
	return new Promise((resolve, reject) => {
        const results = [];
        const len = promises.length;
        if (!len) {
            resolve(results);
        }
        let succCount = 0, index = 0;
        for(const curItem of promises) {
            let resultIndex = index++;
            Promise.resolve(curItem).then((value) => {
                results[resultIndex] = value;
                succCount++;
                if(succCount === len) {
                    resolve(results);
                }
            }, (err) => {
                reject(err);
            })
        }
    })
}

// promise.all([1,2,3]).then((res) => {
		// console.log(val, val2)
// })

```


// 问题5：二维数组螺旋输出，如输入：

```js
// var arr =
// [1, 2, 3]
// [4, 5, 6]
// [7, 8, 9]
// 则输出：
// 1，4，2，7，5，3，8，6，9

const print = (arr) => {
    const row = arr.length;
    if(!row) {
        return;
    }
    const column = arr[0].length;
    // 从上往下
    for(let i = 0; i < row; i++) {
        let j = i;
        while(j >= 0 && arr[j].length) {
            console.log(arr[j].shift());
            j--;
        }
    }
    // 从左往右
    for(let m = 1; m < column; m++) {
        let n = row - 1;
        while(n >= 0 && arr[n].length) {
            console.log(arr[n].shift());
            n--;
        }
    }
    console.log({arr})
}

var arr =[
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(arr);

```