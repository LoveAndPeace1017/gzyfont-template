import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency, removeCurrency} from 'utils/format';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import goodsTable from 'components/business/newGoods';
import CopyFromOrder from 'components/business/copyFromOrder';


class CopyFromOrderTable extends Component {

    onOk = ({prodList, ...data}, visibleKey) => {
        //复制单据其它字段（这边只有项目名称）
        this.props.handleCopyFromSale(data);
        this.props.closeCopyModal(visibleKey);
        //填充物品基本信息
        this.props.fillGoods(prodList, 'copyFromOrderPop', (goodsItem, index, emptyKeys, source)=>{
            //处理带入单价
            this.props.carryUnitPrice && this.props.carryUnitPrice(emptyKeys[index], goodsItem);
            //处理带入数量
            this.props.carryQuantity && this.props.carryQuantity(emptyKeys[index], goodsItem, 'unStockIn');
        }, (needAddGoods, source)=>{
            //处理新加入行带入含税单价
            needAddGoods = this.props.carryUnitPriceToInExistsLine(needAddGoods, 'unStockIn');
            //处理新加入行带入上游单号
            needAddGoods = needAddGoods.map(item => {
                item['saleBillNo'] = item.saleBillNo;
                return item;
            });
            return needAddGoods;
        },(goods, emptyKeys)=>{
            //计算总数量总金额
            this.props.calcTotal(goods, emptyKeys, 'unStockIn');
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
            <CopyFromOrder
                visible={this.props.copyFromOrderVisible}
                visibleFlag={'copyFromOrderVisible'}
                onOk={this.onOk}
                onFillWarehouse={this.onFillWarehouse}
                onCancel={() => this.props.closeCopyModal('copyFromOrderVisible')}
                selectType={"radio"}
                popType={'goods'}
                selectedKeys={this.props.getExistIds()}
                copySource="inbound"
            />
        )
    }
}

const Goods = goodsTable(CopyFromOrderTable);

class ProdList extends Component {



    dataPrefix="prod";

    //从销售订单复制会带入物品的采购单价
    handleInsertGoods = (goodsItem, insertLineKey, source) => {
        // const {form: {setFieldsValue}} = this.props;

        /*//如果从采购订单复制弹层过来的物品则带入价格库的价格
        if(source === 'copyFromOrderPop'){

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
        }
*/
    };

    render() {
        let {currentInBoundType} = this.props;
        let priceType = currentInBoundType !== 3 ? 'purchasePrice' : 'salePrice';
        return (

            <React.Fragment>
                <Goods
                    {...this.props}
                    fieldConfigType={"warehouse_enter"}
                    initGoodsTableData={this.props.initGoodsTableData}
                    dataName={{
                        productCode: 'prodNo',
                        prodCustomNo: 'prodCustomNo',
                        prodName: 'prodName',
                        descItem: 'descItem',
                        proBarCode: 'proBarCode',
                        unit: 'unit',
                        quantity: 'quantity',
                        unitPrice: 'unitPrice',
                        amount: 'amount'
                    }}
                    quantityColumns={{
                        title: intl.get("inbound.add.prodList.inboundAmount")
                    }}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    onInsertGoods={this.handleInsertGoods} //当一条物品插入表格时候的回调
                    carryOrderPriceToUnitPrice //带入采购价格到单价
                    showSerialNumberColumns
                    showBatchLeftColumns
                    showUnitConverterColumn  // 显示单位关系
                    showQuantityColumns  // 显示基本单位数量
                    untaxedPriceAuthModule={priceType}
                    unitPriceAuthModule={priceType}
                    untaxedAmountAuthModule={priceType}
                    amountAuthModule={priceType}
                    taxAuthModule={priceType}
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