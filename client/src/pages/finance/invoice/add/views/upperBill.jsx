import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency, removeCurrency} from 'utils/format';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import FinanceTable from 'components/business/finance';

class UpperBill extends Component {
    dataPrefix="dataList";

    render() {

        return (

            <React.Fragment>
                <FinanceTable
                    {...this.props}
                    initGoodsTableData={this.props.initGoodsTableData}
                    initTotalAmount={this.props.initTotalAmount}
                    backCustomerOrSupplier={this.props.backCustomerOrSupplier}
                    dataName={{
                        billNo: 'billNo',
                        displayBillNo: 'displayBillNo',
                        aggregateAmount: 'aggregateAmount',
                        payAmount: 'payAmount',
                        waitPay: 'amount',
                        remarks: 'remarks'
                    }}
                    financeType={'invoice'}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(UpperBill)