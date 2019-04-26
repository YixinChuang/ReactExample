/**
    系統名稱:  資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
import { render } from 'react-dom';
import update = require('react-addons-update');
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DatePickText } from '../../comm/com-datepick';
import {
    PWButton, SelectText, InputText, InputNum, PageFooter, TwAddress, TwValue
} from '../../comm/components';
import {
    mf, store, options_state,
    setQueryValue, callPage, returnGrid, setPage,
    setInputValue, addState, callEdit, callRemove, submitData
} from './pub'
import { stdChiDate } from '../../comm/comm-func';

//頂端元件
interface TopNodeProps {
}
class TopNode extends React.Component<TopNodeProps, any>{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let pp = this.props;
        return <div>
            <GridView />{/*列表畫面*/}
            <EditView />{/*編輯畫面*/}
        </div>;
    }
}

//列表介面元件
interface GridProps {
    //列表搜尋參數
    search?: {
        keyword: string,
    },
    oper_id?: string,//設定特殊事件時產生隨機亂碼
    edit_type?: IEditType,//修改狀態(新增insert、修改modify、無:none) none時畫面要在列表介面
    page_grid?: GridInfo<server.Member>,//列表資料
    setQueryValue?: Function,//修改 列表搜尋參數
    setPage?: Function,//設定列表資料參數
    addState?: Function,//定義Member新增時預設值 並進入編輯畫面
    callEdit?: Function,//呼叫api取得單一Member資料 並進入編輯畫面
    callRemove?: Function//呼叫api刪除一筆Member資料
    callPage?: Function,//呼叫api取得Member列表資料
}
class Grid extends React.Component<GridProps, any>{

    constructor(props) {
        super(props);
        this.chgQryVal = this.chgQryVal.bind(this);
        this.packSearch = this.packSearch.bind(this);
        this.clkSearch = this.clkSearch.bind(this);
        this.callEdit = this.callEdit.bind(this);
        this.clkAdd = this.clkAdd.bind(this);
        this.reloadQuery = this.reloadQuery.bind(this);
        this.callRemove = this.callRemove.bind(this);

        this.keep_search = {};
        this.keep_field = null;
        this.keep_sort = null;
        this.state = {};
    }
    componentDidUpdate(prevProps, prevState) {
        let pp = this.props
        if (prevProps.oper_id != pp.oper_id) {
            this.reloadQuery(null);
        }
    }
    keep_search;
    keep_field;
    keep_sort;
    //更新 列表搜尋參數
    chgQryVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        let struct = {
            [name]: { $set: value }
        };
        let n_state = update(this.props.search, struct);
        this.props.setQueryValue(n_state);

        //每當列表搜尋參數變更時,頁面參數要返回第一頁
        let structpage = {
            page: { $set: 1 }
        };
        let p_state = update(this.props.page_grid, structpage);
        this.props.setPage(p_state);
    }
    packSearch(p) {
        const r = Object.assign(this.props.search, p);
        return r;
    }
    //點擊搜尋按鈕更新列表資料
    clkSearch(e) {
        e.preventDefault();
        this.keep_search = Object.assign({}, this.props.search);
        var p = this.packSearch({ page: 1 });
        this.props.callPage(p);
    }
    //更新列表資料
    reloadQuery(page) {
        let toPage = page == null ? this.props.page_grid.page : page;
        const p = {
            page: toPage,
            _sort: this.keep_sort,
            _field: this.keep_field
        };
        let query_page = this.packSearch(p);
        this.props.callPage(query_page);
    }
    //編輯會員資料
    callEdit(id, e: React.SyntheticEvent<EventTarget>) {
        this.props.callEdit(id);
    }
    //新增會員資料
    clkAdd(e: React.SyntheticEvent<EventTarget>) {
        this.props.addState();
    }
    //刪除會員資料
    callRemove(id, e: React.SyntheticEvent<EventTarget>) {
        if (confirm("確定要刪除?")) {
            this.props.callRemove(id);
            this.reloadQuery(null);
        }
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;
        if (!pp.page_grid)
            return null;
        let row_data = pp.page_grid.rows;

        let show = pp.edit_type == IEditType.none ? 'block' : 'none';
        out_html = <div style={{ display: show }}>
            <div className="btn-group mb-8">
                <PWButton className="btn success oi" dataGlyph="plus" onClick={this.clkAdd}>新增</PWButton>
            </div>
            <form className="table-head form-inline" onSubmit={this.clkSearch}>
                <InputText
                    style={{ width: '225px' }}
                    inputClassName="form-element"
                    onChange={this.chgQryVal.bind(this, 'keyword')}
                    value={pp.search.keyword}
                    placeholder="請輸入關鍵字"
                /> {}
                <button type="submit" className="btn oi" data-glyph="magnifying-glass">查詢</button>
            </form>

            <table className="table-list table-striped table-hover">
                <thead>
                    <tr>
                        <th className="item-edit">編輯</th>
                        <th className="text-left">編號</th>
                        <th className="text-left">名稱</th>
                        <th className="text-left">生日</th>
                        <th className="text-left">地址</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={'row-' + i}>
                                <td className="item-edit">
                                    <PWButton key={"modify-" + i} className="hover-primary tooltip oi" title="修改" dataGlyph="pencil" onClick={this.callEdit.bind(this, item.id)}>修改</PWButton>
                                    <PWButton key={"delete-" + i} className="hover-danger oi" title="刪除" dataGlyph="trash" onClick={this.callRemove.bind(this, item.id)}>刪除</PWButton>
                                </td>
                                <td className="text-left">{item.id}</td>
                                <td className="text-left">{item.name}</td>
                                <td>{stdChiDate(item.birthday)}</td>
                                <td>{item.zip}{item.city}{item.country}{item.address}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            <PageFooter search={pp.search} page_grid={pp.page_grid} callPage={this.props.callPage} />
        </div >;
        return out_html;
    }
}

//編輯資料元件
interface EditProps {
    edit_type?: IEditType,//修改狀態(新增insert、修改modify、無:none) insert、modify時畫面要在修改介面
    field?: server.Member,//Member資料
    setInputValue?: Function,//修改 Member資料
    submitData?: Function,//更新 Member資料 至Server
    returnGrid?: Function//返回列表介面
}
class Edit extends React.Component<EditProps, any>{
    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.state = {
        };
    }
    //修改 Member資料 一般欄位
    chgFldVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let struct = {
            [name]: { $set: value }
        };
        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    //修改 Member資料 地址欄位
    onAddressChange(n_zip: string, n_city: string, n_area: string, n_address: string, v: TwValue) {
        let struct = {
            [n_zip]: { $set: v.zip },
            [n_city]: { $set: v.city },
            [n_area]: { $set: v.country },
            [n_address]: { $set: v.address },
        };
        let n_state = update(this.props.field, struct);
        this.props.setInputValue(n_state);
    }
    //更新 Member資料 至server
    submit(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        let id = this.props.field.id;
        this.props.submitData(id, this.props.edit_type, this.props.field);
        return;
    }
    //返回列表
    cancel(e) {
        this.props.returnGrid();
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;
        let show = pp.edit_type == IEditType.insert || pp.edit_type == IEditType.modify ? true : false;

        if (!show) return null;
        const vm = InputViewMode.edit;
        out_html = <div>
            <nav className="btn-group mb-24">
                <PWButton type="button" className="btn cancel oi" dataGlyph="chevron-left" onClick={this.cancel}>回到列表</PWButton>
            </nav>
            <form id="myForm" className="form-list" onSubmit={this.submit}>
                <table className="full bg-white">
                    <colgroup>
                        <col style={{ "width": "20%" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th className="item text-right"><sup className="help" title="必填">*</sup>名稱</th>
                            <td className="text-left">
                                <InputText
                                    inputViewMode={vm}
                                    inputClassName="form-element"
                                    onChange={this.chgFldVal.bind(this, mf.name)}
                                    value={pp.field.name}
                                    required={true}
                                    maxLength={50}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="item text-right"><sup className="help" title="必填">*</sup> 生日</th>
                            <td className="text-left">
                                <DatePickText
                                    inputViewMode={vm}
                                    inputClassName="form-element"
                                    onChange={this.chgFldVal.bind(this, mf.birthday)}
                                    value={pp.field.birthday}
                                    required={true}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="item text-right">地址</th>
                            <td className="text-left">
                                <TwAddress
                                    inputViewMode={vm}
                                    zip_value={pp.field.zip}
                                    city_value={pp.field.city}
                                    country_value={pp.field.country}
                                    address_value={pp.field.address}
                                    required={true}
                                    onChange={this.onAddressChange.bind(this, mf.zip, mf.city, mf.country, mf.address)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="item text-right">狀態</th>
                            <td className="text-left">
                                <SelectText
                                    inputViewMode={vm}
                                    inputClassName="form-element"
                                    onChange={this.chgFldVal.bind(this, mf.state)}
                                    value={pp.field.state}
                                    is_blank={true}
                                    blank_text="請選擇"
                                    options={options_state}
                                    required={true}
                                />
                            </td>
                        </tr>
                      
                    </tbody>
                </table>
                <footer className="submit-bar">
                    <PWButton type="submit" className="btn success oi offset-2" dataGlyph="circle-check">儲存</PWButton> {}
                    <PWButton type="button" className="btn cancel oi" dataGlyph="circle-x" onClick={this.cancel}>回到列表</PWButton>
                </footer>
            </form>
        </div >;
        return out_html;
    }
}
/*=========================Redux連接元件及Action=========================*/
//定義個畫面會使用到那些資料或事件

//定義 頂端元件 會使用到那些store資料
const TopNodeToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
    }
}
//定義 頂端元件 會使用到那些action事件
const TopNodeDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
    }, dispatch);
    return s;
}
//將 資料及事件 與畫面做連結
let TopNodeView = connect<{}, {}, {}>(TopNodeToProps, TopNodeDispatch)(TopNode)
//定義 列表元件 會使用到那些store資料
const GridToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        oper_id: state.oper_id
    }
}
//定義 列表元件 會使用到那些action事件
const GridDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        setQueryValue,
        callPage,
        callEdit,
        addState,
        callRemove,
        setPage,
    }, dispatch);
    return s;
}
//將 資料及事件 與畫面做連結
let GridView = connect<{}, {}, {}>(GridToProps, GridDispatch)(Grid)

//定義 編輯元件 會使用到那些store資料
const EditToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        field: state.field,
    }
}
//定義 編輯元件 會使用到那些action事件
const EditDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        callRemove,
        returnGrid,
        submitData,
    }, dispatch);
    return s;
}
//將 資料及事件 與畫面做連結
let EditView = connect<{}, {}, {}>(EditToProps, EditDispatch)(Edit)

async function Start() {
    var dom = document.getElementById('page_content');
    //將畫面及管理的資料做連結
    render(<Provider store={store}>
        <TopNodeView />
    </Provider>, dom);
    //呼叫callload事件抓取列表資料
    store.dispatch(callPage(null));
}

Start(); //程式啟動點
