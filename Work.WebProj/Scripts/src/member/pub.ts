/**
    系統名稱:會員資料管理
    檔案內容:共用設定
    2019-03-28  Ajoe   建立
*/
import { ft } from '../../comm/ajax';
import { guid } from '../../comm/comm-func';
import { mask_show, mask_off } from '../../comm/vwMaskLoading';
import ap from '../_path/MemberPath';
import cbnReduce from '../inc/cbnReduce';
import "babel-polyfill";

//定義 改變資料的動作 有哪些
export const ac = {
    load: 'load',//第一次載入頁面
    page: 'page',//取得列表資料
    setpage: 'setpage',//更新列表資料搜尋參數
    chgFdlVal: 'chgFdlVal',//修改編輯欄位
    chgQryVal: 'chgQryVal',//修改搜尋欄位
    submitOK: 'submitOK',//資料更新成功
    submitNot: 'submitNot',//資料更新失敗
    submitDel: 'submitDel',//資料刪除成功
    modify: 'modify',//資料修改狀態
    insert: 'insert',//資料新增狀態
    return: 'return',//返回列表葉面
};
//定義Member欄位有哪些
export const mf = {
    id: 'id',
    name: 'name',
    birthday: 'birthday',
    zip: 'zip',
    city: 'city',
    country: 'country',
    address: 'address',
    state:'state'
}
//狀態 下拉式選單內容
export const options_state: Array<SelectTextOptions> = [
    { value: "A", label: '啟用' },
    { value: "S", label: '停用' },
];
//-----------action事件(行為)管理 定義各事件,並依情況回傳資料 Start-----------
//修改 列表搜尋參數
export const setQueryValue = (search) => {
    return {
        type: ac.chgQryVal,
        search
    }
}
//修改 編輯欄位資料
export const setInputValue = (field) => {
    return {
        type: ac.chgFdlVal,
        field
    }
}
//呼叫api取得Member列表資料
export async function callPage(p) {
    mask_show("資料載入中...");
    let data = await ft<ReturnData<GridInfo<server.Member>>>(ap.Get_Member, p);
    mask_off();
    if (data.state > 0) {
        alert(data.message);
        return;
    }
    else {
        return {
            type: ac.load,
            data: data.data,
            exist: data.exist
        }
    }
}
//定義Member新增時預設值 並進入編輯畫面
export const addState = () => {
    let r: { type: string, data: server.Member } = {
        type: ac.insert,
        data: { //新增值初始化
            id: 0,
        }
    }
    return r;
}
//呼叫api取得單一Member資料 並進入編輯畫面
export async function callEdit(id) {
    mask_show("資料載入中...");
    let tm = { id };
    let data = await ft<ReturnData<server.Member>>(ap.Get_Member_Item, tm);
    mask_off();
    if (data.state > 0) {
        alert(data.message);
        return;
    }
    return {
        type: ac.modify,
        data: data.data
    };
}
//呼叫api刪除一筆Member資料
export async function callRemove(id) {

    mask_show("資料刪除中...");
    let tm = { id };
    let data = await ft<ReturnBase>(ap.Post_Member_Remove, tm);
    mask_off();
    if (data.state > 0) {
        alert(data.message);
    } else {
        alert("資料已刪除");
        return {
            type: ac.submitDel
        }
    }

}
//呼叫api 新增或修改一筆Member資料
export async function submitData(id: string | number, edit_type: IEditType, data: server.Member) {
    let tm = { id, md: data };
  
    if (edit_type == IEditType.modify) {
        mask_show("資料更新中...");
        let data = await ft<ReturnUpdate<any>>(ap.Post_Member_Modify, tm);
        mask_off();
         if (data.state > 0) {
             alert(data.message);
             return { type: ac.submitNot, field: data };
        }
         else {
             alert("更新成功!");
             return dispatch => {
                 dispatch({ type: ac.submitOK, field: tm.md });
             }
        }
    } else if (edit_type == IEditType.insert) {
        mask_show("資料新增中...");
        let data = await ft<ReturnUpdate<any>>(ap.Post_Member, tm);
        mask_off();
        if (data.state > 0) {
            alert(data.message);
            return { type: ac.submitNot, field: data };
        }
        else if (data.state == 0) {
            alert("新增成功!");
            return dispatch => {
                dispatch(callEdit(data.id));
            }
        }
    }
}
//從編輯畫面返回列表
export const returnGrid = () => {
    return {
        type: ac.return
    }
}
//設定列表資料參數
export const setPage = (data) => {
    let r = {
        type: ac.setpage,
        data
    }
    return r;
}
//-----------action事件(行為)管理 定義各事件,並依情況回傳資料 End-----------

//-----------store資料管理 儲存各資料,並管理何時更新 Start-----------

//列表資料
const page_grid = (state: GridInfo<server.Member> = { rows: [] }, action): GridInfo<server.Member> => {
    switch (action.type) {
        case ac.load:
            return action.data;
        case ac.page:
            return action.data;
        case ac.setpage:
            return action.data
        default:
            return state;
    }
}
//列表搜尋參數
const search = (state = {}, action) => {
    switch (action.type) {
        case ac.chgQryVal:
            return action.search;
        default:
            return state;
    }
}
//設定特殊事件時產生隨機亂碼
const oper_id = (state = guid(), action) => {
    switch (action.type) {
        case ac.submitOK:
            return guid();
        case ac.submitDel:
            return guid();
        case ac.chgQryVal: //自動查詢
            return guid();
        case ac.return:
            return guid();
        default:
            return state
    }
}
//修改狀態(新增insert、修改modify、無:none)
const edit_type = (state = IEditType.none, action): IEditType => {
    switch (action.type) {
        case ac.insert:
            return IEditType.insert;
        case ac.modify:
            return IEditType.modify;
        case ac.submitOK:
            return IEditType.modify;
        case ac.return:
            return IEditType.none;
        default:
            return state;
    }
}
//Member資料
const field = (state = {}, action): server.Member => {
    switch (action.type) {
        case ac.insert:
            return action.data
        case ac.modify:
            return action.data
        case ac.chgFdlVal:
            return action.field;
        case ac.submitOK:
            return action.field;
        case ac.return:
            return {};
        default:
            return state
    }
}
//-----------store資料管理 儲存各資料,並管理何時更新 End-----------

export let store = cbnReduce({
    oper_id, search, page_grid,
    edit_type, field
});