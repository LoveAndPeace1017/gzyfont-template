import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form, Select, Input} from "antd";
const {Option} = Select;
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import {actions as addGoodsActions} from 'pages/goods/add';
import Base from './base';
import _ from "lodash";
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchUnits: addGoodsActions.asyncFetchUnits,
    }, dispatch)
};

@withRouter
@connect(null, mapDispatchToProps)
export default function withMultiUnit(WrappedComponent) {
    return class withMultiSpecGoods extends Base {
        constructor(props) {
            super(props);
            this.state = {
                optionGroupMap: {}
            }
        }

        // 获取焦点的回调事件
        handleOnFocus = () => {
            const {optionGroupMap} = this.state;
            let {productCode} = this.props;
            !optionGroupMap[productCode] && this.props.asyncFetchUnits(productCode, (res) => {
                if(res && res.retCode === '0'){
                    optionGroupMap[productCode] = res.data;
                    this.setState({optionGroupMap});
                }
            })
        };


        render(){
            let { dataPrefix,unitFlag} = this.props;
            let {optionGroupMap} = this.state;

            let unitColumn = {
                title: '单位',
                key: 'unit',
                dataIndex: 'unit',
                columnName: 'unit',
                width: 101,
                maxLength: 50,
                render: (text, record, index)=> {
                    let {key} = record;
                    return (
                        <React.Fragment>
                            {
                                (!unitFlag)?(
                                    <Form.Item
                                        name={[dataPrefix, key, 'unit']}
                                    >
                                        <Input className={cx("readOnly")} readOnly={true}/>
                                    </Form.Item>
                                ):(
                                    <Form.Item
                                        name={[dataPrefix, key, 'unit']}
                                    >
                                        <Select
                                            allowClear
                                            onDropdownVisibleChange={() => this.handleOnFocus()}
                                            style={{minWidth: this.props.minWidth}}>
                                            {
                                                optionGroupMap[this.props.productCode] && optionGroupMap[this.props.productCode].map((item, index) => (
                                                    <Option key={index} value={item.unitName}>
                                                        {item.unitName}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                )
                            }
                        </React.Fragment>
                    )
                }
            };


            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        unitColumn={unitColumn}
                    />
                </React.Fragment>
            )
        }
    }
}