import { guid } from './comm-func';

namespace MaskLoadingFunc {

    let mask_div_id = 'mask_unique_' + guid();
    export let mask_show = (text = '資料讀取中……') => {
        //let body = document.getElementById('wrapper');
        let body = document.getElementsByTagName("BODY")[0];
        let _div = document.createElement('div');
        _div.id = mask_div_id;
        _div.className = 'loading';
        _div.innerHTML = '<div class="loader" data-loader="circle-side"></div><p>' + text + '</p>';
        body.appendChild(_div);
    }
    export let mask_off = () => {
        let body = document.getElementsByTagName("BODY")[0];
        if (body) {
            let _div = document.getElementById(mask_div_id);
            if (_div)
                body.removeChild(_div);
        }
    }
}

export = MaskLoadingFunc;