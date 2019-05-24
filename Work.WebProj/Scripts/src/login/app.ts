interface LoginData {
    account?: string;
    password?: string;
    validate?: string;
}
interface LoginResult {
    result: boolean;
    message: string;
    url: string;
    state: number;
}
declare var lg_vcode: string;
var mask_div_id = 'mask_unique_login';

var mask_show = function (text) {
    //let body = document.getElementById('wrapper');
    var body = document.getElementsByTagName("BODY")[0];
    var _div = document.createElement('div');
    _div.id = mask_div_id;
    _div.className = 'loading';
    _div.innerHTML = '<div class="loader" data-loader="circle-side"></div><p>' + text + '</p>';
    body.appendChild(_div);
}
var mask_off = function () {
    var body = document.getElementsByTagName("BODY")[0];
    var _div = document.getElementById(mask_div_id);
    body.removeChild(_div);
}
function ReSetVcImg() {
    //驗證碼圖片重取
    $("#m_login_img").attr("src", gb_approot + "Ah/VC.ashx?vn=" + lg_vcode + "&t" + (new Date()).getTime());
}
$("#tab1").submit(function (event) {
    event.preventDefault();
    var data: LoginData = {
        "account": $("#m_act").val().toString(),
        "password": $("#m_pwd").val().toString(),
        "validate": $("#m_Validate").val().toString(),//$("#g-recaptcha-response").val(),
    };

    mask_show('登錄中...');
    $.ajax({
        type: "POST",
        url: gb_approot + 'Home/loginCheck',
        data: data,
        dataType: 'json'
    }).done(function (data) {

        if (data.state == 0) {
            document.location.href = data.url;
        }
        else if (data.state > 0) {
            ReSetVcImg();
            $("#m_pwd").val("");
            alert(data.message);
            mask_off();
        }
        else {
            ReSetVcImg();
            $("#m_pwd").val("");
            alert('請按“F5”重新更新畫面後再登入，如仍無法登錄請聯絡管理員。')
            mask_off();
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        ReSetVcImg();
        mask_off();
        alert(errorThrown);
    });
});