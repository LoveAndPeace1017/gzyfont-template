import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form, DatePicker, Input, Button, message} from 'antd';
import { asyncModifyBatchQuery } from "../actions";
import moment from "moment-timezone/index";
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
/**
 *
 * @visibleName ModifyBatchQuery（修改保值期）
 * @author jinb
 */

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncModifyBatchQuery,
    }, dispatch)
};

@withRouter
@connect(null, mapDispatchToProps)
export default class ModifyBatchQuery extends Component {
    formRef = React.createRef();

    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 12},
        }
    };

    state = {
        data: {}
    };

    componentDidMount() {
        let obj = this.props.data;
        if(obj.batchNo && obj.productCode){
            this.initForm(obj)
        }
    }

    initForm = (obj) => {
        let {productCode, displayCode, name:productName, batchNo, productionDate, expirationDate, warehouseName} = obj;
        productionDate = productionDate ? moment(obj.productionDate) : moment();
        expirationDate = expirationDate ? moment(obj.expirationDate) : moment();
        this.formRef.current.setFieldsValue({
            productCode,
            displayCode,
            productName,
            batchNo,
            productionDate,
            expirationDate,
            warehouseName
        })
    };

    // 添加修改保值期
    handleModifyRecord =  (values) => {
        if(values.productionDate) values.productionDate = values.productionDate.format('YYYY-MM-DD');
        if(values.expirationDate) values.expirationDate = values.expirationDate.format('YYYY-MM-DD');
        this.props.asyncModifyBatchQuery({...values}, (res) => {
            if (res.data.retCode === '0') {
                message.success('操作成功');
                this.props.onOk();
            } else {
                message.error(res.data.retMsg)
            }
        })
    };

    // 提交表单
    handleSubmit = async () => {
        const values = await this.formRef.current.validateFields();
        this.handleModifyRecord(values);
    };

    render() {
        return (
            <Form ref={this.formRef} style={{height: 340}}>
                <Form.Item
                    {...ModifyBatchQuery.formItemLayout}
                    label={'物品编号'}
                    name="displayCode"
                >
                    <Input className={cx('readOnly')} disabled/>
                </Form.Item>

                <Form.Item
                    {...ModifyBatchQuery.formItemLayout}
                    label={'物品名称'}
                    name="productName"
                >
                    <Input className={cx('readOnly')} disabled/>
                </Form.Item>

                <Form.Item
                    {...ModifyBatchQuery.formItemLayout}
                    label={'批次号'}
                    name="batchNo"
                >
                    <Input className={cx('readOnly')} disabled/>
                </Form.Item>

                <Form.Item
                    {...ModifyBatchQuery.formItemLayout}
                    label={'生产日期'}
                    name="productionDate"
                    rules={[
                        {
                            validator: (rules, value, callback) => {
                                if (!value) {
                                    callback('该项为必填项');
                                }
                                callback();
                            }
                        }
                    ]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    {...ModifyBatchQuery.formItemLayout}
                    label={'到期日期'}
                    name="expirationDate"
                    rules={[
                        {
                            validator: (rules, value, callback) => {
                                if (!value) {
                                    callback('该项为必填项');
                                }
                                let productionDate = this.formRef.current.getFieldValue('productionDate');
                                if(value && productionDate && productionDate.isAfter(value, 'date')){
                                    callback('到期日期不能早于生产日期')
                                }
                                callback();
                            }
                        }
                    ]}
                >
                    <DatePicker />
                </Form.Item>

                <div style={{display: 'none'}}>
                    <Form.Item name="productCode" />
                    <Form.Item name="warehouseName" />
                </div>

                <div className={cx('modal-btn')}>
                    <Button type="primary" onClick={this.handleSubmit}>
                        确定
                    </Button>
                    <Button onClick={() => this.props.onCancel()} style={{marginLeft: 10}}>
                        取消
                    </Button>
                </div>
            </Form>
        )
    }
}
