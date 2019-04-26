import 'core-js/es6/map';
import 'core-js/es6/set';

(function () {

    //修正babel ie10 無法 call class constructor
    var testObject: any = {};

    if (!(Object.setPrototypeOf || testObject.__proto__)) {
        var nativeGetPrototypeOf = Object.getPrototypeOf;

        Object.getPrototypeOf = function (object) {
            if (object.__proto__) {
                return object.__proto__;
            } else {
                return nativeGetPrototypeOf.call(Object, object);
            }
        }
    }

    //IE 無法用 Object.assign
    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }
                    nextSource = Object(nextSource);

                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }

    //對陣列物件 數值型欄位做加總
    if (Array.prototype.sum === undefined) {
        Array.prototype.sum = function (func: any) {
            const _self: Array<any> = this;
            //console.log('func', func)
            let get_sum = _self
                .map<number>(func)
                .reduce((pre: number, cur: number) => {
                    //console.log('check', 'reduce', pre, cur);
                    if (cur !== undefined && cur !== null && cur.toString() != '')
                        return pre + cur;
                    else
                        return pre;
                }, 0)

            //console.log('get_sum', get_sum)
            return get_sum;
        };
    }
    //對浮點數值型 取小數位數 
    if (Number.prototype.floatSpot === undefined) {
        Number.prototype.floatSpot = function (pos) {
            if (this !== undefined && this !== null) {
                let size = Math.pow(10, pos);
                return Math.round(this * size) / size;
            }
        }
    }
    //除數 
    if (Number.prototype.divisor === undefined) {
        Number.prototype.divisor = function (num) {
            if (this != undefined && this !== null && num) {
                return this / num;
            }
        }
    }
    if (Number.prototype.isInteger === undefined) {
        Number.isInteger = Number.isInteger || function (value) {
            return typeof value === "number" &&
                isFinite(value) &&
                Math.floor(value) === value;
        };
    }

    //找出陣列物件 index (ie11無法使用js內建findIndex)
    if (Array.prototype.findIndex === undefined) {
        Array.prototype.findIndex = function (func) {
            let index = -1;
            const _self: Array<any> = this;

            _self.map<boolean>(func).forEach((item, i) => {
                if (item) {
                    index = i;
                }
            });
            return index;
        };
    }

    //找出陣列物件 (ie11無法使用es6內建find)
    if (Array.prototype.find === undefined) {
        Array.prototype.find = function (func) {
            const _self: Array<any> = this;
            //找尋陣列中第一個符合的元素回傳(filter ie9以上才支援)
            let res = _self.filter(func);
            let obj = res.length > 0 ? res[0] : null;

            //找尋陣列中全部符合的元素
            //let arr = [];
            //_self.filter(func).map((item, i) => {
            //    arr.push(item);
            //});
            return obj;
        };
    }
})();
