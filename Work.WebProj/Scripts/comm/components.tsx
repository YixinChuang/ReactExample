/* 承心 2016-08-09
** 編輯檢視共用元件 依據傳入 InputViewMode 屬性進行切換
*/
import React = require('react');
import ReactDOM = require('react-dom');
import { twDistrict } from './twDistrict';
import { makeInputValue, isNumeric, fmtMoney } from './comm-func';

//Input
interface InputTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    type?: string;
    id?: string;
    required?: boolean;
    maxLength?: number;
    onBlur?: React.EventHandler<React.FocusEvent<EventTarget>>;
    onFocus?: React.EventHandler<React.FocusEvent<EventTarget>>;
    ref?: string | any;
    tabIndex?: number;
    patternString?: string;
    patternInfo?: string;
    onInput?: string;
    autoFocus?: string;
    onclick?: string;
    placeholder?: string
    notChinese?: boolean;
}
export class InputText extends React.Component<InputTextProps, any>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.prvText = null;
    }
    prvText: string | number
    static defaultProps = {
        type: 'text',
        disabled: false,
        inputViewMode: InputViewMode.edit,
        notChinese: false
    }
    onChange(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);
        this.props.onChange(value, e);
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;
        let set_value = value;
        let testZH = (src) => {
            for (var i = 0; i < src.length; i++) {
                if (src.charCodeAt(i) > 255) {
                    return true;
                }
            }
            return false;
        }

        if (this.props.notChinese && testZH(value))  //如果不能是中文
            set_value = this.prvText;
        else
            this.prvText = value;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <input
                        id={this.props.id}
                        type={this.props.type}
                        className={this.props.inputClassName}
                        width={this.props.width}
                        style={this.props.style}
                        value={set_value}
                        onChange={this.onChange}
                        disabled={this.props.disabled}
                        required={this.props.required}
                        maxLength={this.props.maxLength}
                        onBlur={this.props.onBlur}
                        onFocus={this.props.onFocus}
                        tabIndex={this.props.tabIndex}
                        pattern={this.props.patternString}
                        title={this.props.patternInfo}
                        placeholder={this.props.placeholder}
                    />
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        id={this.props.id}
                        className={this.props.viewClassName}>
                        {set_value}
                    </span>
                );
        }
        return out_html;
    }
}

//Input 只能輸入數字
interface InputNumProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    id?: string;
    required?: boolean;
    maxLength?: number;
    onBlur?: Function;
    onFocus?: React.EventHandler<React.FocusEvent<EventTarget>>;
    tabIndex?: number;
    group?: string;
    ref?: string;
    max?: number;
    min?: number;
    dataFor?: string;
    dataTip?: boolean;
    title?: string;
    hidden?: boolean;
    moneyFmt?: boolean;
    readyonly?: boolean;
    onlyPositive?: boolean; //只能為正數
    point?: boolean | number;//是否有小數點
    decimalPointLimit?: number; //小數點限制位數
}
interface InputNumState {
    show_value?: any
    prv_value?: any
    neg_sign_flag?: boolean
}
export class InputNum extends React.Component<InputNumProps, InputNumState>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.state = {
            show_value: '',
            prv_value: '',
            neg_sign_flag: false
        };
    }
    static defaultProps = {
        type: 'text',
        disabled: false,
        inputViewMode: InputViewMode.edit,
        only_positive: true,
        moneyFmt: true,
        point: true,
        decimalPointLimit: 0,
    }
    is_get_value = false;
    /**
     * 檢查數值不可 undefined*
     * @param v
     */
    checkVal(v) {
        if (v === undefined)
            return '';
        else
            return v;
    }
    componentDidMount() {
        const pp_value = this.checkVal(this.props.value);
        this.setState({ show_value: pp_value, prv_value: pp_value });
    }

    componentWillUpdate(nextProps, nextState) {
        //if (this.props.id == "new_building")
        //    console.log('componentWillUpdate', this.props.id, this.props.value, nextProps.value, nextState.show_value);
        //此段 換值時 但上層元件如有做value復元動作  要在此做還原動作
        if (isNumeric(this.props.value) && isNumeric(nextState.show_value) && this.props.value != nextState.show_value) {
            //console.log('change')
            nextState.show_value = this.props.value;
        }
    }
    componentDidUpdate(prevProps, prevState) {

        if (this.props.value != prevProps.value && isNumeric(this.props.value)) {
            const pp_value = this.props.value;
            this.setState({ prv_value: pp_value, show_value: pp_value })
        } else if (this.props.value != prevProps.value && (this.props.value == null || this.props.value == '')) {
            this.setState({ prv_value: '', show_value: '' })
        }
    }
    //小數點計算
    countDecimalPlaces(number) {
        var str = "" + number;
        var index = str.indexOf('.');
        if (index < 0) {
            return 0;
        } else {
            return str.split('.')[1].length;
        }
    }
    onChange(e: React.SyntheticEvent<EventTarget>) {

        if (this.props.onChange == undefined || this.props.onChange == null)
            return;

        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = input.value;
        //this.state['neg_sign_flag'] = false;
        //console.log('check value', value);

        if (value === null || value === '' || value === null || value === undefined) {
            this.setState({ prv_value: '', show_value: '' })
            this.props.onChange('', e);
            //console.log('num 1 value');
        } else {
            //console.log('num 2 value');
            if (this.props.decimalPointLimit > 0) {
                if (this.countDecimalPlaces(value) > this.props.decimalPointLimit) {
                    return;
                }
            }
            //console.log('value', value, 'isNumeric', isNumeric(value));
            if (value == '-' && !this.props.onlyPositive) { //可輸入負號
                //console.log('num 3 value');
                this.setState({ show_value: '-', prv_value: value })
                this.props.onChange(0, e);
            } else if (value == '-' && this.props.onlyPositive) { //不可輸入負號
                //console.log('num 4 value');
                this.setState({ show_value: '', prv_value: '' })
                this.props.onChange('', e);
            } else if (value == '.' && this.props.point) {//第一位可先打小數點
                this.setState({ show_value: '.', prv_value: value })
                this.props.onChange(0, e);
            } else if (isNumeric(value)) {
                //console.log('num 6 value');
                let n = parseFloat(value);

                if (this.props.onlyPositive && n < 0) { //不可輸入負號 值卻小於０
                    //console.log('num 7 value');
                    const prv_value = this.state.prv_value === undefined ? '' : this.state.prv_value;
                    this.setState({ show_value: prv_value })
                    this.props.onChange(prv_value, e);
                } else if (!this.props.point && value.indexOf('.') > -1) {//不可輸入小數點            
                    const prv_value = this.state.prv_value === undefined ? '' : this.state.prv_value;
                    this.setState({ show_value: prv_value })
                    this.props.onChange(prv_value, e);
                }
                else {
                    //console.log('num 8 value');
                    if (n == 0 && !(value.indexOf('.') > -1)) {//打0.顯示value
                        //console.log('num9 value');
                        this.setState({ show_value: n, prv_value: n }) //打000也是數字0
                    } else {
                        //console.log('num 10 value');
                        this.setState({ show_value: value.trim(), prv_value: n }) // 123. 經parseFloat會變成 123
                    }
                    //console.log('num 11 value');
                    this.props.onChange(n, e);
                }

            } else {
                //console.log('num 12 value', this.state.prv_value);
                //console.log('not set')
                const prv_value = (this.state.prv_value === undefined || this.state.prv_value === null) ? '' : this.state.prv_value;
                this.setState({ show_value: prv_value })
                this.props.onChange(prv_value, e);
            }
        }
    }
    onBlur(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = input.value;
        let pp = this.props;
        if (value === '-') {
            //console.log(value);
            this.setState({ show_value: '', prv_value: '' })
            pp.onChange('', e);
        } else {
            let v = this.checkVal(pp.value);//過濾undefined tostring error
            if (pp.min != undefined && pp.min != null && v.toString() != '' && pp.value < pp.min) {
                this.setState({ show_value: '', prv_value: '' })
                pp.onChange('', e);
            }

            if (pp.max != undefined && pp.max != null && v.toString() != '' && pp.value > pp.max) {
                this.setState({ show_value: '', prv_value: this.state.prv_value })
                alert(`最大值不可超過${pp.max}!`);
                pp.onChange('', e);
            }
        }
        if (this.props.onBlur)
            this.props.onBlur(e)
    }
    //shouldComponentUpdate(nextProps: InputNumProps, nextState) {
    //    let pp = this.props;
    //    let st = this.state;
    //    if (pp.value != nextProps.value)
    //        return true;
    //    else
    //        return false
    //}
    render() {

        //console.log('InputNum','value check', this.state.show_value, this.props.value);
        //console.log('InputNum', 'inputViewMode check', this.props.inputViewMode, this.state.show_value);

        let out_html = null;
        let pp = this.props;

        let set_style: React.CSSProperties = null;
        if (this.props.style)
            set_style = this.props;
        else
            if (this.props.hidden)
                set_style = { display: 'none' };

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <input
                        id={pp.id}
                        type="text"
                        className={pp.inputClassName}
                        width={pp.width}
                        style={pp.style}
                        value={(this.state.show_value != null) ? this.state.show_value : ''}
                        onChange={this.onChange}
                        disabled={pp.disabled}
                        required={pp.required}
                        maxLength={pp.maxLength}
                        onBlur={this.onBlur}
                        onFocus={pp.onFocus}
                        tabIndex={pp.tabIndex}
                        data-group={pp.group}
                        title={pp.title}
                        data-for={pp.dataFor}
                        data-tip={pp.dataTip}
                        readOnly={pp.readyonly}
                    />
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        id={this.props.id}
                        className={this.props.viewClassName}>
                        {pp.moneyFmt ? fmtMoney(this.state.show_value) : this.state.show_value}
                    </span>
                );
        }
        return out_html;
    }
}

//PW_Button
interface PWButtonProps {
    inputClassName?: string;
    title?: string;
    onClick?: React.EventHandler<React.MouseEvent<EventTarget>>;
    id?: string;
    className?: string;
    dataGlyph?: string
    enable?: boolean;
    type?: string;
    style?: React.CSSProperties;
    hidden?: boolean;
    name?: string;
    dataForm?: string;
}
export class PWButton extends React.Component<PWButtonProps, any>{

    constructor(props) {
        super(props);
    }
    static defaultProps = {
        enable: true,
        type: 'button',
        hidden: false,
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let set_style: React.CSSProperties = null;
        if (pp.style)
            set_style = pp.style;
        else
            if (this.props.hidden)
                set_style = { display: 'none' };

        let enabled = pp.enable;

        out_html =
            (
                <button type={pp.type}
                    title={pp.title}
                    name={pp.name}
                    className={pp.className}
                    onClick={pp.onClick}
                    disabled={!enabled}
                    id={pp.id}
                    style={set_style}
                    data-glyph={pp.dataGlyph}
                    form={pp.dataForm}>
                    {pp.children}
                </button>
            );
        return out_html;
    }
}

interface SelectTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    id?: string;
    options?: Array<SelectTextOptions>;
    required?: boolean;
    is_blank?: boolean;
    blank_text?: string;
    show_type?: SelectShowType;
    ref?: string | any;
    group?: string;
    is_int_type?: boolean;
    dataCol?: string;
    style?: React.CSSProperties;
    optgroup?: boolean;//option有群組?
}
export class SelectText extends React.Component<SelectTextProps, any>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        required: false,
        is_blank: false,
        blank_text: '請選擇',
        show_type: SelectShowType.label,
        is_int_type: false,
        optgroup: false
    }
    refs: {
        [key: string]: (Element);
        select: any;
    }
    componentDidMount() {
        SetSelectEdge(this.refs.select);
    }

    componentDidUpdate(prevProps, prevState) {
        SetSelectEdge(this.refs.select);
    }

    onChange(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);

        if (value !== undefined && value !== null && this.props.is_int_type) {
            this.props.onChange(parseFloat(value), e);
        } else {
            this.props.onChange(value, e);
        }
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value.toString();
        if (this.props.inputViewMode == InputViewMode.edit) {

            let blank_option = this.props.is_blank ? <option value="" >{this.props.blank_text}</option> : '';

            out_html =
                (
                    <select ref="select"
                        id={this.props.id}
                        style={this.props.style}
                        className={this.props.inputClassName}
                        value={value}
                        onChange={this.onChange}
                        disabled={this.props.disabled}
                        required={this.props.required}
                        data-col={this.props.dataCol}
                        data-group={this.props.group}>
                        {blank_option}
                        {!this.props.optgroup ?
                            this.props.options.map((item, i) => {
                                if (item.value == this.props.value) {
                                    return <option key={i} value={item.value} defaultValue={item.value}>{item.label}</option>
                                } else {
                                    return <option key={i} value={item.value}>{item.label}</option>
                                }
                            }) :
                            this.props.options.map((item, i) => {
                                return <optgroup key={"g-" + i} label={item.label}>
                                    {
                                        item.sub.map((subitem, j) => {
                                            if (item.value == this.props.value) {
                                                return <option key={`sub-${i}-${j}`} value={subitem.value} defaultValue={subitem.value}>{subitem.label}</option>
                                            } else {
                                                return <option key={`sub-${i}-${j}`} value={subitem.value}>{subitem.label}</option>
                                            }
                                        })
                                    }
                                </optgroup>
                            })
                        }
                    </select>
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html = <span className={this.props.viewClassName} id={this.props.id}></span>; //無
            if (this.props.optgroup) {
                this.props.options.forEach((item, i) => {
                    item.sub.forEach((subitem, j) => {
                        if (item.value == this.props.value) {
                            if (this.props.show_type == SelectShowType.label)
                                out_html = <span id={this.props.id} className={this.props.viewClassName}>{subitem.label}</span>

                            if (this.props.show_type == SelectShowType.value)
                                out_html = <span id={this.props.id} className={this.props.viewClassName}>{subitem.value}</span>
                        }
                    })
                })
            } else {
                this.props.options.forEach((item, i) => {
                    if (item.value == this.props.value) {
                        if (this.props.show_type == SelectShowType.label)
                            out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.label}</span>

                        if (this.props.show_type == SelectShowType.value)
                            out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.value}</span>
                    }
                })
            }
        }
        return out_html;
    }
}

//floor元件
interface PageFooterProps {
    search: any,
    page_grid?: GridInfo<any>,
    callPage: Function
}
export class PageFooter extends React.Component<PageFooterProps, any>{

    constructor(props) {
        super(props);
        this.packSearch = this.packSearch.bind(this);
        this.clkFirstPage = this.clkFirstPage.bind(this);
        this.clkPrvePage = this.clkPrvePage.bind(this);
        this.clkNextPage = this.clkNextPage.bind(this);
        this.clkLastPage = this.clkLastPage.bind(this);
        this.clkJumpPage = this.clkJumpPage.bind(this);
        this.state = {
        };
    }
    packSearch(p) {
        const r = Object.assign(this.props.search, p);
        return r;
    }
    clkLastPage(e) {
        const p = this.packSearch({ page: this.props.page_grid.total });
        this.props.callPage(p);
    }
    clkNextPage(e) {
        const page = this.props.page_grid.page + 1;
        const p = this.packSearch({ page: page });
        this.props.callPage(p);
    }
    clkPrvePage(e) {
        const page = this.props.page_grid.page - 1;
        const p = this.packSearch({ page: page });
        this.props.callPage(p);
    }
    clkFirstPage(e) {
        let p = this.packSearch({ page: 1 });
        this.props.callPage(p);
    }
    clkJumpPage(e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let p = this.packSearch({ page: input.value });
        this.props.callPage(p);
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;

        let page = pp.page_grid.page ? pp.page_grid.page : 1;

        out_html = <footer className="table-foot">
            <small className="pull-right">第 {pp.page_grid.startcount}-{pp.page_grid.endcount} 筆，共 {pp.page_grid.records} 筆</small>
            <nav className="pager">
                <button type="button" className="oi" data-glyph="media-step-backward" title="到最前頁" onClick={this.clkFirstPage} disabled={page <= 1} >《 </button>
                <button type="button" className="oi" data-glyph="chevron-left" title="上一頁" onClick={this.clkPrvePage} disabled={page <= 1} >＜</button>
                <span>
                    第
                        <input className="form-element" type="number" value={page} onChange={this.clkJumpPage} />
                    頁，共 {pp.page_grid.total}頁
                            </span>
                <button type="button" className="oi" title="下一頁" data-glyph="chevron-right" onClick={this.clkNextPage} disabled={page >= pp.page_grid.total} >＞</button>
                <button type="button" className="oi" title="到最後頁" data-glyph="media-step-forward" onClick={this.clkLastPage} disabled={page >= pp.page_grid.total} >》</button>
            </nav>
        </footer>;
        return out_html;
    }
}

interface TwAddressProps extends React.Props<any> {
    inputViewMode?: InputViewMode,
    inputClassName?: string,
    onChange: Function,
    zip_value: string,
    city_value: string,
    country_value: string,
    address_value: string,
    required?: boolean,
    disabled?: boolean
}
export interface TwValue {
    zip: string,
    city: string,
    country: string,
    address: string
}
export class TwAddress extends React.Component<TwAddressProps, any>{
    constructor(props) {
        super(props)
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);

        this.onZipChange = this.onZipChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.listCountry = this.listCountry.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            country_list: []
        };
    }
    static defaultProps = {
        inputViewMode: InputViewMode.edit,
        inputClassName: '',
        onChange: null,
        zip_value: null,
        city_value: null,
        country_value: null,
        address_value: null,
        required: false,
        disabled: false
    }
    refs: {
        [key: string]: (Element);
        city_idx: any;
        country_idx: any;
    }
    componentDidMount() {
        if (this.props.city_value != null) {
            this.listCountry(this.props.city_value);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.city_value != null && this.props.city_value != prevProps.city_value) {
            this.listCountry(this.props.city_value);
        }
        SetSelectEdge(this.refs.city_idx);
        SetSelectEdge(this.refs.country_idx);
    }

    onZipChange(e: React.SyntheticEvent<any>) {
        let input: HTMLSelectElement = e.target as HTMLSelectElement;
        var data = {
            zip_value: input.value,
            city_value: this.props.city_value,
            country_value: this.props.country_value,
            address_value: this.props.address_value,
        }
        this.props.onChange(data);
    }
    onCityChange(e: React.SyntheticEvent<any>) {
        let input: HTMLSelectElement = e.target as HTMLSelectElement;
        var data: TwValue = {
            zip: this.props.zip_value,
            city: input.value,
            country: this.props.country_value,
            address: this.props.address_value
        }
        this.listCountry(input.value);
        this.props.onChange(data);
    }
    onCountryChange(e: React.SyntheticEvent<any>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let zip_value = null;

        for (var i in this.state.country_list) {
            var item = this.state.country_list[i];
            if (item.county == input.value) {
                zip_value = item.zip;
                break;
            }
        }

        var data: TwValue = {
            zip: zip_value,
            city: this.props.city_value,
            country: input.value,
            address: this.props.address_value
        }
        this.props.onChange(data);
    }
    onAddressChange(e: React.SyntheticEvent<any>) {
        let input: HTMLSelectElement = e.target as HTMLSelectElement;
        let value = (input.value === ' ' || input.value === '　') ? '' : input.value;
        var data: TwValue = {
            zip: this.props.zip_value,
            city: this.props.city_value,
            country: this.props.country_value,
            address: value
        }
        this.props.onChange(data);
    }
    listCountry(value) {

        if (value == null || value == undefined || value == '') {
            this.setState({ country_list: [] });
        }
        else {
            for (var i in twDistrict) {
                var item = twDistrict[i];
                if (item.city == value) {
                    this.setState({ country_list: item.contain });
                    break;
                }
            }
        }
    }
    render() {
        var out_html = null;
        let pp = this.props;

        //避免 null or undefined 錯誤
        let city_value = pp.city_value ? pp.city_value : '';
        let country_value = pp.country_value ? pp.country_value : '';
        let address_value = pp.address_value ? pp.address_value : '';

        if (pp.inputViewMode == InputViewMode.edit) {
            out_html = (
                <div>
                    <span className="form-label addr-zip">{pp.zip_value}</span>
                    <select
                        ref="city_idx"
                        className="form-element inline mb-4"
                        style={{ width: '100px' }}
                        value={city_value}
                        onChange={this.onCityChange}
                        required={pp.required}
                        disabled={pp.disabled}>
                        <option value="" hidden></option>
                        {
                            twDistrict.map(function (itemData, i) {
                                return <option key={itemData.city} value={itemData.city}>{itemData.city}</option>;
                            })
                        }
                    </select>
                    <select
                        ref="country_idx"
                        className="form-element inline mb-4"
                        style={{ width: '100px' }}
                        value={country_value}
                        onChange={this.onCountryChange}
                        required={pp.required}
                        disabled={pp.disabled}>
                        <option value="" hidden></option>
                        {
                            this.state.country_list.map(function (itemData, i) {
                                return <option key={itemData.county} value={itemData.county}>{itemData.county}</option>;
                            })
                        }
                    </select>
                    <input type="text"
                        className="form-element"
                        value={address_value}
                        onChange={this.onAddressChange}
                        maxLength={128}
                        required={pp.required}
                        disabled={pp.disabled} />
                </div>
            );
        }

        if (pp.inputViewMode == InputViewMode.view) {
            out_html = (<span>{pp.zip_value}-{pp.city_value}{pp.country_value}{pp.address_value}</span>);
        }

        return out_html;
    }
}
/**
 * Edge瀏覽器BGU 修正下拉式選單會無法預設值問題
 * @param obj
 */
export const SetSelectEdge = (obj: any) => {

    if (!/Edge\/\d./i.test(navigator.userAgent)) {
        return;
    }
    //console.log('Edge');
    let selectedIndex = -1;
    if (obj) {
        selectedIndex = obj.selectedIndex;
    }

    if (selectedIndex >= 0) {
        const inputDOM = ReactDOM.findDOMNode(obj);

        let tempOption;
        if (inputDOM.childNodes.length === 1) {
            tempOption = document.createElement('option');
            inputDOM.appendChild(tempOption);
        }

        const options = obj.options;
        const tempIndex = (selectedIndex + 1) % options.length;
        options[tempIndex].selected = true;
        options[selectedIndex].selected = true;

        if (tempOption) {
            inputDOM.removeChild(tempOption);
        }
    }
}