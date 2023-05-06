import React, {Component} from 'react';
import intl from 'react-intl-universal';
/*import { Form } from '@ant-design/compatible';*/
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, DatePicker,Form,Checkbox} from 'antd';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectUnit} from 'pages/auxiliary/goodsUnit'
import {SelectSupplier} from 'pages/supplier/index'
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class BaseInfo extends Component {

    state = {
        useSystemCode: true,
    }

    setProdNo = (e) => {
        this.setState({
            useSystemCode: e.target.checked
        },()=>{
            const {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                displayBillNo:''
            });
        });
    };

    render() {

        const {initBaseInfo,match} = this.props;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };

        return (
            <React.Fragment>
                <Row>

                    {
                        match.params.id?null:(
                            <Col span={8}>
                                <>
                                    <div className={cx("input-prodNo")}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label={"采购单号"}
                                            name="displayBillNo"
                                            rules={[
                                                {
                                                    required: !this.state.useSystemCode,
                                                    message: "采购单号为必填项"
                                                }
                                            ]}
                                        >
                                            <Input maxLength={140} disabled={this.state.useSystemCode}/>
                                        </Form.Item>
                                    </div>
                                    <Checkbox onChange={this.setProdNo} className={cx("ck-prodNo")} checked={this.state.useSystemCode}>{intl.get("goods.add.ckProdNo")}</Checkbox>
                                </>
                            </Col>
                        )
                    }

                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.baseInfo.purchaseOrderDate")}
                            name={"purchaseOrderDate"}
                            {...formItemLayout}
                            initialValue = {initBaseInfo? moment(initBaseInfo.get("purchaseOrderDate")):moment()}
                            rules={[{ type: 'object',required: true,message: intl.get("purchase.add.baseInfo.purchaseOrderDateMessage")}]}
                        >
                             <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.baseInfo.warehouseName")}
                            name={"warehouseName"}
                            {...formItemLayout}
                            initialValue = {initBaseInfo && initBaseInfo.get("warehouseName")}
                        >
                            <SelectDeliveryAddress isWareHouses={true} showEdit={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.baseInfo.supplier")}
                            name={"supplier"}
                            {...formItemLayout}
                            initialValue = {{
                                key: initBaseInfo ? initBaseInfo.get("supplierCode"): '',
                                label: initBaseInfo ? initBaseInfo.get("supplierName"): ''
                            }}
                            rules={[{
                                validator: (rules, val, callback) => {
                                    if(val.label === ''){
                                        callback(intl.get("purchase.add.baseInfo.supplierMessage_1"))
                                    }else if(val.label.length>80){
                                        callback(intl.get("purchase.add.baseInfo.supplierMessage_2"));
                                    }
                                    callback();
                                }
                            }]}
                            required={true}
                        >
                            <SelectSupplier
                                maxLength={80}
                                onSelect={(value)=>this.props.handleSelectSupplier(value.key)}
                                onBlur={(existSupplier)=>this.props.handleSelectSupplier(existSupplier.key)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.baseInfo.supplierContacterName")}
                            name={"supplierContacterName"}
                            initialValue = {initBaseInfo && initBaseInfo.get("supplierContacterName")}
                            rules={[{
                                max: 25,
                                message: intl.get("purchase.add.baseInfo.supplierContacterNameMessage")
                            }]}
                            {...formItemLayout}
                        >
                            <Input maxLength={25}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.baseInfo.supplierMobile")}
                            name = {"supplierMobile"}
                            initialValue = {initBaseInfo && initBaseInfo.get("supplierMobile")}
                            rules = {
                                [
                                    {
                                        max: 50,
                                        message: intl.get("purchase.add.baseInfo.supplierMobileMessage")
                                    }
                                ]
                            }
                            {...formItemLayout}
                        >
                              <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)