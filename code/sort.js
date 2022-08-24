const demo = [1,9,3,31,4,2,5,6,7,83,5,2];

const swap = (arr, x, y) => {
    const temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
}


/**
 *  冒泡排序
 * @param {*} arr 
 * @returns 
 */
const bubbleSort = (arr) => {
    const len = arr.length;
    for(let i = 0 ; i < len; i++) {
        for(let j = 0; j < len - i - 1; j++) {
            if(arr[j] > arr[j + 1]) {
                swap(arr, j, j+1);
            }
        }
    }
    return arr;
}

const bubbleSortRestule = bubbleSort([...demo]);
console.log({
    bubbleSortRestule
});

/**
 * 插入排序
 * @param {*} arr 
 * @returns 
 */
const insertSort = (arr) => {
    const len = arr.length;
    for(let i = 1 ; i < len; i++) {
        const cur = arr[i];
        let index = i - 1;
        while(index >= 0 && arr[index] > cur) {
            arr[index + 1] = arr[index];
            index--;
        }
        arr[index + 1] = cur;
    }
    return arr;
}

const insertSortResult = insertSort([...demo]);
console.log({
    insertSortResult
});

/**
 * 选择排序
 * @param {*} arr 
 * @returns 
 */
const selectSort = (arr) => {
    const len = arr.length;
    for(let i = 0 ; i < len; i++) {
        let minIndex = i;
        for(let j = i + 1; j < len; j++) {
            if(arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        swap(arr, i , minIndex);
    }
    return arr;
}

const selectSortResult = selectSort([...demo]);
console.log({
    selectSortResult
});

/**
 * 希尔插入排序
 * @param {*} arr 
 * @returns 
 */
const sellInsertSort = (arr) => {
    const len = arr.length;
    let span = Math.floor(len / 2);
    while(span >= 1) {
        for(let i = span ; i < len; i += span) {
            const cur = arr[i];
            let index = i - span;
            while(index >= 0 && arr[index] > cur) {
                arr[index + span] = arr[index];
                index -= span;
            }
            arr[index + span] = cur;
        }

        span = Math.floor(span / 2);
    }
    return arr;
}

const sellInsertSortResult = sellInsertSort([...demo]);
console.log({
    sellInsertSortResult
});


/**
 * 归并排序
 * @param {*} arrx 
 * @param {*} arry 
 * @returns 
 */
const merge = (arrx, arry) => {
    const result = [];
    while(arrx.length && arry.length) {
        if(arrx[0] < arry[0]) {
            result.push(arrx.shift());
        } else {
            result.push(arry.shift());
        }
    }
    while(arrx.length) {
        result.push(arrx.shift());
    }
    while(arry.length) {
        result.push(arry.shift());
    }
    return result;
}

const mergeSort = (arr) => {
    const len = arr.length;
    if(len < 2){
        return arr;
    }
    const mid = Math.floor(len / 2);
    return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)))
}


const mergeSortResult = mergeSort([...demo]);
console.log({
    mergeSortResult
});

/**
 * 快排
 * @param {*} arr 
 * @param {*} start 
 * @param {*} end 
 * @returns 
 */
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

const quickSortResult = quickSort([...demo]);
console.log({
    quickSortResult
});