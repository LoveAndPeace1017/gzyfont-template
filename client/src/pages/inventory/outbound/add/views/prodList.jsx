import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);
import {formatCurrency, removeCurrency} from 'utils/format';
import goodsTable from 'components/business/newGoods';
import CopyFromSale from 'components/business/copyFromSale';


class CopyFromSaleTable extends Component {

    onOk = ({prodList, ...data}, visibleKey) => {
        //复制单据其它字段（这边只有项目名称）
        this.props.handleCopyFromSale(data);
        this.props.closeCopyModal(visibleKey);
        //填充物品基本信息
        this.props.fillGoods(prodList, 'copyFromSalePop',(goodsItem, index, emptyKeys, source)=>{
            //处理带入单价
            this.props.carryUnitPrice && this.props.carryUnitPrice(emptyKeys[index], goodsItem);
            //处理带入数量
            this.props.carryQuantity && this.props.carryQuantity(emptyKeys[index], goodsItem, 'unStockOut');
        }, (needAddGoods, source)=>{
            //处理新加入行带入含税单价
            needAddGoods = this.props.carryUnitPriceToInExistsLine(needAddGoods, 'unStockOut');
            //处理新加入行带入上游单号
            needAddGoods = needAddGoods.map(item => {
                item['saleBillNo'] = item.saleBillNo;
                return item;
            });
            return needAddGoods;
        },(goods, emptyKeys)=>{
            //计算总数量总金额
            this.props.calcTotal(goods, emptyKeys, 'unStockOut');
        }, (keys)=>{
            const values = (new Array(keys.length)).fill(0);
            this.props.calcTotal(values, keys);
        });

    };

    // 填充仓库
    onFillWarehouse = (warehouseName) => {
        let {setFieldsValue}  = this.props.formRef.current;
        setFieldsValue({ warehouseName });
    };

    render() {
        return (
            <CopyFromSale
                visible={this.props.copyFromSaleVisible}
                visibleFlag={'copyFromSaleVisible'}
                onOk={this.onOk}
                onFillWarehouse={this.onFillWarehouse}
                onCancel={() => this.props.closeCopyModal('copyFromSaleVisible')}
                selectType={"radio"}
                popType={'goods'}
                selectedKeys={this.props.getExistIds()}
                copySource={'outbound'}
            />
        )
    }
}

const Goods = goodsTable(CopyFromSaleTable);

class ProdList extends Component {



    dataPrefix="prod";

    //从销售订单复制会带入物品的采购单价
    handleInsertGoods = (goodsItem, insertLineKey, source) => {
        // const {form: {setFieldsValue}} = this.props;

        //如果从销售订单复制弹层过来的物品则带入价格库的价格
        /*if(source === 'copyFromSalePop'){

            setFieldsValue({
                [`${this.dataPrefix}[${insertLineKey}].quantity`]: goodsItem.quantity,
                [`${this.dataPrefix}[${insertLineKey}].unitPrice`]: goodsItem.unitPrice
            });

            //计算金额
            if (goodsItem.unitPrice && goodsItem.quantity) {
                setFieldsValue({
                    [`${this.dataPrefix}[${insertLineKey}].amount`]: removeCurrency(formatCurrency(goodsItem.quantity * goodsItem.unitPrice, 2, true))
                })
            }
        }*/

    };

    render() {
        let {getFieldValue} = this.props.formRef && this.props.formRef.current;
        let {outType} = this.props;

        return (

            <React.Fragment>
                <Goods
                    {...this.props}
                    fieldConfigType={"wareOut"}
                    initGoodsTableData={this.props.initGoodsTableData}
                    dataName={{
                        productCode: 'prodNo',
                    }}
                    source={'wareOut'}
                    goodsPopCondition={{customerNo: this.props.customerNo ? this.props.customerNo.key : ''}}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    onInsertGoods={this.handleInsertGoods} //当一条物品插入表格时候的回调
                    carryOrderPriceToUnitPrice={outType !== 2} //这个地方可能需要根据出库类型来判断，到底是带入采购价还是带入销售价
                    carrySalePriceToUnitPrice={outType === 2}
                    billType={outType === 2?"listForSaleOrder":''}
                    untaxedPriceAuthModule={outType === 2?"salePrice":"purchasePrice"}
                    unitPriceAuthModule={outType === 2?"salePrice":"purchasePrice"}
                    untaxedAmountAuthModule={outType === 2?"salePrice":"purchasePrice"}
                    amountAuthModule={outType === 2?"salePrice":"purchasePrice"}
                    taxAuthModule={outType === 2?"salePrice":"purchasePrice"}
                    showSerialNumberColumns
                    showBatchLeftColumns
                    showUnitConverterColumn  // 显示单位关系
                    showQuantityColumns  // 显示基本单位数量
                    quantityColumns={{
                        title: intl.get("outbound.add.prodList.quantity")
                    }}
                    showExtraCustomField={true}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdList)