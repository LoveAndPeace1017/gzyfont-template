import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, message
} from 'antd';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {asyncFetchSaleById} from '../actions'

import OrderList from "../dependencies/orderList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Decimal} from 'decimal.js';

const cx = classNames.bind(styles);

class CopyFromOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            customerSearchBtnVisible:false,
            params:{},
            selectedRows:[],
            selectedPreviousRows: [], //点击确定之前的状态
            selectedRowKeys:[],
            selectedPreviousRowKeys:[],
            innerPrevSelectedRows: [],
            innerSelectedRows: []
        }
    }

    onSelectRowChange = (selectedPreviousRowKeys,selectedPreviousRows)=>{
        this.setState({
            selectedPreviousRowKeys,
            selectedPreviousRows
        })
    };
    onSelectInnerRowChange = (innerPrevSelectedRows) => {
        this.setState({
            innerPrevSelectedRows
        })
    };

    onOk = ()=>{
        const {innerPrevSelectedRows, selectedPreviousRowKeys, selectedPreviousRows} = this.state;
        this.setState({
            innerSelectedRows: innerPrevSelectedRows,
            selectedRowKeys: selectedPreviousRowKeys,
            selectedRows: selectedPreviousRows
        });
        const chooseProdList = innerPrevSelectedRows;
        let billNo = null;
        if(selectedPreviousRows[0]){
            billNo = selectedPreviousRows[0].billNo;
        }
        if(!billNo){
            message.error('至少选择1个物品');
            return;
        }
        this.props.asyncFetchSaleById(billNo, res=>{
            if(res && res.retCode === '0'){
                let {warehouseName} = res.data;
                if(warehouseName && this.props.onFillWarehouse){
                    this.props.onFillWarehouse(warehouseName);
                }
                res.data.prodList = res.data.prodList.filter(item => {
                   item.unStockIn = new Decimal(item.quantity);
                   item.unStockIn = Math.max(0, item.unStockIn.minus(item.quantityDelivered)).toString();
                   return chooseProdList.indexOf(item.prodCustomNo) !== -1;
                });
                this.props.onOk(res.data,this.props.visibleFlag);
            }
        });
    };

    render(){

        return(
                <Modal
                    {...this.props}
                    title={intl.get("components.copyFromOrder.index.choosePurchaseOrder")}
                    width={''}
                    destroyOnClose={true}
                    okButtonProps={{
                        'ga-data':this.props.copySource + '-copy-from-purchase-ok'
                    }}
                    cancelButtonProps={{
                        'ga-data':this.props.copySource + '-copy-from-purchase-cancel'
                    }}
                    onOk={this.onOk}
                    okText={intl.get("components.copyFromOrder.index.okText")}
                    cancelText={intl.get("components.copyFromOrder.index.cancelText")}
                    confirmLoading={this.props.saleInfo.get('isFetching')}
                    className={cx("copy-order-pop")+" list-pop"}
                >
                    <OrderList {...this.props}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedRows={this.state.selectedRows}
                        innerSelectedRows={this.state.innerSelectedRows}
                        onSelectRowChange={this.onSelectRowChange}
                        onSelectInnerRowChange={this.onSelectInnerRowChange}
                    />
                </Modal>
        )
    }
};

const mapStateToProps = (state) => ({
    saleInfo: state.getIn(['copyFromSale', 'saleInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleById
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyFromOrder)

