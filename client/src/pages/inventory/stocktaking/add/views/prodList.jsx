import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);
import {formatCurrency, removeCurrency} from 'utils/format';

import goodsTable from 'components/business/newGoods';
import {Input, Form} from "antd";
import {numberReg} from 'utils/reg';
import defaultOptions from 'utils/validateOptions';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

class goodsTableInner extends Component {

    componentDidMount() {
        this.props.onRef(this)
    }

    render() {
        return null
    }
}

const Goods = goodsTable(goodsTableInner);

class ProdList extends Component {

    dataPrefix="prod";

    handleSuggestGoods = (goodsItem, insertLineKey) => {
        let {setFieldsValue} = this.props.formRef.current;
        //如果是从物品弹层过来的物品则带入销售价
        setFieldsValue({
            [this.dataPrefix]: {
                [insertLineKey]: {
                    systemNum: goodsItem.currentQuantity || 0
                }
            }
        });
    };

    handleClearAllGoods = (key)=>{
        let {setFieldsValue} = this.props.formRef.current;
        console.log(key,'keys');
        //如果是从物品弹层过来的物品则带入销售价
        /*setFieldsValue({
            [`${this.dataPrefix}[${key}].systemNum`]: '',
            [`${this.dataPrefix}[${key}].actualNum`]: '',
            [`${this.dataPrefix}[${key}].offsetQuantity`]: '',
            [`${this.dataPrefix}[${key}].result`]: ''
        })*/
        setFieldsValue({
            [this.dataPrefix]:{
                [key]: {
                    systemNum: '',
                    actualNum: '',
                    offsetQuantity: '',
                    offsetQuantityShow: '',
                    result: '',
                    recUnit: ''
                }
            }
        })
    };

    render() {
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        console.log(this.props.wareName, 'wareName')

        return (

            <React.Fragment>
                <Goods
                    {...this.props}
                    fieldConfigType={"warecheck_order"}
                    initGoodsTableData={this.props.initGoodsTableData}
                    // initTotalQuantity={this.props.totalQuantity}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    goodsPopCondition={{wareName: this.props.wareName}}
                    hideOtherGoodsColumns
                    hideUntaxedPriceColumn
                    hideUntaxedAmountColumn
                    hideTaxRateColumn
                    hideTaxColumn
                    //要修改字段提交的名称传下面这个参数修改，value为你需要改的字段名称
                     dataName = {{
                         productCode: 'prodNo',
                         prodCustomNo: 'prodCustomNo',
                         proBarCode: 'proBarcode'
                         // prodName: 'prodName',
                         // descItem: 'descItem',
                        // proBarCode: 'proBarCode',
                        //  unit: 'unit',
                        // quantity: 'quantity',
                    //     unitPrice: 'unitPrice',
                    //     amount: 'amount',
                    //     remarks: 'remarks'
                    }}
                    //数量单价金额可单独配置，会覆盖默认的选项，如果不需要可以设置hideRecQuantityColumn hideUnitPriceColumn hideAmountColumn为false
                    receiptColumns={[{
                        title: intl.get("stocktaking.add.prodList.systemNum"),
                        key: 'systemNum',
                        columnName: 'systemNum',
                        width: 150,
                        align: 'right',
                        require:true,
                        readOnly: true
                    },{
                        title: intl.get("stocktaking.add.prodList.actualNum"),
                        key: 'actualNum',
                        width: 150,
                        align: 'right',
                        required:!this.props.isDraft,
                        rules: [
                            {
                                validator: (rules, value, callback) => {
                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                    if (value && !reg.test(value)) {
                                        callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                    }
                                    callback();
                                }
                            }
                        ],
                        getFieldDecoratored: true,
                        render: (actualNum, record, index, dataSource, validConfig) => {
                            return (
                                <Form.Item
                                    {...defaultOptions}
                                    name={[this.dataPrefix, record.key, 'actualNum']}
                                    initialValue={fixedDecimal(actualNum, quantityDecimalNum)}
                                    rules={validConfig}
                                >
                                    <Input
                                        maxLength={11+Number(quantityDecimalNum)}
                                        onChange={(e) => {
                                        const actualNum = e.target.value||0;
                                        const systemNum = this.props.formRef.current.getFieldValue([this.dataPrefix, record.key, 'systemNum'])||0;
                                        const offset = actualNum-systemNum;
                                        this.props.formRef.current.setFieldsValue({
                                            [this.dataPrefix]: {
                                                [record.key]: {
                                                    offsetQuantityShow: fixedDecimal(offset, quantityDecimalNum),
                                                    offsetQuantity: fixedDecimal(offset, quantityDecimalNum),
                                                    result: offset > 0 ? intl.get("stocktaking.add.prodList.state1") : offset == 0 ? intl.get("stocktaking.add.prodList.state2") : intl.get("stocktaking.add.prodList.state3")
                                                }
                                            }
                                        });
                                    }}
                                           style={{"textAlign": 'right'}}
                                    />
                                </Form.Item>
                            )
                        },
                    },{
                        title: intl.get("stocktaking.add.prodList.offsetQuantity"),
                        key: 'offsetQuantity',
                        columnName: 'offsetQuantity',
                        maxLength: 13,
                        width: 150,
                        align: 'right',
                        getFieldDecoratored: true,
                        render: (offsetQuantity, record, index, dataSource, validConfig) => {
                            let str1 = (
                                <React.Fragment>
                                    <Form.Item
                                        name={[this.dataPrefix, record.key, 'offsetQuantityShow']}
                                        initialValue={fixedDecimal(offsetQuantity, quantityDecimalNum)}
                                    >
                                        <Input className={cx("readOnly")} readOnly style={{"textAlign": 'right'}} />
                                    </Form.Item>
                                </React.Fragment>
                            );
                            let str2 = (
                                <React.Fragment>
                                    <Form.Item
                                        name={[this.dataPrefix, record.key, 'offsetQuantity']}
                                        initialValue={fixedDecimal(offsetQuantity, quantityDecimalNum)}
                                        style={{display:"none"}}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </React.Fragment>
                            );
                            return  <React.Fragment>
                                {str1}
                                {str2}
                            </React.Fragment>
                        },
                    },{
                        title: intl.get("stocktaking.add.prodList.result"),
                        key: 'result',
                        columnName: 'result',
                        maxLength: 20,
                        width: 150,
                        align: 'right',
                        readOnly: true
                    }]}
                    hideRecQuantityColumn={true}
                    hideAmountColumn = {true}
                    hideUnitPriceColumn ={true}
                    hideTotalQuantity={true}
                    hideTotalAmount={true}
                    // onInsertGoods={this.handleInsertGoods} //当一条物品插入表格时候的回调
                    goodsPopCarryFields={{
                        'currentQuantity': 'systemNum',  //key为弹层中的字段名称， value为表格中的字段名称
                    }}
                    prodCodeSuggestSelect={this.handleSuggestGoods} //物品编号联想选择回调
                    prodNameSuggestSelect={this.handleSuggestGoods} //物品名称联想选择回调
                    goodsOnlySelect
                    onClearAllGoods={this.handleClearAllGoods}
                    source={'stock'}
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