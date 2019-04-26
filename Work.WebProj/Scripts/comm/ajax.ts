import $ = require('jquery');
import * as Pom from 'es6-promise';
Pom.polyfill();
import 'whatwg-fetch';

declare var fetch: any;

function EncodeQueryData(data) {
    var ret = [];
    for (var d in data) {
        if (data[d] !== undefined && data[d] !== null && data[d] !== '')
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        else
            ret.push(encodeURIComponent(d) + "=");
    }
    return ret.join("&");
}
let errMessage = "連線WebAPI發生錯誤!";

export const callGet = (url: string, data: any): JQueryPromise<any> => {
    return $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.log(textStatus, errorThrown, url, data);
        alert(errMessage);
    });
};
export const callPost = (url: string, data: any): JQueryPromise<any> => {
    return $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown, url, data);
            alert(errMessage);
        })

}
export const callPut = (url: string, data: any): JQueryPromise<any> => {
    return $.post(url, data)
        .fail((jqXHR, textStatus, errorThrown) => {
            alert(errMessage);
        })
};
export const callDelete = (url: string, data: any): JQueryPromise<any> => {
    return $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.log(textStatus, errorThrown, url, data);
        alert(errMessage);
    });
}

export function fetchGet<T>(url: string, data: any): Promise<T> {

    const url_param = EncodeQueryData(data);

    return fetch(url + (url_param == '' ? '' : '?' + url_param), {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        }
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        alert(errMessage);
    });
};
export function fetchPost<T>(url: string, data: any): Promise<T> {

    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        //console.log(reason, url, data);
        alert(errMessage);
    });
};
export function fetchPut<T>(url: string, data: any): Promise<T> {

    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        alert(errMessage);
    });
};
export function fetchDelete<T>(url: string, data: any): Promise<T> {

    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        console.log(reason, url, data);
        alert(errMessage);
    });
};

export function fetchFile<T>(url: string, body: any, progress: any = null): Promise<T> {
    return new Promise<T>(function (resolve, reject) {
        let data: FormData = null;

        if (body) {
            data = new FormData()
            for (var key in body) {
                data.append(key, body[key])
            }
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.upload.onprogress = progress ? progress : function (e: ProgressEvent) {
            if (e.lengthComputable) {
                var pre = (e.loaded / e.total) * 100;
            }
        };

        xhr.onload = function (e: Event) {

            if (this.status == 200) {
                var resp = JSON.parse(this.response);
                resolve(resp);
            } else {
                reject(this.response);
            };
        };
        xhr.send(data);
    });
};

export function ft<T>(api_path_obj: ApiPathStruct, params: any = null) {
    if (api_path_obj.method == 'GET')
        return fetchGet<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'POST')
        return fetchPost<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'PUT')
        return fetchPut<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'DELETE')
        return fetchDelete<T>(gb_approot + api_path_obj.path, params);
}