import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchSupplierByVal} from '../actions'
import PropTypes from "prop-types";

const {Option} = Select;

/**
 * 供应商下拉联想选择框
 *
 * @visibleName SelectSupplier（供应商选择框）
 * @author guozhaodong
 */
class SelectSupplier extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         * */
        value: PropTypes.shape({
            key: PropTypes.string,
            label: PropTypes.string
        }),
        /**
         * 选中option的回调函数
         * @param {object} LabeledValue 选择的值
         */
        onChange: PropTypes.func,
        /**
         * 被选中时调用的函数
         * @param {object} LabeledValue 选择的值
         */
        onSelect: PropTypes.func,
        /**
         * 文本框值变化时回调
         * @param {object} LabeledValue 选择的值
         */
        onSearch: PropTypes.func,
        /**
         * 可输入最大字符长度
         * */
        maxLength: PropTypes.number,
        /**
         * 是否禁用
         * */
        disabled: PropTypes.bool,
        /**
         * 是否仅仅能选择（不能输入值）
         * */
        onlySelect: PropTypes.bool,
        /**
         * 样式
         * */
        style: PropTypes.object,
        /**
         * 暗注释
         * */
        placeholder: PropTypes.string
    };

    static defaultProps = {
        onlySelect: false,
        maxLength: 50
    };

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || {};

        this.state = {
            key: value.key || '',
            label: value.label || '',
        };
    }


    handleSearch = (value) => {
        const maxLength = this.props.maxLength;
        if(value && value.length<= maxLength) {
            this.props.asyncFetchSupplierByVal(value);

            if(!this.props.onlySelect){
                const valueObj ={
                    key: '',
                    label: value
                };

                this.setState(valueObj);
                this.triggerChange(valueObj);
            }

            const onSearch = this.props.onSearch;
            if (onSearch) {
                onSearch();
            }
        }
    };

    handleChange = (value) => {
        const valueObj = value ? value : {
            key: '',
            label: ''
        };
        if (!('value' in this.props)) {
            this.setState({
                ...valueObj
            });
        }

        this.triggerChange(valueObj)
    };

    handleSelect = (value, option)=>{
        const onSelect = this.props.onSelect;
        if (onSelect) {
            onSelect(value, option.props.allinfo);
        }
    };

    handleBlur=(value)=>{
        const {suggestSupplier} = this.props;

        const supplierList = suggestSupplier && suggestSupplier.getIn(['data', 'data']);
        supplierList && supplierList.forEach(item=>{
            if(item.get('name') === value.label){
                const valueObj = {
                    label: value.label,
                    key: item.get('code')
                };
                if (!('value' in this.props)) {
                    this.setState({
                        ...valueObj
                    });
                }
                this.props.onBlur && this.props.onBlur(valueObj)
            }
        });
    };

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    };

    componentDidMount() {
        this.props.asyncFetchSupplierByVal();
    }

    render() {
        const {suggestSupplier} = this.props;

        const supplierList = suggestSupplier && suggestSupplier.getIn(['data', 'data']);
        return (
            <Select
                value={{key: this.state.key, label: this.state.label}}
                showSearch
                allowClear={!!this.state.label}
                defaultActiveFirstOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                filterOption={false}
                placeholder={this.props.placeholder}
                style={{...this.props.style, minWidth: '200px'}}
                maxLength={this.props.maxLength}
                labelInValue
                onBlur={this.handleBlur}
                // mode={'multiple'}
            >
                {
                    supplierList&& supplierList.map(item =>
                        <Option key={item.get('id')} value={item.get('code')} allinfo={{...item.toJS()}}>
                            {item.get('name')}
                        </Option>
                    )
                }
            </Select>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        suggestSupplier: state.getIn(['supplierIndex', 'suggestSupplier'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSupplierByVal
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectSupplier)
