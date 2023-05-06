import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Modal, Col, Input, Row, Form } from 'antd';
import {formatCurrency, removeCurrency} from 'utils/format';
import {QuestionCircleOutlined} from '@ant-design/icons';
import Tooltip from 'components/widgets/tooltip';
import Base from './base'

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function withScan(WrappedComponent) {

    return class WithScan extends Base {

        constructor(props) {
            super(props);
        }

        //扫码录单对于已存在物品则增加物品数量
        increaseGoodsQuantity = (key, updateQuantity) => {
            let {setFieldsValue} = this.props.formRef.current;
            //设置数量
            setFieldsValue({
                [this.dataPrefix]: {
                    [key]: {
                        [this.dataName.recQuantity]: removeCurrency(formatCurrency(updateQuantity, 3, true))
                    }
                }
            });

            this.props.onIncreaseGoodsQuantity && this.props.onIncreaseGoodsQuantity(key, updateQuantity);
            this.props.handleRecQuantityChange(key, updateQuantity);
        };

        //扫码录单
        handleScan = (e, dataSource) => {
            e.preventDefault();
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;

            const proBarCode = e.target.value;
            if (!proBarCode) {
                return;
            }
            this.props.asyncFetchSaleByBarcode(proBarCode, data => {
                if (data.retCode === '0') {
                    if (data.retMsg) {
                        Modal.warning({
                            title: intl.get("components.goods.withScan.warningTip"),
                            content: intl.get("components.goods.withScan.message1"),
                            onOk: () => {
                                //清空输入框
                                setFieldsValue({
                                    scan: ''
                                })
                            }
                        })
                    }
                    else if (data.data) {
                        const goods = data.data;

                        //判断物品是否已经存在，如果存在就增加物品数量
                        let updateQuantity = 1, updateKey = 0;
                        for (let i = 0; i < dataSource.length; i++) {
                            const productCode = getFieldValue([this.dataPrefix, dataSource[i].key, this.dataName.productCode]);
                            const proBarCode = getFieldValue([this.dataPrefix, dataSource[i].key, this.dataName.proBarCode]);
                            let quantity = getFieldValue([this.dataPrefix, dataSource[i].key, this.dataName.recQuantity]);

                            if (productCode === goods.code && proBarCode === goods.proBarCode) {
                                updateQuantity = quantity ? parseInt(quantity) + 1 : updateQuantity + 1;
                                updateKey = dataSource[i].key;
                                break;
                            }
                        }

                        const newGoods = {
                            'productCode': goods.code,
                            'prodCustomNo': goods.displayCode,
                            'prodName': goods.name,
                            'descItem': goods.descItem || goods.description,
                            'proBarCode':  goods.proBarCode,
                            'firstCatName':  goods.firstCatName,
                            'secondCatName':  goods.secondCatName,
                            'thirdCatName':  goods.thirdCatName,
                            'unit': goods.unit,
                            'brand': goods.brand,
                            'produceModel': goods.produceModel,
                            'propertyValue1': goods.propertyValue1,
                            'propertyValue2': goods.propertyValue2,
                            'propertyValue3': goods.propertyValue3,
                            'propertyValue4': goods.propertyValue4,
                            'propertyValue5': goods.propertyValue5,
                            'quantity': updateQuantity * goods.unitConverter,
                            'recQuantity': updateQuantity,
                            'orderPrice': goods.orderPrice,
                            'salePrice': goods.salePrice,
                            'recUnit': goods.recUnit,
                            'unitFlag': goods.unitFlag,
                            'unitConverter': goods.unitConverter || 1,
                            'unitConverterText': `1${goods.recUnit}=${goods.unitConverter || 1}${goods.unit}`,
                        };

                        if (updateQuantity > 1) {
                            this.increaseGoodsQuantity(updateKey, updateQuantity);
                        }
                        else {
                            this.insertGoods([newGoods], 'scan',[],(goodsItem, index, emptyKeys, source)=>{
                                if (!this.props.hideUnitPriceColumn && (source === 'goodsPop' || source === 'fittingPop' || source === 'scan')) {
                                    //处理带入单价
                                    this.props.carryUnitPrice && this.props.carryUnitPrice(emptyKeys[index], goodsItem);
                                    //处理带入数量
                                    this.props.carryQuantity && this.props.carryQuantity(emptyKeys[index], goodsItem);
                                }
                            }, (needAddGoods, source)=>{
                                //处理带入单价
                                return this.props.carryUnitPriceToInExistsLine(needAddGoods);
                            },(goods, emptyKeys)=>{
                                this.props.calcTotal(goods, emptyKeys);
                            });
                        }

                        //清空输入框
                        setFieldsValue({
                            scan: ''
                        })
                    }
                }
            })
        };

        render() {

            const {goodsInfo} = this.props;

            const dataSource = goodsInfo.get('data').toJS();

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                    />
                    <Row className={"mt20"}>
                        <Col span={8}>
                            <Form.Item>
                                <Form.Item name={'scan'}>
                                    <Input addonBefore={(<div>{intl.get("components.goods.withScan.scan")}</div>)} placeholder={intl.get("components.goods.withScan.scanPlaceholder")}
                                           onPressEnter={(e) => this.handleScan(e, dataSource)}/>
                                </Form.Item>
                                <Tooltip
                                    type="info"
                                    title={intl.get("components.goods.withScan.infoTitle")}
                                >
                                    <QuestionCircleOutlined  className={cx("scan-tip")}/>
                                </Tooltip>
                            </Form.Item>
                        </Col>
                    </Row>
                </React.Fragment>
            )
        }
    }
}

