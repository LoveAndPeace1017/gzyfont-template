import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency, removeCurrency} from 'utils/format';
import SelectFromBill from 'components/business/selectFromBill';
import {actions as currencyActions} from 'pages/auxiliary/multiCurrency';
import Base from './base';
import _ from "lodash";


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCurrencyDetail: currencyActions.asyncFetchCurrencyDetail
    }, dispatch)
};

@withRouter
@connect(null, mapDispatchToProps)
export default function withOrdersPop(WrappedComponent) {
    return class WithOrdersPop extends Base {
        static propTypes = {
            currencyVipFlag : PropTypes.string,   // 多币种服务状态 false: 未开启或者已到期  true: 试用中或者已续费
            orderPopCallback: PropTypes.func,  // 多币种服务状态开启时 弹层选择单据确定后的回调接口
        };

        constructor(props) {
            super(props);
            this.state = {
                ordersPopVisible: false,
                selectedRows: [],
                selectedRowsObj: {}
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

        selectGoods = () => {
            this.openModal('ordersPopVisible');
        };

        closeSelectGoods = () => {
            this.closeModal('ordersPopVisible');
        };

        getCurrencyDetail = (currencyId) => {
            return new Promise((resolve, reject) => {
                this.props.asyncFetchCurrencyDetail(currencyId, (res)=>{
                    resolve(res.data.paramValue); //获取当前币种的牌价
                });
            })
        };

        onOk = async (selectedRows, visibleKey) => {
            this.closeModal(visibleKey);
            const {financeType, fillList, currencyVipFlag, orderPopCallback, backCustomerOrSupplier} = this.props;
            const {getFieldValue} = this.props.formRef.current;
            let {orderPopPayAmountKey, orderPopAmountKey} = Base.SOURCE_MAP[financeType];
            let quotation = getFieldValue('quotation') || 100;
            let tempCurrencyId = getFieldValue('currencyId');
            if(currencyVipFlag === 'true'){ // 当多币种服务状态开启时，弹层选择单据确定后的回调接口， 改变当前的币种和牌照
                let { currencyId, currencyFlag } = selectedRows[0];   // 业务中所有单据的币种和牌照一样，因此取第0条
                if(currencyId && tempCurrencyId !== currencyId){ // 当与编辑页面的币种不相同的时候，才修改之前的币种和牌价
                    quotation = await this.getCurrencyDetail(currencyId);
                    tempCurrencyId = currencyId;
                    orderPopCallback && orderPopCallback({currencyId, quotation, currencyFlag});
                }
            }
            backCustomerOrSupplier && backCustomerOrSupplier(selectedRows);
            let selectedRowsObj={};
            const list = selectedRows.map(item => {
                item.billNo && (selectedRowsObj[item.billNo] = item);
                let out = {
                    billNo: item.billNo,
                    displayBillNo: item.displayBillNo,
                    aggregateAmount: item.aggregateAmount,
                    payAmount: item[orderPopPayAmountKey],
                    amount: item[orderPopAmountKey]
                };
                if(currencyVipFlag === 'true'){ // 当多币种服务状态开启时
                    out.currencyId = tempCurrencyId;
                    out.currencyFlag = item.currencyFlag;
                    out.currencyAmount = removeCurrency(formatCurrency(out.amount * quotation / 100, 2, true));
                }
                return out;
            });
            this.setState({
                selectedRowsObj
            });
            fillList(list, ()=>{
                this.props.calTotalAmount();
            });
        };

        /** 获取已经存在的列表数据*/
        getExistRows = () => {
            let array = [];
            let { financeType, currencyVipFlag } = this.props;
            const {selectedRowsObj} = this.state;
            let dataSource = this.props.getFormField();
            let {orderPopPayAmountKey, orderPopAmountKey} = Base.SOURCE_MAP[financeType];
            console.log(dataSource,'dataSourceInfo');
            _.forIn(dataSource, function(value) {
                if(!!value){
                    let info = value.billNo && (selectedRowsObj[value.billNo]) || {};
                    var obj = {
                        ...info,
                        key: value.billNo,
                        billNo: value.billNo,
                        displayBillNo: value.displayBillNo,
                        aggregateAmount: value.aggregateAmount,
                        [orderPopPayAmountKey]: value.payAmount,
                        [orderPopAmountKey]: value.amount
                    };
                    if(currencyVipFlag === 'true'){
                        obj.currencyId = value.currencyId;
                        obj.currencyFlag = value.currencyFlag;
                        obj.currencyAmount = value.currencyAmount;
                    }
                    array.push(obj);
                }
            });
            return array;
        };

        render(){
            let selectedRows = this.getExistRows() || [];
            let selectedRowKeys = _.map(selectedRows, item => item.key);

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        selectGoods={this.selectGoods}
                    />
                    <SelectFromBill
                        currencyVipFlag={this.props.currencyVipFlag}
                        financeType={this.props.financeType}
                        visible={this.state.ordersPopVisible}
                        visibleFlag={'ordersPopVisible'}
                        onOk={this.onOk}
                        onCancel={this.closeSelectGoods}
                        selectType={"checkbox"}
                        selectedRowKeys={selectedRowKeys}
                        selectedRows={selectedRows}
                    />
                </React.Fragment>
            )
        }
    }
}

