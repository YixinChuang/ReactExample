interface Array<T> {
    movesort(old_index: number, new_index: number): void;
    sum<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): number;
}

interface Number {
    floatSpot(pos: number): number
    divisor(num: number): number
    isInteger(number: any): boolean
}

interface Window {
    CallRefreshReportList(): void;
    $: any;
    jQuery: any;
}

interface SignalR {
    HubFileState: any
    HubReportMessage: any
    HubUserLog: any
}

declare function mylog(...param: any[]): any;