import React, {Component} from 'react';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Base from './base'

const cx = classNames.bind(styles);

export default function withGoodsPop(WrappedComponent) {

    return class WithGoodsPop extends Base {

        constructor(props) {
            super(props);
            this.state = {
                goodsPopVisible: false,
                selectedRows: []
            }
        }

        closeModal = (tag) => {
            let obj = {};
            obj[tag] = false;
            this.setState(obj)
        };
        openModal = (tag) => {
            let obj = {};
            obj[tag] = true;
            this.setState(obj)
        };

        selectGoods = (key) => {
            this.openModal('goodsPopVisible');
            this.setSelectedLineKey(key);
        };

        closeSelectGoods = () => {
            this.closeModal('goodsPopVisible');
            this.setSelectedLineKey('');
        };

        beforeOnOk = (callback)=>{
            if(this.props.beforeOnOk){
                this.props.beforeOnOk(callback);
            }else{
                callback();
            }
        };

        dealProductList = (selectedRows) => {
            if(!selectedRows || selectedRows.length===0) return null;
            return selectedRows.map(item => {
                delete item.key; //不删除key，它会覆盖组件redux数据中的key会导致数据提交出问题
                return {
                    ...item,
                    productCode: item.code || item.productCode,
                    prodCustomNo: item.displayCode || item.prodCustomNo,
                    prodName: item.name || item.prodName,
                    descItem: item.description || item.descItem,
                    unit: item.unit,
                    brand: item.brand,
                    produceModel: item.produceModel
                }
            });
        };

        // 处理BOM成品的数据
        dealBomProduct = (selectedRows) => {
            console.log(selectedRows, 'selectedRows');
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            if(!selectedRows || selectedRows.length===0) return null;
            return selectedRows.map(item => {
                delete item.key; //不删除key，它会覆盖组件redux数据中的key会导致数据提交出问题
                return {
                    ...item,
                    productCode: item.code || item.prodNo,
                    prodCustomNo: item.displayCode || item.prodCustomNo,
                    prodName: item.name || item.prodName,
                    descItem: item.description || item.descItem,
                    unit: item.unit,
                    brand: item.brand,
                    produceModel: item.produceModel,
                    quantity: fixedDecimal(item.quantity || item.num || 0, quantityDecimalNum)
                }
            });
        };

        onOk = (selectedRows, visibleKey, popType, fittingSelectedRows) => {
            console.log(selectedRows, fittingSelectedRows, 'selectedRows');
            this.beforeOnOk(()=>{
                this.closeModal(visibleKey);
                let prodList = [];  // 填充当前物品列表
                let outProdList = [];  //  填充消耗原料列表 配件组合使用
                if(this.props.prodType==='preform' && fittingSelectedRows){  // 如果类型为 加工成品列表 且选择的是BOM配件组合
                    prodList = this.dealBomProduct(fittingSelectedRows);
                    outProdList = this.dealBomProduct(selectedRows);
                    this.props.fittingFillGoods && this.props.fittingFillGoods(outProdList);
                } else {
                    prodList = this.dealProductList(selectedRows);
                }
                this.fillGoods(prodList, popType + 'Pop', null, null,(goods, emptyKeys)=>{
                    this.props.calcTotal && this.props.calcTotal(goods, emptyKeys);
                }, (keys)=>{
                    const values = (new Array(keys.length)).fill(0);
                    this.props.calcTotal && this.props.calcTotal(values, keys);
                });
            })
        };

        getExistRows = () => {
            const {goodsInfo} = this.props;
            let {getFieldValue} = this.props.formRef.current;

            const dataSource = goodsInfo.get('data').toJS();
            const existRows = dataSource.map(item => {
                const productCode = getFieldValue([this.dataPrefix, item.key, this.dataName.productCode]);
                const prodCustomNo = getFieldValue([this.dataPrefix, item.key, this.dataName.prodCustomNo]);
                const descItem = getFieldValue([this.dataPrefix, item.key, this.dataName.descItem]);
                const unit = getFieldValue([this.dataPrefix, item.key, this.dataName.unit]);
                const brand = getFieldValue([this.dataPrefix, item.key, this.dataName.brand]);
                const produceModel = getFieldValue([this.dataPrefix, item.key, this.dataName.produceModel]);

                if (productCode) {
                    const items = {
                        productCode,
                        prodCustomNo,
                        descItem,
                        unit,
                        brand,
                        produceModel
                    };
                    return items;
                }
            });
            return existRows.filter(item => item);
        };

        render(){
            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        selectGoods={this.selectGoods}
                    />
                    <SelectGoodsOrFitting
                        visible={this.state.goodsPopVisible}
                        visibleFlag={'goodsPopVisible'}
                        onOk={this.onOk}
                        onCancel={this.closeSelectGoods}
                        selectType={"checkbox"}
                        condition={{
                            ...this.props.goodsPopCondition,
                            billType: this.props.billType,
                            isSellOutBound: this.props.billType === "listForSaleOrder"
                        }}
                        selectedRowKeys={this.getExistIds()}
                        selectedRows={this.getExistRows()}
                    />
                </React.Fragment>
            )
        }
    }

}

