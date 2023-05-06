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
                selectedRows: [],
                existIds: [],
                loopIdx: 0,  // 循环遍历的索引
                loopCount: 20,  // 每次渲染的个数
                currentProdList: null, // 需要填充的物品列表信息
            }
        }

        async componentDidUpdate () {
            let {loopIdx, loopCount, currentProdList, existIds} = this.state;
            if(currentProdList && loopIdx < Math.ceil(currentProdList.length / loopCount)){
                let first = loopIdx * loopCount;
                let end = Math.min(first+loopCount, currentProdList.length);
                let prodList = currentProdList.slice(first, end);
                await this.setState({loopIdx: ++loopIdx});
                if(loopIdx >= Math.ceil(currentProdList.length / loopCount)){
                    this.ref.setIsFetching(false);
                    this.setState({loopIdx: 0, currentProdList: null})
                }
                await this.fillGoodsForBomPop(prodList, existIds, 'fitting');
            }
        }

        getRef = (ref) => {
            this.ref = ref;
        };

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

        // 填充bom信息
        fillGoodsForBomPop = async (prodList, existIds, popType) => {
            return new Promise((resolve => {
                this.fillGoodsForBom(prodList, existIds, popType + 'Pop',(goodsItem, index, emptyKeys, source)=>{
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
                    resolve();
                }, (keys)=>{
                    const values = (new Array(keys.length)).fill(0);
                    this.props.calcTotal(values, keys);
                });
            }));
        };

        // 填充物品信息
        fillGoodsForGoodsPop = (prodList, popType) => {
            this.fillGoods(prodList, popType + 'Pop',(goodsItem, index, emptyKeys, source)=>{
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

        onOk = (selectedRows, visibleKey, popType) => {
            console.log(selectedRows, 'selectedRows');
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            this.beforeOnOk(()=>{
                this.closeModal(visibleKey);
                const prodList = selectedRows.map(item => {
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
                        currentQuantity: fixedDecimal(item.currentQuantity, quantityDecimalNum),
                        unitFlag: item.unitFlag
                    }
                });

                // 优化任务需要，先单独写，以后再做修改
                if(popType === 'fitting'){
                    const existIds = this.getExistIds();
                    this.setState({existIds, currentProdList: prodList})
                } else {
                    this.fillGoodsForGoodsPop(prodList, popType);
                }
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
                const proBarCode = getFieldValue([this.dataPrefix, item.key, this.dataName.proBarCode]);
                const firstCatName = getFieldValue([this.dataPrefix, item.key, this.dataName.firstCatName]);
                const secondCatName = getFieldValue([this.dataPrefix, item.key, this.dataName.secondCatName]);
                const thirdCatName = getFieldValue([this.dataPrefix, item.key, this.dataName.thirdCatName]);
                const unit = getFieldValue([this.dataPrefix, item.key, this.dataName.unit]);
                const brand = getFieldValue([this.dataPrefix, item.key, this.dataName.brand]);
                const produceModel = getFieldValue([this.dataPrefix, item.key, this.dataName.produceModel]);
                const propertyValue1 = getFieldValue([this.dataPrefix, item.key, this.dataName.propertyValue1]);
                const propertyValue2 = getFieldValue([this.dataPrefix, item.key, this.dataName.propertyValue2]);
                const propertyValue3 = getFieldValue([this.dataPrefix, item.key, this.dataName.propertyValue3]);
                const propertyValue4 = getFieldValue([this.dataPrefix, item.key, this.dataName.propertyValue4]);
                const propertyValue5 = getFieldValue([this.dataPrefix, item.key, this.dataName.propertyValue5]);
                const remarks = getFieldValue([this.dataPrefix, item.key, this.dataName.remarks]);

                if (productCode) {
                    const items = {
                        productCode,
                        prodCustomNo,
                        descItem,
                        proBarCode,
                        firstCatName,
                        secondCatName,
                        thirdCatName,
                        unit,
                        brand,
                        produceModel,
                        propertyValue1,
                        propertyValue2,
                        propertyValue3,
                        propertyValue4,
                        propertyValue5,
                        remarks
                    };

                    if (!this.props.hideRecQuantityColumn) {
                        items.recQuantity = getFieldValue([this.dataPrefix, item.key, this.dataName.recQuantity]);
                    }

                    if (!this.props.hideUnitPriceColumn) {
                        items.unitPrice = getFieldValue([this.dataPrefix, item.key, this.dataName.unitPrice]);
                    }

                    if (!this.props.hideAmountColumn) {
                        items.amount = getFieldValue([this.dataPrefix, item.key, this.dataName.amount]);
                    }

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
                        getRef={this.getRef}
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

