import React, {Component} from 'react';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {AuthInput} from 'components/business/authMenu';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {Input, Spin} from "antd";
import Tooltip from 'components/widgets/tooltip';
import {SelectRate} from 'pages/auxiliary/rate'
const cx = classNames.bind(styles);

export default function withQuantityAmount(WrappedComponent) {
    return class WithTotalCalc extends Component {

        constructor(props) {
            super(props);
            this.state = {
                totalAmount: 0
            }
        }

        setTotalAmount = (totalAmount) => {
            this.setState({
                totalAmount
            })
        };

        calTotalAmount = (values, emptyKeys) => {
            console.log(values, '**');
            const {form: {getFieldValue}} = this.props;
            const dataSource = this.props.ordersInfo.get('data').toJS();

            //刚添加的数量之和
            let totalAmount = 0;

            values.forEach((value, index) => {
                let amount = value.waitPay;
                amount = amount ? parseFloat(amount) : 0;

                totalAmount += amount;
            });

            const allKeys = dataSource.map(item => {
                return item.key
            });

            //排除已存在行中刚添加数据的key
            const oldKeys = this.props.includeANotB(allKeys, emptyKeys);

            oldKeys.forEach(key => {
                let amount = getFieldValue(`${this.props.dataPrefix}[${key}].${this.props.dataName.waitPay}`);
                amount = amount ? parseFloat(amount) : 0;
                totalAmount += amount;
            });

            this.setState({
                totalAmount
            })

        };

        render() {
            return <WrappedComponent
                {...this.props}
                setTotalAmount={this.setTotalAmount}
                // calcTotal={this.calcTotal}
                totalAmount={this.state.totalAmount}
                calTotalAmount={this.calTotalAmount}
            />
        }

    }
}