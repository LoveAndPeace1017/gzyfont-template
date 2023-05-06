import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import Base from './base';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

/**
 * @visibleName WithFooter（尾部合计组件）
 * @author jinb
 */
export default function withFooter(WrappedComponent) {

    return class withFooter extends Base {
        static propTypes = {
            currencyVipFlag : PropTypes.string,   // 多币种服务状态 false: 未开启或者已到期  true: 试用中或者已续费
        };

        /** 获取合计相关的值*/
        getTotalForm = (type) => {
            let {getFieldValue} = this.props.formRef.current;
            return type && getFieldValue([type]);
        };

        /** 填充合计相关的值*/
        setTotalForm = ({ totalAmount, totalCurrencyAmount }) => {
            Base.isNotEmpty(totalAmount) && this.setTotalAmount(totalAmount);
            Base.isNotEmpty(totalCurrencyAmount) && this.setTotalCurrencyAmount(totalCurrencyAmount);
        };

        /** 填充总金额 */
        setTotalAmount = (totalAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                totalAmount: removeCurrency(formatCurrency(totalAmount), 2, true)
            });
        };

        setTotalCurrencyAmount = (totalCurrencyAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                totalCurrencyAmount: removeCurrency(formatCurrency(totalCurrencyAmount), 2, true)
            });
        };

        render(){
            let { currencyVipFlag } = this.props;

            let footer = (
                <div className={cx("tb-footer-wrap")+ " cf"}>
                    <div className={cx('total')}>
                        <span>收入总金额: <b>
                        <Form.Item name="totalAmount"
                                   initialValue={removeCurrency(formatCurrency(0))}
                                   {...Base.formItemLayout}
                                   style={{display: 'inline-block'}}
                        >
                            <Input style={{color:"#e53e3e",width: "170px",position: "relative",top: "2px"}} bordered={false}
                                   disabled
                            />
                        </Form.Item>
                        </b> 元</span>

                        {
                            currencyVipFlag === 'true' && (
                                <React.Fragment>
                                    <span style={{'marginLeft': '50px'}}>本币总金额: <b>
                                    <Form.Item name="totalCurrencyAmount"
                                               initialValue={removeCurrency(formatCurrency(0))}
                                               {...Base.formItemLayout}
                                               style={{display: 'inline-block'}}
                                    >
                                        <Input style={{color:"#e53e3e",width: "170px",position: "relative",top: "2px"}} bordered={false}
                                               disabled
                                        />
                                    </Form.Item>
                                    </b> 元</span>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
            );

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        getTotalForm={this.getTotalForm}
                        setTotalForm={this.setTotalForm}
                        setTotalAmount={this.setTotalAmount}
                        footer={footer}
                    />
                </React.Fragment>
            )
        }
    }
}

