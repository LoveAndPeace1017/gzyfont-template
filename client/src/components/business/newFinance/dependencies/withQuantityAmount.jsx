import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {AuthInput} from 'components/business/authMenu';
import {SelectRate} from 'pages/auxiliary/rate'
import _ from "lodash";

export default function withQuantityAmount(WrappedComponent) {
    return class withQuantityAmount extends Component {
        static propTypes = {
            currencyVipFlag : PropTypes.string   // 多币种服务状态 false: 未开启或者已到期  true: 试用中或者已续费
        };

        constructor(props) {
            super(props);
            this.state = {
                amount: 0
            }
        }

        /** 当某一行的数据发生改变时，通过改方法计算合计*/
        calcTotalForOneRow = (amount=0) => {
            let {getTotalForm, setTotalForm, currencyVipFlag} = this.props;
            let totalAmount = getTotalForm('totalAmount');
            totalAmount = _.add(totalAmount*1, amount*1);
            setTotalForm({ totalAmount });
            if(currencyVipFlag === 'true') {   // 当多币种服务状态开启时
                const {getFieldValue} = this.props.formRef.current;
                let quotation = getFieldValue('quotation') || 100;
                let totalCurrencyAmount = getTotalForm('totalCurrencyAmount');
                totalCurrencyAmount = _.add(totalCurrencyAmount*1, amount * quotation / 100);
                setTotalForm({ totalCurrencyAmount });
            }
        };


        /**
         * 计算总数量
         * **/
        calTotalAmount = () => {
            let {getFormField, setTotalForm, currencyVipFlag} = this.props;
            setTimeout(()=>{
                let totalAmount = 0, totalCurrencyAmount = 0;
                let dataSource = getFormField();
                _.forIn(dataSource, (data) =>{
                    if (data){
                        if(data.amount) totalAmount += data.amount*1;
                        if(currencyVipFlag === 'true' && data.currencyAmount){  // 当多币种服务状态开启时
                            totalCurrencyAmount += data.currencyAmount*1;
                        }
                    }
                });
                setTotalForm({ totalAmount });
                if(currencyVipFlag === 'true'){
                    setTotalForm({ totalCurrencyAmount });
                }
            },50)
        };


        render() {
            return <WrappedComponent
                {...this.props}
                calcTotalForOneRow={this.calcTotalForOneRow}
                calTotalAmount={this.calTotalAmount}
            />
        }
    }
}