function debounce(fn,delay){
    let timer = null //借助闭包
    return function(...args) {
        let context = this;
        if(timer){
            clearTimeout(timer) 
        }
        timer = setTimeout(() =>{
            fn.apply(context, args);
        },delay) // 简化写法
    }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
 function debounce1(func,wait,immediate) {
    let timeout;

    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
            if (callNow) func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
}

function throttle(func, wait) {
    let previous = 0;
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}

function throttle(fn,delay){
    let valid = true
    return function(...args) {
        const context = this;
        if(!valid){
            //休息时间 暂不接客
            return false 
        }
       // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn.apply(context, args);
            valid = true;
        }, delay)
    }
}