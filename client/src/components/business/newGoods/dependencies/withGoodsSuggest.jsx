import React, {Component} from 'react';
import {formatCurrency, removeCurrency} from 'utils/format';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Base from './base'

const cx = classNames.bind(styles);


export default function withGoodsSuggest(WrappedComponent) {

    return class WithGoodsSuggest extends Base {


        setFieldVal = (recordKey, goods)=>{
            let {setFieldsValue} = this.props.formRef.current;
            if(goods){
                setFieldsValue({
                    [this.dataPrefix]: {
                        [recordKey]: {
                            [this.dataName.prodName]: goods.prodName,
                            [this.dataName.prodCustomNo]: goods.prodCustomNo,
                            [this.dataName.productCode]: goods.productCode,
                            [this.dataName.descItem]: goods.descItem,
                            [this.dataName.proBarCode]: goods.proBarCode,
                            [this.dataName.firstCatName]: goods.firstCatName,
                            [this.dataName.secondCatName]: goods.secondCatName,
                            [this.dataName.thirdCatName]: goods.thirdCatName,
                            [this.dataName.unit]: goods.unit,
                            [this.dataName.brand]: goods.brand,
                            [this.dataName.produceModel]: goods.produceModel,
                            [this.dataName.propertyValue1]: goods.propertyValue1,
                            [this.dataName.propertyValue2]: goods.propertyValue2,
                            [this.dataName.propertyValue3]: goods.propertyValue3,
                            [this.dataName.propertyValue4]: goods.propertyValue4,
                            [this.dataName.propertyValue5]: goods.propertyValue5,
                            [this.dataName.expirationFlag]: goods.expirationFlag,
                            [this.dataName.remarks]: goods.remarks,
                            [this.dataName.expirationDay]: goods.expirationDay,
                            [this.dataName.specGroup]: goods.specGroup,
                            [this.dataName.recUnit]: goods.unit,
                            [this.dataName.unitFlag]: goods.unitFlag,
                            [this.dataName.unitConverterText]: `1${goods.unit}=1${goods.unit}`,
                            [this.dataName.unitConverter]: 1,
                        }
                    }
                });
                this.props.carryUnitPrice && this.props.carryUnitPrice(recordKey, goods);
                this.setFieldReadOnlyStatus && this.setFieldReadOnlyStatus(true, recordKey);
            }
        };

        emptyFieldVal = (recordKey)=>{
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                [this.dataPrefix]: {
                    [recordKey]: {
                        [this.dataName.prodName] : '',
                        [this.dataName.prodCustomNo] : '',
                        [this.dataName.productCode] : '',
                        [this.dataName.descItem] : '',
                        [this.dataName.proBarCode] : '',
                        [this.dataName.firstCatName] : '',
                        [this.dataName.secondCatName] : '',
                        [this.dataName.thirdCatName] : '',
                        [this.dataName.unit] : '',
                        [this.dataName.brand] : '',
                        [this.dataName.produceModel] : '',
                        [this.dataName.propertyValue1] : '',
                        [this.dataName.propertyValue2] : '',
                        [this.dataName.propertyValue3] : '',
                        [this.dataName.propertyValue4] : '',
                        [this.dataName.propertyValue5] : '',
                        [this.dataName.remarks]: '',
                        [this.dataName.serialNumber] : '',
                        [this.dataName.expirationFlag]: '',
                        [this.dataName.expirationDay]: '',
                        [this.dataName.batchNo]: '',
                        [this.dataName.expirationDate]: '',
                        [this.dataName.productionDate]: '',
                        [this.dataName.batchnoFlag]: '',
                        [this.dataName.specGroup]: '',
                        [this.dataName.recUnit]: '',
                        [this.dataName.unitFlag]: '',
                        [this.dataName.unitConverter]: '',
                        [this.dataName.unitConverterText]: '',
                        [this.dataName.quantity]: ''
                    }
                }
            });

            this.props.emptyQuantityAmountVal && this.props.emptyQuantityAmountVal(recordKey);
            this.setFieldReadOnlyStatus && this.setFieldReadOnlyStatus(false, recordKey);
            this.props.emptyFieldVal && this.props.emptyFieldVal(recordKey);
        };

        //物品编号建议词回填物品其它信息
        handleProdCodeSuggestSelect = (value, goods, recordKey) => {
            if (goods) {
                this.setFieldVal(recordKey, goods);
                this.props.prodCodeSuggestSelect && this.props.prodCodeSuggestSelect(goods, recordKey);
            }
        };

        //物品名称建议词回填物品其它信息
        handleProdNameSuggestSelect = (value, goods, recordKey) => {
            if (goods) {
                this.setFieldVal(recordKey, goods);
                this.props.prodNameSuggestSelect && this.props.prodNameSuggestSelect(goods, recordKey);
            }
        };

        handleProdCodeSuggestChange = (recordKey) => {
            let {getFieldValue} = this.props.formRef.current;

            const productCode = getFieldValue([this.dataPrefix, recordKey, this.dataName.productCode]);
            if (productCode) {
                this.emptyFieldVal(recordKey);
                this.props.prodCodeSuggestChange && this.props.prodCodeSuggestChange();
            }
        };

        handleProdNameSuggestChange = (recordKey) => {
            let {getFieldValue} = this.props.formRef.current;

            const productCode = getFieldValue([this.dataPrefix, recordKey, this.dataName.productCode]);
            if (productCode) {
                this.emptyFieldVal(recordKey);
                this.props.prodNameSuggestChange && this.props.prodNameSuggestChange();
            }
        };

        render(){
            return <WrappedComponent
                {...this.props}
                emptyFieldVal={this.emptyFieldVal}
                handleProdCodeSuggestSelect={this.handleProdCodeSuggestSelect}
                handleProdNameSuggestSelect={this.handleProdNameSuggestSelect}
                handleProdCodeSuggestChange={this.handleProdCodeSuggestChange}
                handleProdNameSuggestChange={this.handleProdNameSuggestChange}
            />
        }
    }

}

