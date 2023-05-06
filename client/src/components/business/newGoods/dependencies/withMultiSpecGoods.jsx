import React, {Component} from 'react';
import {formatCurrency, removeCurrency} from 'utils/format';
import {Input, Form, message} from "antd";
import {EllipsisOutlined} from '@ant-design/icons';
import {SelectMultiSpecGoods} from 'components/business/multiGoods';
import Base from './base';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import _ from "lodash";

const cx = classNames.bind(styles);

export default function withMultiSpecGoods(WrappedComponent) {
    return class withMultiSpecGoods extends Base {
        constructor(props) {
            super(props);
            this.state={
                visible: false,
                idx: 0,  // 当前的所在行号
            };
        }

        handleOpen = (idx) => {
            let {getFieldValue} = this.props.formRef.current;
            let specGroup = getFieldValue([this.dataPrefix, idx, this.dataName.specGroup]);
            this.setState({idx, visible: true, specGroup});
        };

        confirmOperate = (selectedRows) => {
            if(selectedRows.length === 0){
                message.error('请选择一个规格！');
                return false;
            }
            this.setState({visible: false});
            const prodList = _.cloneDeep(selectedRows).map(item => {
                delete item.key; //不删除key，它会覆盖组件redux数据中的key会导致数据提交出问题
                return {
                    ...item,
                    productCode: item.code || item.productCode,
                    prodCustomNo: item.displayCode || item.prodCustomNo,
                    prodName: item.name || item.prodName,
                    descItem: item.description || item.descItem,
                    proBarCode: item.proBarCode,
                    firstCatName: item.firstCatName,
                    secondCatName: item.secondCatName,
                    thirdCatName: item.thirdCatName,
                    unit: item.unit,
                    brand: item.brand,
                    produceModel: item.produceModel,
                    propertyValue1: item.propertyValue1,
                    propertyValue2: item.propertyValue2,
                    propertyValue3: item.propertyValue3,
                    propertyValue4: item.propertyValue4,
                    propertyValue5: item.propertyValue5,
                    orderPrice: item.orderPrice,
                    salePrice: item.salePrice,
                }
            });
            this.fillGoods(prodList, 'multiSpec',(goodsItem, index, emptyKeys, source)=>{
                if (!this.props.hideUnitPriceColumn) {
                    //处理带入单价和默认税率
                    this.props.carryUnitPrice && this.props.carryUnitPrice(emptyKeys[index], goodsItem);
                    //处理带入数量
                    this.props.carryQuantity && this.props.carryQuantity(emptyKeys[index], goodsItem);
                }
            }, (needAddGoods, source)=>{
                //处理带入单价
                return this.props.carryUnitPriceToInExistsLine(needAddGoods);
            },(goods, emptyKeys)=>{
                this.props.calcTotal(goods, emptyKeys);
            }, (keys)=>{
                const values = (new Array(keys.length)).fill(0);
                this.props.calcTotal(values, keys);
            });
        };

        render(){
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let {specGroup} = this.state;

            let specColumns = {
                title: '规格型号',
                key: this.dataName.descItem,
                originalKey: 'descItem',
                columnName: 'descItem',
                maxLength: 1000,
                width: 235,
                render: (text, record,  index, dataSource, validConfig)=> {
                    let specGroup = getFieldValue([this.dataPrefix, record.key, this.dataName.specGroup]);
                    let disabled = !specGroup ? record['descItemReadOnly'] : false;
                    return (
                        <Form.Item
                            rules={validConfig}
                            name={[this.dataPrefix, record.key, this.dataName.descItem]}
                        >
                            <Input
                                disabled={disabled}
                                placeholder={this.props.placeholder}
                                style={{width:'100%', ...this.props.style}}
                                suffix={(
                                    specGroup ? (
                                        <a href="#!"
                                           onClick={() => this.handleOpen(record.key)}>
                                            <EllipsisOutlined style={{fontSize: "16px"}}/>
                                        </a>
                                    ) : null
                                )}
                                className={cx("suggest")}
                            />
                        </Form.Item>
                    )
                }
            };

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        specColumns={specColumns}
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