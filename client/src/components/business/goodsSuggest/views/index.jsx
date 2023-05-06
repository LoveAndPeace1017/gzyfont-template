import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {asyncFetchGoodsByVal} from '../actions'

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {fromJS} from "immutable";
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

const {Option} = Select;

/**
 * 物品联想选择
 *
 * @visibleName GoodsSuggest(物品联想选择)
 * @author guozhaodong
 *
 */
class GoodsSuggest extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         */
        value: PropTypes.string,
        /**
         * 选中option或者value变化的回调函数
         * @param {string} value 选择的值
         */
        onChange: PropTypes.func,
        /**
         * 自定义的选择框后缀图标
         */
        suffixIcon: PropTypes.element,
        /**
         * 被选中时调用的函数
         * @param {object} value 选择的值
         */
        onSelect: PropTypes.func,
        /**
         * 文本框值变化时回调
         * @param {object} value 选择的值
         */
        onSearch: PropTypes.func,
        /**
         * 可输入最大字符长度
         */
        maxLength: PropTypes.number,
        /**
         * 是否仅仅能选择（不能输入值）
         */
        onlySelect: PropTypes.bool,
        /**
         * 样式
         */
        style: PropTypes.object,
        /**
         * 暗注释
         */
        placeholder: PropTypes.string,
        /**
         * 类型：物品编号、物品名称
         */
        type: PropTypes.oneOf(['displayCode', 'name']).isRequired,
        /**
         *   传递给选择物品弹层的参数
         **/
        goodsPopCondition: PropTypes.object,
    };

    static defaultProps = {
        maxLength: 100
    };

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || '';

        this.state = {
            data: fromJS([]),
            value
        };
    }


    handleSearch = (value) => {
        const maxLength = this.props.maxLength;
        if(value && value.length<= maxLength) {
            this.props.asyncFetchGoodsByVal(value, this.props.type, this.props.goodsPopCondition, data => {
                this.setState({
                    data
                })
            });

            if (!this.props.onlySelect) {
                this.setState({value});
                this.triggerChange(value);
            }

            const onSearch = this.props.onSearch;
            if (onSearch) {
                onSearch();
            }
        }

    };

    handleChange = (value, option) => {
        if(!value) {
            if (!('value' in this.props)) {
                this.setState({
                    value
                });
            }

            this.triggerChange(value, option && option.props.goods)
        }
    };

    //只要选中就会触发，基于上面change实现不了所以就用select事件，但是如果清楚输入框的值是不能触发这个事件的，所以还需要上面change事件来弥补
    handleSelect = (value, option) => {
        value = this.props.type === 'name' ? option.props.goods.prodName : value;
        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }

        this.triggerChange(value, option && option.props.goods);
    };

    triggerChange = (changedValue, goods) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue, goods);
        }
    };

    render() {
        let {suggestGoods, onlySelect, goodsPopCondition, asyncFetchGoodsByVal, ...restProps} = this.props;
        return (
            <Select
                {...restProps}
                value={this.state.value !== ''? this.state.value: undefined}
                showSearch
                allowClear
                showArrow={this.props.suffixIcon ? true : false}
                defaultActiveFirstOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                filterOption={false}
                placeholder={this.props.placeholder}
                style={this.props.style}
                maxLength={this.props.maxLength}
                dropdownStyle={{width: '424px'}}
                dropdownMatchSelectWidth={false}
                suffixIcon={this.props.suffixIcon}
                className={cx("suggest")}
                dropdownClassName={cx("suggest-dropdown")}
                optionLabelProp={"value"}
            >
                {
                    this.state.data && this.state.data.size>0 && this.state.data.map(item =>
                        <Option
                            key={item.get('code')}
                            value={item.get('displayCode')}
                            goods={{
                                ...item.toJS(),
                                productCode: item.get('code'),
                                prodCustomNo: item.get('displayCode'),
                                prodName: item.get('name'),
                                unit: item.get('unit'),
                                brand: item.get('brand'),
                                produceModel: item.get('produceModel'),
                                // barCode: item.get('barCode'),
                                descItem: item.get('description'),
                                orderPrice: item.get('orderPrice'),
                                salePrice: item.get('salePrice'),
                                expirationFlag: item.get('expirationFlag')
                            }}
                        >
                            <div className={cx("prod-list")}>
                                {
                                    this.props.type === 'displayCode' ? (
                                        <span className={cx("prod-no")}>
                                            {item.get('displayCode')}
                                        </span>
                                    ) : null
                                }
                                <span className={cx("prod-name")}>
                                    {item.get('name')}
                                </span>
                                <span className={cx("prod-item-spec")}>
                                    {item.get('description')}
                                </span>
                                <span className={cx("prod-unit")}>
                                    {item.get('unit')}
                                </span>
                            </div>
                        </Option>
                    )
                }
            </Select>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        suggestGoods: state.getIn(['saleAdd', 'suggestGoods'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsByVal
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(GoodsSuggest)
