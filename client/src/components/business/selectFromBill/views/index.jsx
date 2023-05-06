import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Tabs
} from 'antd';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import SalePop from "../dependencies/salePop";
import OrderPop from "../dependencies/orderPop";
import {message} from "antd/lib/index";

const cx = classNames.bind(styles);

export default class CopyFromSale extends Component{
    constructor(props){
        super(props);
        this.state = {
            // loading:false,
            // customerSearchBtnVisible:false,
            params:{},
            selectedRows:[],
            selectedRowKeys:[],
        }
    }

    onSelectRowChange = (selectedRowKeys,selectedRows)=>{
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    };

    onOk = ()=>{
        let {financeType, currencyVipFlag} = this.props;
        const isSale = financeType === 'income' || financeType === 'saleInvoice';
        const content = isSale ?  intl.get("components.selectFromBill.index.msg1") : intl.get("components.selectFromBill.index.msg2") ;

        const NumberGroup =  this.state.selectedRows.map(item => {
            return isSale ? item.customerNo : item.supplierName;
        });

        if(currencyVipFlag === 'true' && financeType === 'income'){
            let isSameCurrencyFlag = true;
            let currentCurrencyName = this.state.selectedRows[0].currencyName;
            for(let i=1; i<this.state.selectedRows.length; i++){
                if(this.state.selectedRows[i].currencyName != currentCurrencyName){
                    isSameCurrencyFlag = false;
                    break;
                }
            }
            if(!isSameCurrencyFlag){
                message.info('销售订单币种不同，无法合并收入');
                return false;
            }
        }

        if(financeType === 'saleInvoice'){
            let currencyList =  this.state.selectedRows.filter(item => !item.currencyFlag);
            if(currencyList.length > 0){
                message.info('暂不支持多币种单据开票');
                return false;
            }
        }

        // 如果没有重复供应商或客户方可提交
        if([...new Set(NumberGroup)].length > 1){
            Modal.warning({
                content: content,
                okText: intl.get("components.selectFromBill.index.confirm"),
            });
        }else {
            this.props.onOk(this.state.selectedRows,this.props.visibleFlag);
        }
    };

    render(){
        let {financeType} = this.props;
        const isSale = financeType === 'income' || financeType === 'saleInvoice';
        const Pop = isSale ? SalePop : OrderPop;

        return(
            <Modal
                {...this.props}
                title={isSale ? intl.get("components.selectFromBill.index.chooseSaleOrder")  : intl.get("components.selectFromBill.index.choosePurchaseOrder")}
                width={''}
                destroyOnClose={true}
                onOk={this.onOk}
                okText={intl.get("components.selectFromBill.index.okText")}
                cancelText={intl.get("components.selectFromBill.index.cancelText")}
                className={"list-pop"}
            >
                <Pop {...this.props}
                     onSelectRowChange={this.onSelectRowChange}
                />
            </Modal>
        )
    }
};


