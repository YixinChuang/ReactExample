interface ReturnBase {
    state?: number;
    message?: string;
    append?: any;
}
interface ReturnData<T> extends ReturnBase {
    exist?: boolean;
    data?: T;
}
interface ReturnUpdate<T> extends ReturnBase {
    id: number;
    exist: boolean;
    data: T;
}
interface GridInfo<T> {
    rows?: T[],
    total?: number,
    page?: number,
    records?: number,
    startcount?: number,
    endcount?: number,
    sort?: string, //asc desc
    field?: string
}