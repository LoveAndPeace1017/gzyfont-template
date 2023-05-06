import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {DatePicker, message, Tooltip, Form} from "antd";
import {formatCurrency, removeCurrency} from 'utils/format';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import goodsTable from 'components/business/newGoods';
import CopyFromSale from 'components/business/copyFromSale';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");


class CopyFromSaleTable extends Component {

    onOk = ({prodList, ...data}, visibleKey) => {
        console.log(prodList,'prodList');
        let {setFieldsValue} = this.props.formRef.current;
        //复制单据其它字段（这边只有项目名称）
        this.props.handleCopyFromSale(data);
        this.props.closeCopyModal(visibleKey);
        //填充物品基本信息
        this.props.fillGoods(prodList, 'copyFromSalePop', (goodsItem, index, emptyKeys, source)=>{
            console.log(goodsItem,'goodsItem');
            //处理带入单价
            this.props.carryUnitPrice && this.props.carryUnitPrice(emptyKeys[index], goodsItem);
            //处理带入数量
            this.props.carryQuantity && this.props.carryQuantity(emptyKeys[index], goodsItem, 'unPurchaseNum');
            //处理带入上游订单号
            setFieldsValue({
                [this.props.dataPrefix]:{
                    [emptyKeys[index]]:{
                        saleBillNo:goodsItem.saleBillNo,
                        displaySaleBillNo:goodsItem.displaySaleBillNo
                    }
                }
            })
        }, (needAddGoods, source)=>{
            //处理新加入行带入含税单价
            needAddGoods = this.props.carryUnitPriceToInExistsLine(needAddGoods, 'unPurchaseNum');
            //处理新加入行带入上游单号
            needAddGoods = needAddGoods.map(item => {
                item['saleBillNo'] = item.saleBillNo;
                item['displaySaleBillNo'] = item.displaySaleBillNo;
                return item;
            });
            return needAddGoods;
        },(goods, emptyKeys)=>{
            //计算总数量总金额
            this.props.calcTotal(goods, emptyKeys, 'unPurchaseNum');
        }, (keys)=>{
            const values = (new Array(keys.length)).fill(0);
            this.props.calcTotal(values, keys);
        });

    };

    render() {
        return (
            <CopyFromSale
                visible={this.props.copyFromSaleVisible}
                visibleFlag={'copyFromSaleVisible'}
                onOk={this.onOk}
                onCancel={() => this.props.closeCopyModal('copyFromSaleVisible')}
                selectType={"radio"}
                popType={'goods'}
                unitPriceSource='orderPrice'
                selectedKeys={this.props.getExistIds()}
                copySource={'purchase'} //复制按钮的来源
            />
        )
    }
}

const Goods = goodsTable(CopyFromSaleTable);

class ProdList extends Component {


    dataPrefix = "prod";

    oneKeyFill=()=>{
        const {goodsInfo} = this.props;
        const {getFieldValue, setFieldsValue} =  this.props.formRef.current;
        const dataSource = goodsInfo.get('data').toJS();
        let firstDate;
        //找到第一个日期
        for (let i = 0; i < dataSource.length; i++) {
            const deliveryDeadlineDate = getFieldValue([this.dataPrefix,dataSource[i].key,'deliveryDeadlineDate']);
            if(deliveryDeadlineDate){
                firstDate = deliveryDeadlineDate;
                break;
            }
        }
        if(firstDate){
            //填充第一个日期到所有日期
            for (let i = 0; i < dataSource.length; i++) {
                const productCode = getFieldValue([this.dataPrefix,dataSource[i].key,'productCode']);
                if(productCode){
                    setFieldsValue({
                        [this.dataPrefix]:{
                            [dataSource[i].key]:{
                                deliveryDeadlineDate:firstDate
                            }
                        }
                    });
                }
            }
        }else{
            message.error(intl.get("purchase.add.prodList.no_content"));
        }

    };

    emptyFieldVal=(recordKey)=>{
        const {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({
            [this.dataPrefix]:{
               [recordKey]:{
                   saleBillNo : '',
                   displaySaleBillNo: '',
                   deliveryDeadlineDate: null
               }
            }
            /*[`${this.dataPrefix}[${recordKey}].saleBillNo`]: '',
            [`${this.dataPrefix}[${recordKey}].displaySaleBillNo`]: '',
            [`${this.dataPrefix}[${recordKey}].deliveryDeadlineDate`]: null,*/
        });
    };

    render() {
        const {getFieldValue} = this.props.formRef && this.props.formRef.current;

        const receiptColumns = [{
            title: '',
            colSpan: 0,
            key: 'requestBillNo',
            width: 0,
            readOnly: true
        }, {
            title: '请购单号',
            key: 'requestDisplayBillNo',
            width: 171,
            readOnly: true
        },{
            title: '销售单号',
            key: 'displaySaleBillNo',
            width: 171,
            readOnly: true
        },{
            title: '',
            colSpan: 0,
            key: 'saleBillNo',
            width: 0,
            readOnly: true
        },{
            title: <div className="tb-fill-wrap">{intl.get("purchase.add.prodList.deliveryDeadlineDate")}
                <Tooltip
                    title={intl.get("purchase.add.prodList.oneKeyFillContent")}
                ><a href="#!" className={"fr"} onClick={this.oneKeyFill}>{intl.get("purchase.add.prodList.oneKeyFill")}</a>
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
                        const purchaseOrderDate = getFieldValue('purchaseOrderDate');
                        return val && purchaseOrderDate.isAfter(val, 'date');
                    },
                    message: intl.get("purchase.add.prodList.deliveryDeadlineDateMessage")
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
                    fieldConfigType={"purchase_order"}
                    goodsRef = {this.props.goodsRef}
                    // billType="listForSaleOrder"  //单据类型，如果物品弹层数据接口比较特殊需要单独定义这个字段
                    // goodsPopCondition={{customerNo: this.props.customerNo}} //筛选条件
                    initGoodsTableData={this.props.initGoodsTableData}
                    // initTotalQuantity={this.props.initTotalQuantity}
                    initTotalAmount={this.props.initTotalAmount}
                    initAggregateAmount={this.props.initAggregateAmount}
                    initDiscountAmount={this.props.initDiscountAmount}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    //数量单价金额可单独配置，会覆盖默认的选项，如果不需要可以设置hideRecQuantityColumn hideUnitPriceColumn hideAmountColumn为false
                    quantityColumns={{
                        title: intl.get("purchase.add.prodList.purchaseAmount")
                    }}
                    receiptColumns={receiptColumns}
                    emptyFieldVal={this.emptyFieldVal}
                    onInsertGoods={this.handleInsertGoods} //当showStockInfo一条物品插入表格时候的回调
                    carryOrderPriceToUnitPrice //带入采购价格到单价
                    showStockInfo //鼠标移入数量显示库存信息tip
                    showUnitConverterColumn  // 显示单位关系
                    showQuantityColumns  // 显示基本单位数量
                    //下面这些都是添加价格权限的
                    untaxedPriceAuthModule="purchasePrice"
                    unitPriceAuthModule="purchasePrice"
                    untaxedAmountAuthModule="purchasePrice"
                    amountAuthModule="purchasePrice"
                    taxAuthModule="purchasePrice"
                    discountAuthModule="purchasePrice"
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