import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Tabs
} from 'antd';

const TabPane = Tabs.TabPane


import styles from "../styles/index.scss";
import classNames from "classnames/bind";

import SalePop from "../dependencies/salePop";
import OrderPop from "../dependencies/orderPop";


const cx = classNames.bind(styles);

export default class BillPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // loading: false,
            // customerSearchBtnVisible: false,
            // params: {},
            selectedRows: [],
            selectedRowKeys: [],
        }
    }

    onSelectRowChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    };

    onOk = () => {
        if (this.state.selectedRows.length !== 0) {
            let list = this.state.selectedRows;
            list = list && list.map((item, index) => ({
                ...item,
                serial: index + 1
            }));
            this.props.onOk(list, this.props.visibleFlag);
        }
    };

    render() {
        let {popType} = this.props;
        const Pop = popType === 'sale' ? SalePop : OrderPop;
        return (
            <Modal
                {...this.props}
                title={popType === 'sale' ? intl.get("components.billPop.index.chooseSaleOrder"): intl.get("components.billPop.index.choosePurchaseOrder")}
                width={''}
                destroyOnClose={true}
                onOk={this.onOk}
                okText={intl.get("components.billPop.index.okText")}
                cancelText={intl.get("components.billPop.index.cancelText")}
                className={"list-pop"}
            >
                <Pop {...this.props}
                     selectedRowKeys={this.state.selectedRowKeys}
                     selectedRows={this.state.selectedRows}
                     onSelectRowChange={this.onSelectRowChange}
                />

            </Modal>
        )
    }
};

