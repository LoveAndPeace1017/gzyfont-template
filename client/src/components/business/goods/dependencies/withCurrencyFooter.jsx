import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
import Base from './base';
import DiscountInput from  './discountInput';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

/**
 * @visibleName WithCurrencyFooter（尾部多币种合计组件）
 * @author jinb
 */
export default function WithCurrencyFooter(WrappedComponent) {

    return class WithCurrencyFooter extends Base {
        static propTypes = {
            /** 来源*/
            source: PropTypes.string,
        };

        static defaultProps = {
            defaultAuthType: 'show'
        };

        /** 获取合计相关的值*/
        getTotalForm = (type) => {
            let {getFieldValue} = this.props.formRef.current;
            return type ? getFieldValue([type]): {
                totalQuantity: getFieldValue('totalQuantity'),
                totalAmount: getFieldValue('totalAmount'),
                aggregateAmount: getFieldValue('aggregateAmount'),
                discountAmount: getFieldValue('discountAmount'),
                currencyTotalAmount: getFieldValue('currencyTotalAmount')
            };
        };

        /** 填充合计相关的值*/
        setTotalForm = ({totalQuantity, totalAmount, aggregateAmount, discountAmount, currencyTotalAmount}) => {
            Base.isNotEmpty(totalQuantity) && this.setTotalQuantity(totalQuantity);
            Base.isNotEmpty(totalAmount) && this.setTotalAmount(totalAmount);
            Base.isNotEmpty(aggregateAmount) && this.setAggregateAmount(aggregateAmount);
            Base.isNotEmpty(discountAmount) && this.setDiscountAmount(discountAmount, true);
            Base.isNotEmpty(currencyTotalAmount) && this.setCurrencyTotalAmount(currencyTotalAmount);
        };

        /** 填充总数量*/
        setTotalQuantity = (totalQuantity) => {
            let {setFieldsValue} = this.props.formRef.current;
            let priceDecimalNum = getCookie("priceDecimalNum");
            setFieldsValue({
                totalQuantity: fixedDecimal(totalQuantity, priceDecimalNum)
            });
        };

        /** 填充总金额 */
        setTotalAmount = (totalAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                totalAmount: removeCurrency(formatCurrency(totalAmount))
            });
        };

        /** 填充优惠金额 */
        setAggregateAmount = (aggregateAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                aggregateAmount: removeCurrency(formatCurrency(aggregateAmount))
            });
        };

        /** 填充优惠后金额 */
        setDiscountAmount = (discountAmount, initFlag) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let quotation = getFieldValue('quotation') || 100;
            setFieldsValue({
                discountAmount: discountAmount
            });
            let aggregateAmount = getFieldValue('totalAmount')*1 - discountAmount*1;
            let currencyTotalAmount = aggregateAmount * quotation / 100;
            if(!initFlag){
                setFieldsValue({
                    aggregateAmount: removeCurrency(formatCurrency(aggregateAmount)),
                    currencyTotalAmount: removeCurrency(formatCurrency(currencyTotalAmount))
                })
            }
        };

        /** 填充本币总金额 */
        setCurrencyTotalAmount = (currencyTotalAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                currencyTotalAmount: removeCurrency(formatCurrency(currencyTotalAmount))
            });
        };

        render(){
            let {source} = this.props;
            let {getFieldValue} = this.props.formRef.current;

            let footer = (
                <div className={cx("tb-footer-wrap") + " cf"}>
                    <div className={cx('total')}>
                        <span>总数量:<b>
                                <React.Fragment>
                                    <Form.Item name="totalQuantity"
                                               initialValue={formatCurrency(0, 3)}
                                               {...Base.formItemLayout}
                                               className={'form-x'}
                                               style={{display: 'inline-block'}}
                                    >
                                        <Input style={{color:"#e53e3e",width: "140px",position: "relative",top: "2px"}} bordered={false}
                                               disabled
                                        />
                                    </Form.Item>
                                </React.Fragment></b>
                        </span>

                        <span>总金额: <b>
                                <Auth module={Base.SOURCE_MAP[source].priceAuthModule}
                                      option={this.props.defaultAuthType}>{
                                    (isAuthed) => isAuthed ?
                                        <React.Fragment>
                                            <Form.Item name="totalAmount"
                                                       initialValue={removeCurrency(formatCurrency(0))}
                                                       {...Base.formItemLayout}
                                                       style={{display: 'inline-block'}}
                                            >
                                                <Input style={{color:"#e53e3e",width: "170px",position: "relative",top: "2px"}} bordered={false}
                                                       disabled
                                                />
                                            </Form.Item>
                                        </React.Fragment> : '**'
                                }</Auth>
                            </b>元
                        </span>

                        <React.Fragment>
                            <Auth module={Base.SOURCE_MAP[source].priceAuthModule}
                                  option={this.props.defaultAuthType}>
                                {
                                    (isAuthed) => isAuthed ? (
                                        <React.Fragment>
                                            <span style={{display: 'inline-block'}}>
                                                <DiscountInput
                                                    {...this.props}
                                                    title={'优惠金额'}
                                                    totalAmount={getFieldValue('totalAmount')}
                                                    onChange={(val) => this.setDiscountAmount(val, false)}
                                                />
                                            </span>
                                            <span style={{margin: '0 10px 0 -30px'}}>
                                                元
                                                <Tooltip title={'在APP上修改此单据请先更新至最新版本，否则可能出现数据错误！'}>
                                                        <Icon type="question-circle" className={cx("discount-tip")} theme="filled"/>
                                                </Tooltip>
                                            </span>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <span>优惠金额: <b>
                                                **</b>
                                                元
                                            </span>
                                        </React.Fragment>
                                    )
                                }
                            </Auth>

                            <span>优惠后金额: <b>
                                        <Auth module={Base.SOURCE_MAP[source].priceAuthModule}
                                              option={this.props.defaultAuthType}>
                                            {
                                                (isAuthed) => isAuthed ?
                                                    <React.Fragment>
                                                        <Form.Item name="aggregateAmount"
                                                                   initialValue={removeCurrency(formatCurrency(0))}
                                                                   {...Base.formItemLayout}
                                                                   style={{display: 'inline-block'}}
                                                        >
                                                            <Input style={{color:"#e53e3e",width: "170px",position: "relative",top: "2px"}} bordered={false}
                                                                   disabled
                                                            />
                                                        </Form.Item>
                                                    </React.Fragment> : '**'
                                            }
                                        </Auth>
                                    </b>元
                            </span>

                            <span>本币总金额: <b>
                                        <Auth module={Base.SOURCE_MAP[source].priceAuthModule}
                                              option={this.props.defaultAuthType}>
                                            {
                                                (isAuthed) => isAuthed ?
                                                    <React.Fragment>
                                                        <Form.Item name="currencyTotalAmount"
                                                                   initialValue={removeCurrency(formatCurrency(0))}
                                                                   {...Base.formItemLayout}
                                                                   style={{display: 'inline-block'}}
                                                        >
                                                            <Input style={{color:"#e53e3e",width: "170px",position: "relative",top: "2px"}} bordered={false}
                                                                   disabled
                                                            />
                                                        </Form.Item>
                                                    </React.Fragment> : '**'
                                            }
                                        </Auth>
                                    </b>元
                             </span>
                        </React.Fragment>
                    </div>
                </div>
            );

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        getTotalForm={this.getTotalForm}
                        setTotalForm={this.setTotalForm}
                        setTotalQuantity={this.setTotalQuantity}
                        setTotalAmount={this.setTotalAmount}
                        setAggregateAmount={this.setAggregateAmount}
                        setDiscountAmount={this.setDiscountAmount}
                        footer={footer}
                    />
                </React.Fragment>
            )
        }
    }
}

