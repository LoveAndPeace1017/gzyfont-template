import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Tabs
} from 'antd';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {asyncFetchSaleById} from '../actions'

import OrderList from "../dependencies/orderList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
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

    onOk = ()=>{
        const {selectedPreviousRowKeys, selectedPreviousRows} = this.state;
        this.setState({
            selectedRowKeys: selectedPreviousRowKeys,
            selectedRows: selectedPreviousRows
        });
        this.props.onOk(selectedPreviousRows,this.props.visibleFlag);
    };

    render(){

        return(
                <Modal
                    {...this.props}
                    title={intl.get("components.copyFromSale.index.chooseSaleOrder")}
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
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedRows={this.state.selectedRows}
                        innerSelectedRows={this.state.innerSelectedRows}
                        onSelectRowChange={this.onSelectRowChange}
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

