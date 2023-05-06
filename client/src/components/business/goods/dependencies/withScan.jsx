import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _ from "lodash";
import { Modal, Col, Input, Row, Form } from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {formatCurrency, removeCurrency} from 'utils/format';
import {actions as goodsIndexActions} from 'pages/goods/index';
import Tooltip from 'components/widgets/tooltip';
import Base from './base'
import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchBarcode: goodsIndexActions.asyncFetchBarcode,
    }, dispatch)
};

@withRouter
@connect(null, mapDispatchToProps)
export default function withScan(WrappedComponent) {
    return class WithScan extends Base {
        static propTypes = {
            /** 来源*/
            source: PropTypes.string,
            /** 填充列表数据 */
            fillList: PropTypes.func,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
            /** 填充当前行数据 */
            setFormField: PropTypes.func,
            /** 计算合计 */
            calcTotal: PropTypes.func,
            /** 当某一行的数据发生改变时，通过改方法计算合计 */
            calcTotalForOneRow: PropTypes.func,
            /** 预处理物品数据 */
            preProcessProd: PropTypes.func,
        };

        /** 返回表单中相同的物品信息 */
        findSameRow = (good) => {
            let {getFormField} = this.props;
            let dataSource = getFormField();
            let sameKey, sameRecord;
            _.forIn(dataSource, (value, key)=>{
                if(value && value.productCode === good.productCode && value.proBarCode === good.proBarCode){
                    sameKey = key;
                    sameRecord = value;
                    return false;
                }
            });
            return [sameKey, sameRecord];
        };

        /** 改变当前物品的数量 */
        changeGoodQuantity = (key, record) => {
            let {setFormField, calcTotalForOneRow} = this.props;
            let quantityDecimalNum = getCookie("quantityDecimalNum");

            let {quantity, recQuantity, unitConverter, unitPrice, taxRate, amount } = record;
            recQuantity = _.parseInt(recQuantity||0) + 1;
            quantity = fixedDecimal(recQuantity * unitConverter, quantityDecimalNum);
            let obj = this.inverseCalc(quantity, taxRate, unitPrice, amount);
            setFormField(key, {...obj, quantity, recQuantity});
            // 计算合计
            let q = _.subtract(quantity||0, record.quantity||0);
            let a = _.subtract(obj.amount||0, record.amount||0);
            calcTotalForOneRow(q, a);
        };

        /** 错误处理 */
        handleOnError = () => {
            Modal.warning({
                title: '提示信息',
                content: '找不到该条码，可去物品信息里核对！',
            })
        };

        /** 扫码录单*/
        handleScan = (e) => {
            e.preventDefault();
            let {setFieldsValue} = this.props.formRef.current;

            const proBarCode = e.target.value;
            if (!proBarCode) return;
            let {source, defaultForm, asyncFetchBarcode, fillList, calcTotal, preProcessProd} = this.props;
            asyncFetchBarcode(proBarCode, data => {
                if (data.retCode === '0') {
                    if (data.data) {
                        // 预处理物品数据
                        let good = preProcessProd({type: 'scan',source, defaultForm, list: data.data});
                        let [sameKey, sameRecord] = this.findSameRow(good);
                        if(sameKey){
                            // 存在相同key，则只需要修改数量、金额与合计
                            this.changeGoodQuantity(sameKey, sameRecord);
                        } else {
                            // 直接填充数据
                            fillList([good], null, () => {
                                // 计算合计
                                if(calcTotal) calcTotal();
                            });
                        }
                    } else {
                        this.handleOnError();
                    }
                    //清空输入框
                    setFieldsValue({scan: ''})
                }
            })
        };

        render() {
            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                    />
                    <Row className={"mt20"}>
                        <Col span={8}>
                            <Form.Item>
                                <Form.Item name={'scan'}>
                                    <Input addonBefore={(<div>扫码录单</div>)} placeholder={'扫码录单专用'}
                                           onPressEnter={(e) => this.handleScan(e)}/>
                                </Form.Item>
                                <Tooltip
                                    type="info"
                                    title={'请先录入物品的商品条码后再扫码'}
                                >
                                    <QuestionCircleOutlined  className={cx("scan-tip")}/>
                                </Tooltip>
                            </Form.Item>
                        </Col>
                    </Row>
                </React.Fragment>
            )
        }
    }
}

