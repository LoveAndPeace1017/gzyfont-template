import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {numberReg} from 'utils/reg';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
import {formatCurrency, removeCurrency} from 'utils/format';
import defaultOptions from 'utils/validateOptions';
import goodsTable from 'components/business/newGoods';
import AbizCate from 'components/business/abizCate';
import {Input, Form} from "antd";
import _ from 'lodash';
import {asyncFetchCateByName} from '../actions';

const Goods = goodsTable();

class ProdList extends Component {

    dataPrefix="prod";
    carryTitleFlag=false;

    state={
        open: {},
        deliveryAddrData:[],
        recommendation: {}
    };

    //如果没有选择物品则下拉选择类目点不开
    matchCateDropdown=(open, key)=>{
        let {getFieldValue} = this.props.formRef.current;
        if(open){
            const productCode = getFieldValue([this.dataPrefix, key, 'productCode']);
            if(productCode){
                this.setState((prevState)=>{
                    return {
                        open: {...prevState.open, [key]: true}
                    }
                })
            }
        }else{
            this.setState((prevState)=>{
                return {
                    open: {...prevState.open, [key]: false}
                }
            })
        }
    };

    handleInsertGoods = (goodsItem, insertLineKey, source) => {
        let {setFieldsValue} = this.props.formRef.current;
        if(source === 'scan'){
            setFieldsValue({
                [this.dataPrefix]: {
                    [insertLineKey]: {
                        purchaseQuantity: goodsItem.quantity
                    }
                }
            });
        }
       this.fillCate(goodsItem, insertLineKey)
    };

    handleIncreaseGoodsQuantity=(key, updateQuantity)=>{
        let {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({
            [this.dataPrefix]: {
                [key]: {
                    purchaseQuantity: removeCurrency(formatCurrency(updateQuantity, 3, true))
                }
            }
        });
    };

    prodNameSuggestSelect = (goodsItem, insertLineKey)=>{
        this.fillCate(goodsItem, insertLineKey)
    };

    prodCodeSuggestSelect =  (goodsItem, insertLineKey)=>{
        this.fillCate(goodsItem, insertLineKey)
    };

    fillCate = (goodsItem, insertLineKey)=>{
        const {setFieldsValue, getFieldValue} = this.props.formRef.current;
        const prodName = goodsItem.prodName;
        const infoTitle = getFieldValue('infoTitle');
        if(!infoTitle){
            //没有标题就带入标题
            setFieldsValue({
                infoTitle: intl.get("inquiry.add.prodList.purchase")+prodName
            });
            this.carryTitleFlag = true
        }else if(this.carryTitleFlag){
            //有标题同时之前已经带入标题了，再选物品就在标题后面加上等
            const nextInfoTitle = getFieldValue('infoTitle');
            setFieldsValue({
                infoTitle: nextInfoTitle + intl.get("inquiry.add.prodList.soOn")
            });
            this.carryTitleFlag = false
        }
        this.props.asyncFetchCateByName(prodName, insertLineKey, (recommendation)=>{
            const catCode = Object.keys(recommendation)[0].split('_')[1];
            const catName = Object.values(recommendation)[0].join('>');
            setFieldsValue({
                [this.dataPrefix]: {
                    [insertLineKey]: {
                        catCode: {
                            key: catCode,
                            label: catName
                        }
                    }
                }
            });
            this.setState((prevState)=>{
                const copyRecommendation = _.cloneDeep(prevState.recommendation);
                return {
                    recommendation: {
                        ...copyRecommendation,
                        [insertLineKey]: recommendation
                    }
                }
            })
        });
    };

    // beforeOnOk=()=>{
    //
    // };

    handleSelectAllCate = (selectedKeys, selectedCatePath, key) =>{
        console.log('prodList selectedKeys' + selectedKeys, selectedCatePath);
        const {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({
            [this.dataPrefix]: {
                [key]: {
                    catCode: {
                        key: selectedKeys[0],
                        label: selectedCatePath
                    }
                }
            }
        });
    };

    render() {
        const reg = numberReg.numberOnlyThree;
        return (

            <React.Fragment>
                <div className={cx("prod-list-tips")}>{intl.get("inquiry.add.prodList.tip_1")}<strong>10</strong>{intl.get("inquiry.add.prodList.tip_2")}</div>
                <Goods
                    {...this.props}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    goodsOnlySelect
                    hideOtherGoodsColumns
                    hideCustomGoodsColumns
                    hideUntaxedPriceColumn
                    hideUntaxedAmountColumn
                    hideTaxRateColumn
                    hideTaxColumn
                    //要修改字段提交的名称传下面这个参数修改，value为你需要改的字段名称
                    dataName ={{
                        // productCode: 'productNo',
                        // prodCustomNo: 'prodCustomNo',
                        descItem: 'itemSpec',
                        unit: 'purchaseUnitText',
                        quantity: 'purchaseQuantity'
                    }}
                    receiptColumns={[{
                        title: intl.get("inquiry.add.prodList.catCode"),
                        key: 'catCode',
                        required: true,
                        rules: [
                            {
                                rule: function(val) {
                                    return !(val && val.key && val.label);
                                },
                                message: intl.get("inquiry.add.prodList.catCodeMessage"),
                                required: true
                            }
                        ],
                        getFieldDecoratored: true,
                        render: (actualNum, record, index, dataSource, validConfig, requiredFlag) => {
                            return (
                                <Form.Item {...defaultOptions}
                                           name={[this.dataPrefix, record.key, 'catCode']}
                                           rules={validConfig}
                                >
                                    <AbizCate initOptions={this.state.recommendation[record.key]}
                                              open={this.state.open[record.key]}
                                              onDropdownVisibleChange={(open)=>this.matchCateDropdown(open, record.key)}
                                              onSelectAllCate={(selectedKeys, selectedCatePath)=>this.handleSelectAllCate(selectedKeys, selectedCatePath, record.key)}
                                    />
                                </Form.Item>
                            );
                        },
                    },{
                        title: intl.get("inquiry.add.prodList.purchaseQuantity"),
                        key: 'purchaseQuantity',
                        width: 150,
                        align: 'right',
                        required: true,
                        rules: [
                            {
                                rule: function(val) {
                                    return val && !reg.rules.test(val);
                                },
                                message: reg.message
                            },
                            {
                                rule: function(val) {
                                    return val === '0';
                                },
                                message: intl.get("inquiry.add.prodList.purchaseQuantityMessage")
                            }
                        ],
                        getFieldDecoratored: true,
                        render: (actualNum, record, index, dataSource, validConfig) => {
                            return (
                                <Form.Item {...defaultOptions}
                                           initialValue={removeCurrency(formatCurrency(actualNum, 3, true))}
                                           name={[this.dataPrefix, record.key, 'purchaseQuantity']}
                                           rules={validConfig}
                                >
                                    <Input style={{"textAlign": 'right'}} />
                                </Form.Item>
                            )
                        },
                    }]}
                    hideRecQuantityColumn
                    hideUnitPriceColumn
                    hideAmountColumn
                    hideRemarks
                    hideTotalQuantity
                    hideTotalAmount
                    onInsertGoods={this.handleInsertGoods} //当一条物品插入表格时候的回调
                    onIncreaseGoodsQuantity={this.handleIncreaseGoodsQuantity}
                    prodNameSuggestSelect={this.prodNameSuggestSelect}
                    prodCodeSuggestSelect={this.prodCodeSuggestSelect}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    matchAbizCate: state.getIn(['inquiryAdd', 'matchAbizCate'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCateByName
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdList)