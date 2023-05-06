import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form} from 'antd';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import goodsTable from 'components/business/newGoods';
import CopyFromOrder from 'components/business/copyFromOrder';
import {DatePicker, message, Tooltip} from "antd";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

class CopyFromOrderTable extends Component {

    onOk = ({prodList, ...data}, visibleKey) => {
        // this.props.handleCopyFromOrder(data);
        this.props.closeCopyModal(visibleKey);
        this.props.fillGoods(prodList)
    };

    render() {
        return (
            <CopyFromOrder
                visible={this.props.copyFromOrderVisible}
                visibleFlag={'copyFromOrderVisible'}
                onOk={this.onOk}
                onCancel={() => this.props.closeCopyModal('copyFromOrderVisible')}
                selectType={"radio"}
                popType={'goods'}
                selectedKeys={[this.props.getExistIds()]}
                copySource="sale"
            />
        )
    }
}

const Goods = goodsTable(CopyFromOrderTable);

class ProdList extends Component {

    dataPrefix="prod";

    handleInsertGoods = (goodsItem, insertLineKey, source) => {
        // const {form: {setFieldsValue}} = this.props;
        //如果是从物品弹层过来的物品则带入销售价
        // if(source === 'goodsPop'){
        //     setFieldsValue({
        //         [`${this.dataPrefix}[${insertLineKey}].unitPrice`]: goodsItem.salePrice
        //     })
        // }

    };
    oneKeyFill=()=>{
        const { goodsInfo } = this.props;
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        const dataSource = goodsInfo.get('data').toJS();
        let firstDate;
        //找到第一个日期
        for (let i = 0; i < dataSource.length; i++) {
            const deliveryDeadlineDate = getFieldValue && getFieldValue([this.dataPrefix, dataSource[i].key, 'deliveryDeadlineDate']);
            if(deliveryDeadlineDate){
                firstDate = deliveryDeadlineDate;
                break;
            }
        }
        if(firstDate){
            //填充第一个日期到所有日期
            for (let i = 0; i < dataSource.length; i++) {
                let productCode = getFieldValue && getFieldValue([this.dataPrefix, dataSource[i].key, 'productCode']);
                if(productCode){
                    setFieldsValue({
                        [this.dataPrefix]: {
                            [dataSource[i].key]: {
                                deliveryDeadlineDate: firstDate
                            }
                        }
                    });
                }
            }
        }else{
            message.error(intl.get("sale.add.prodList.no_content"));
        }

    };

    emptyFieldVal=(recordKey)=>{
        let {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({
            [`${this.dataPrefix}[${recordKey}].deliveryDeadlineDate`]: null,
        });
    };

    render() {
        let {getFieldValue} = this.props.formRef && this.props.formRef.current;
        const receiptColumns = [{
            title: <div className="tb-fill-wrap">{intl.get("sale.add.prodList.deliveryDeadlineDate")}
                <Tooltip
                    title={intl.get("sale.add.prodList.oneKeyFillContent")}
                ><a href="#!" className={"fr"} onClick={this.oneKeyFill}>{intl.get("sale.add.prodList.oneKeyFill")}</a>
                </Tooltip>
            </div>,
            key: 'deliveryDeadlineDate',
            width: 141,
            rules: [
                {
                    type: 'object',
                },
                {
                    rule: function(val) {
                        const saleOrderDate = getFieldValue('saleOrderDate');
                        return val && saleOrderDate.isAfter(val, 'date');
                    },
                    message: intl.get("sale.add.prodList.deliveryDeadlineDateMessage")
                }
            ],
            getFieldDecoratored: true,
            render: (text, record, index, dataSource, validConfig)=> {
                return (
                    <Form.Item
                        name={[this.dataPrefix, record.key, 'deliveryDeadlineDate']}
                        initialValue={text && moment(text)}
                        rules={validConfig}
                    >
                        <DatePicker className={"gb-datepicker"}/>
                    </Form.Item>
                )
            }
        }];

        return (

            <React.Fragment>
                <Goods
                    {...this.props}
                    fieldConfigType={"saleOrder"}
                    billType="listForSaleOrder"  //单据类型，如果物品弹层数据接口比较特殊需要单独定义这个字段
                    goodsPopCondition={{customerNo: this.props.customerNo}} //筛选条件
                    initGoodsTableData={this.props.initGoodsTableData}
                    // initTotalQuantity={this.props.initTotalQuantity}
                    initTotalAmount={this.props.initTotalAmount}
                    initAggregateAmount={this.props.initAggregateAmount}
                    initDiscountAmount={this.props.initDiscountAmount}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    //要修改字段提交的名称传下面这个参数修改，value为你需要改的字段名称
                    /*dataName ={{
                        // productCode: 'productNo',
                        // prodCustomNo: 'prodCustomNo',
                        // prodName: 'prodName',
                        // descItem: 'descItem',
                        // proBarCode: 'proBarCode',
                        // unit: 'unit',
                        // quantity: 'quantity',
                        // unitPrice: 'unitPrice',
                        // amount: 'amount',
                        // remarks: 'remarks'
                    }}*/
                    //数量单价金额可单独配置，会覆盖默认的选项，如果不需要可以设置hideQuantityColumn hideUnitPriceColumn hideAmountColumn为true
                    /*hideRecQuantityColumn
                    hideUnitPriceColumn
                    hideAmountColumn*/
                    quantityColumns = {{
                        title: intl.get("sale.add.prodList.saleAmount"),
                    }}
                    receiptColumns={receiptColumns}
                    emptyFieldVal={this.emptyFieldVal}
                    onInsertGoods={this.handleInsertGoods} //当一条物品插入表格时候的回调
                    // carryOrderPriceToUnitPrice //带入采购价格到单价
                    carrySalePriceToUnitPrice //带入销售价格到单价
                    showStockInfo //鼠标移入数量显示库存信息tip
                    showUnitConverterColumn  // 显示单位关系
                    showQuantityColumns  // 显示基本单位数量
                    untaxedPriceAuthModule="salePrice"
                    unitPriceAuthModule="salePrice"
                    untaxedAmountAuthModule="salePrice"
                    amountAuthModule="salePrice"
                    taxAuthModule="salePrice"
                    showExtraCustomField={true}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    goodsInfo: state.getIn(['goods', 'goodsInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdList)