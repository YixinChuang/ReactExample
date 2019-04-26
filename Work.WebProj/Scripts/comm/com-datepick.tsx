/* 承心 2017-08-05
** 編輯檢視日期共用元件 依據傳入 InputViewMode 屬性進行切換
*/
import React = require('react');
import moment = require('moment');
import DatePicker from 'react-datepicker';
import { stdChiDate, stdTime } from './comm-func';
import '../../Content/css/verder/react-datepicker.css';

interface DatePickTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string;
    required?: boolean;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
    showTimeSelect?: boolean;
    timeFormat?: string;
    placeholderText?: string;
    setSecondZero?: boolean
}
interface DatePickTextState {
}
export class DatePickText extends React.Component<DatePickTextProps, any>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        required: false,
        showTimeSelect: false,
        timeFormat: "HH:mm",
        setSecondZero: true,//設定秒數為0
        inputViewMode: InputViewMode.edit
    }
    onChange(date: moment.Moment) {

        let value = date == null ? null : (this.props.setSecondZero ? date.set({ second: 0 }).format() : date.format());
        this.props.onChange(value, this);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let value: moment.Moment = pp.value == undefined ? null : moment(pp.value);
        //console.log('Check DatePickText value', pp.value, value);
        let format = pp.showTimeSelect ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <div style={{ display: 'inline-block' }}>
                        <DatePicker
                            ref="dtpicker"
                            selected={value}
                            dateFormat={format}
                            isClearable={!pp.disabled}
                            required={pp.required}
                            locale="zh-tw"
                            showYearDropdown
                            showTimeSelect={pp.showTimeSelect}
                            timeFormat={pp.timeFormat}
                            onChange={this.onChange}
                            disabled={pp.disabled}
                            minDate={pp.minDate}
                            maxDate={pp.maxDate}
                            className={pp.inputClassName}
                            placeholderText={pp.placeholderText}
                        />
                    </div>
                );
        }
        let json_val = value ? value.toJSON() : '';
        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        className={this.props.viewClassName}>
                        {/*value.format(format)*/}
                        {`${stdChiDate(json_val)} ${pp.showTimeSelect ? stdTime(json_val) : ''}`}
                    </span>
                );
        }
        return out_html;
    }
}