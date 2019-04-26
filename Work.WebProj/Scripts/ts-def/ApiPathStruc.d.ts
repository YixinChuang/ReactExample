type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
interface ApiPathStruct {
    key?: string,
    path: string,
    method: Method,
    desc?: string
}