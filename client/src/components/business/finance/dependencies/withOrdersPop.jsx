import React, {Component} from 'react';
import SelectFromBill from 'components/business/selectFromBill';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function withOrdersPop(WrappedComponent) {

    return class WithOrdersPop extends Component {

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

        selectGoods = (key) => {
            this.openModal('ordersPopVisible');
            this.props.setSelectedLineKey(key);
        };

        closeSelectOrders = () => {
            this.closeModal('ordersPopVisible');
            this.props.setSelectedLineKey('');
        };

        beforeOnOk = (callback)=>{
            if(this.props.beforeOnOk){
                this.props.beforeOnOk(callback);
            }else{
                callback();
            }
        };

        onOk = (selectedRows, visibleKey, popType) => {
            this.beforeOnOk(()=>{
                this.closeModal(visibleKey);
                const {financeType} = this.props;
                const isInvoice = (financeType === 'invoice' || financeType === 'saleInvoice');
                let selectedRowsObj={};
                const orderList = selectedRows.map(item => {
                    item.billNo && (selectedRowsObj[item.billNo] = item);
                    delete item.key; //不删除key，它会覆盖组件redux数据中的key会导致数据提交出问题
                    return {
                        ...item,
                        billNo: item.billNo,
                        displayBillNo: item.displayBillNo,
                        aggregateAmount: item.aggregateAmount,
                        payAmount: isInvoice ? item.invoiceAmount :item.payAmount,
                        waitPay: isInvoice ? item.waitInvoiceAmount :item.waitPay,
                    }
                });
                this.setState({
                    selectedRowsObj
                });
                this.props.fillGoods(orderList, (goods, emptyKeys)=>{
                    this.props.calTotalAmount(goods, emptyKeys);
                });
            })
        };

        getExistRows = () => {
            const {form: {getFieldValue}, ordersInfo} = this.props;
            const {selectedRowsObj} = this.state;
            const dataSource = ordersInfo.get('data').toJS();
            console.log(dataSource,'dataSourcesd');
            const existRows = dataSource.map(item => {
                const billNo = getFieldValue(`${this.props.dataPrefix}[${item.key}].${this.props.dataName.billNo}`);
                const displayBillNo = getFieldValue(`${this.props.dataPrefix}[${item.key}].${this.props.dataName.displayBillNo}`);
                const aggregateAmount = getFieldValue(`${this.props.dataPrefix}[${item.key}].${this.props.dataName.aggregateAmount}`);
                const payAmount = getFieldValue(`${this.props.dataPrefix}[${item.key}].${this.props.dataName.payAmount}`);
                const waitPay = getFieldValue(`${this.props.dataPrefix}[${item.key}].${this.props.dataName.waitPay}`);
                const remarks = getFieldValue(`${this.props.dataPrefix}[${item.key}].${this.props.dataName.remarks}`);

                if (billNo) {
                    let info = selectedRowsObj[billNo] || {};
                    const items = {
                        ...info,
                        billNo,
                        displayBillNo,
                        aggregateAmount,
                        payAmount,
                        waitPay,
                        remarks
                    };

                    return items;
                }
            });
            return existRows.filter(item => item);
        };

        render(){
            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        selectGoods={this.selectGoods}
                    />
                    <SelectFromBill
                        {...this.props}
                        visible={this.state.ordersPopVisible}
                        visibleFlag={'ordersPopVisible'}
                        onOk={this.onOk}
                        onCancel={this.closeSelectOrders}
                        selectType={"checkbox"}
                        selectedRowKeys={this.props.getExistIds()}
                        selectedRows={this.getExistRows()}
                    />
                </React.Fragment>
            )
        }
    }

}

