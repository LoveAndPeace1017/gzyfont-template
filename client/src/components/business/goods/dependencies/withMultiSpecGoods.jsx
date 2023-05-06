import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input, Form, message} from "antd";
import {EllipsisOutlined} from '@ant-design/icons';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {formatCurrency, removeCurrency} from 'utils/format';
import {SelectMultiSpecGoods} from 'components/business/multiGoods';
import Base from './base';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function withMultiSpecGoods(WrappedComponent) {
    return class withMultiSpecGoods extends Base {
        static propTypes = {
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 默认需要展示的物品信息 */
            defaultForm: PropTypes.object,
            /** 填充列表数据 */
            fillList: PropTypes.func,
            /** 来源*/
            source: PropTypes.string,
            /** 计算合计 */
            calcTotal: PropTypes.func,
            /** 预处理物品数据 */
            preProcessProd: PropTypes.func,
        };

        constructor(props) {
            super(props);
            this.state={
                visible: false,
                specGroup: null
            };
        }

        handleOpen = (specGroup) => {
            this.setState({specGroup, visible: true});
        };

        confirmOperate = (selectedRows) => {
            if(selectedRows.length === 0){
                message.error('请选择一个规格！');
                return false;
            }
            this.setState({visible: false});
            let { source, defaultForm, fillList, preProcessProd, calcTotal } = this.props;
            // 预处理物品数据
            let prodList = preProcessProd({type: 'multiSpecGoods',source, defaultForm, lists: selectedRows});
            fillList && fillList(prodList, null, () => {
                // 计算合计
                if(calcTotal) calcTotal();
            });
        };

        render(){
            let {specGroup} = this.state;
            let { dataPrefix } = this.props;

            let specColumn = {
                title: '规格型号',
                key: 'descItem',
                dataIndex: 'descItem',
                columnName: 'descItem',
                maxLength: 1000,
                width: 235,
                render: (text, record, index)=> {
                    /**
                     *    情况1： 选择的普通物品   specGroup： null,  productCode: exist
                     *    情况2： 选择的多规格物品  specGroup：exist,  productCode: exist
                     *    情况3： 新建的物品  specGroup： null,   productCode: null
                     */
                    let {key, productCode, specGroup} = record;
                    return (
                        <React.Fragment>
                            {
                                (!specGroup && productCode) ? (  // 情况1：
                                    <span className="txt-clip" title={text}>{text}</span>
                                ) : (specGroup && productCode) ?  (
                                    <Form.Item
                                        name={[dataPrefix, key, 'descItem']}
                                    >
                                        <Input
                                            style={{width:'100%', ...this.props.style}}
                                            suffix={(<a href="#!" onClick={() => this.handleOpen(specGroup)}>
                                                <EllipsisOutlined style={{fontSize: "16px"}}/>
                                            </a>)}
                                            className={cx("suggest")}
                                        />
                                    </Form.Item>
                                ) : (
                                    <Form.Item
                                        name={[dataPrefix, key, 'descItem']}
                                    >
                                        <Input />
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
                        specColumn={specColumn}
                    />
                    <SelectMultiSpecGoods
                        visible={this.state.visible}
                        onOk={(selectedRows) => this.confirmOperate(selectedRows)}
                        onCancel={()=>{this.setState({visible: false})}}
                        specGroup={specGroup}
                    />
                </React.Fragment>
            )
        }
    }
}