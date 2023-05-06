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
import {ExclamationCircleTwoTone} from '@ant-design/icons';
import {Decimal} from 'decimal.js';

const cx = classNames.bind(styles);

class CopyFromSale extends Component{
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
        this.props.asyncFetchSaleById(billNo,this.props.unitPriceSource, res=>{
            if(res && res.retCode === '0'){
                res.data.prodList = res.data.prodList.filter(item => {
                    item.unStockOut = item.unOutNum;
                    return chooseProdList.indexOf(item.id) !== -1;
                });
                let {warehouseName} = res.data;
                if(warehouseName && this.props.onFillWarehouse){
                    this.props.onFillWarehouse(warehouseName);
                }
                if(this.props.copySource === 'purchase'){
                    //上游单号处理，取data里的displayBillNo
                    res.data.prodList.filter((e)=>{
                        e.saleBillNo = res.data.billNo;
                        e.displaySaleBillNo = res.data.displayBillNo;
                        return e;
                    });
                    this.props.onOk({...res.data, prodList: res.data.prodList},this.props.visibleFlag); //采购只带出列表信息
                } else if(this.props.copySource === 'outbound'){
                    let quotation = res.data.quotation || 100;
                    res.data.prodList.forEach((item)=>{
                        item.unitPrice = item.unitPrice*(quotation/1)/100;
                    });
                    this.props.onOk(res.data,this.props.visibleFlag);
                }else{
                    this.props.onOk(res.data,this.props.visibleFlag);
                }
            }
        });
    };

    render(){

        return(
                <Modal
                    {...this.props}
                    title={
                        <>
                            <span>请选择销售订单</span>
                            <span style={{marginLeft: "6px",fontSize: "12px"}}>
                                <ExclamationCircleTwoTone style={{fontSize: "16px",marginRight: "4px"}}/>物品出库单价将按照销售订单内单价及牌价换算为人民币保存
                            </span>
                        </>
                    }
                    width={''}
                    destroyOnClose={true}
                    okButtonProps={{
                        'ga-data':this.props.copySource + '-copy-from-sale-ok'
                    }}
                    cancelButtonProps={{
                        'ga-data':this.props.copySource + '-copy-from-sale-cancel'
                    }}
                    onOk={this.onOk}
                    okText={intl.get("components.copyFromSale.index.okText")}
                    cancelText={intl.get("components.copyFromSale.index.cancelText")}
                    confirmLoading={this.props.saleInfo.get('isFetching')}
                    className={cx("copy-sale-pop")+" list-pop"}
                >
                    <OrderList {...this.props}
                        copySource={this.props.copySource}
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
    saleInfoIsFetching: state.getIn(['copyFromSale', 'saleInfo', 'isFetching']),
    saleInfo: state.getIn(['copyFromSale', 'saleInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleById
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyFromSale)

