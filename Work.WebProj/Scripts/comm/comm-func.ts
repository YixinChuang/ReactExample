import Moment = require('moment');
/**
 * 產生GUID
 */
export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
/**
 * 是否為有效的JSON日期格式
 * @param value 日期
 * @param userFormat 檢查日期格是
 */
export function isValidJSONDate(value: string, userFormat) {
    var userFormat = userFormat || 'yyyy-mm-dd';

    var delimiter = /[^mdy]/.exec(userFormat)[0];
    var theFormat = userFormat.split(delimiter);

    var splitDatePart = value.split('T');
    if (splitDatePart.length == 1)
        return false;

    var theDate = splitDatePart[0].split(delimiter);
    var isDate = function (date, format) {
        var m, d, y;
        for (var i = 0, len = format.length; i < len; i++) {
            if (/m/.test(format[i])) m = date[i];
            if (/d/.test(format[i])) d = date[i];
            if (/y/.test(format[i])) y = date[i];
        };
        return (
            m > 0 && m < 13 &&
            y && y.length === 4 &&
            d > 0 && d <= (new Date(y, m, 0)).getDate()
        )
    }

    return isDate(theDate, theFormat)
}
/**
 * 將日期轉換成民國
 * @param utcstr UTC日期格
 */
export function stdChiDate(utcstr: any) {
    let chgDay = "";
    if (utcstr && isValidJSONDate(utcstr, null)) {
        var date = new Date(utcstr);
        chgDay += (date.getFullYear() - 1911) + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        date = null;
        return chgDay;
    } else
        return null;
}

/**
 * 標準時間格式
 * @param utcstr
 */
export function stdTime(utcstr: any) {
    if (utcstr && isValidJSONDate(utcstr, null)) {
        return Moment(utcstr).format("HH:mm")
    } else
        return null;
}
/**
 * 判斷是否為數值
 * @param n
 */
export function isNumeric(n): boolean {
    let m = parseFloat(n);
    //return !isNaN(parseFloat(n)) && isFinite(n) && m >= 0; //正能正整數
    return !isNaN(parseFloat(n)) && isFinite(n);
}
/**
 * 取得input dom 值
 * @param e
 */
export function makeInputValue(e: React.SyntheticEvent<EventTarget>) {
    let input: HTMLInputElement = e.target as HTMLInputElement;
    let value;

    if (input.value == 'true') {
        value = true;
    } else if (input.value == 'false') {
        value = false;
    } else {
        value = input.value;
    }

    return value;
}
/*
  Autohr:Ajoe
  Date:2015/12/09
  Description:金錢格式
  */
export function fmtMoney(n: number, g?: string): string {
    if (n == undefined || n == null)
        return '';

    let glue = (typeof g == 'string' && g != null && g != undefined) ? g : ',';// 決定三個位數的分隔符號
    let digits = n.toString().split('.');// 先分左邊及小數點後

    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(digits[0])) {//判斷有沒有符合 前面為三個數字
        digits[0] = digits[0].replace(pattern, "$1" + glue + "$2");
    }
    return digits.join(".");
}