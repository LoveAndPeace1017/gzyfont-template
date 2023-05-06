import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, DatePicker,Form} from 'antd';
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

    render() {

        const {initBaseInfo} = this.props;

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
                    <Col span={8}>
                        <Form.Item
                            label="录单日期"
                            name={"orderDate"}
                            {...formItemLayout}
                            initialValue = {initBaseInfo? moment(initBaseInfo.get("orderDate")):moment()}
                            rules={[{ type: 'object',required: true,message: "该项为必填项"}]}
                        >
                             <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="原料出库仓"
                            name={"warehouseNameOut"}
                            {...formItemLayout}
                            rules={[
                                {
                                    required: true,
                                    message: "仓库为必填项！"
                                }
                            ]}
                            initialValue = {initBaseInfo && initBaseInfo.get("warehouseNameOut")}
                            required={true}
                        >
                            <SelectDeliveryAddress isWareHouses={true} showEdit={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="成品入库仓"
                            name={"warehouseNameIn"}
                            {...formItemLayout}
                            rules={[
                                {
                                    required: true,
                                    message: "仓库为必填项！"
                                }
                            ]}
                            initialValue = {initBaseInfo && initBaseInfo.get("warehouseNameIn")}
                            required={true}
                        >
                            <SelectDeliveryAddress isWareHouses={true} showEdit={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="供应商"
                            name={"supplier"}
                            {...formItemLayout}
                            initialValue = {{
                                key: initBaseInfo ? initBaseInfo.get("supplierCode"): '',
                                label: initBaseInfo ? initBaseInfo.get("supplierName"): ''
                            }}
                            rules={[{
                                validator: (rules, val, callback) => {
                                    if(val.label.length>80){
                                        callback("供应商不能超过80个字符!");
                                    }
                                    callback();
                                }
                            }]}
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
                            label="联系人"
                            name={"supplierContacterName"}
                            initialValue = {initBaseInfo && initBaseInfo.get("supplierContacterName")}
                            rules={[{
                                max: 25,
                                message: "联系人不能超过25个字符!"
                            }]}
                            {...formItemLayout}
                        >
                            <Input maxLength={25}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="联系电话"
                            name = {"supplierMobile"}
                            initialValue = {initBaseInfo && initBaseInfo.get("supplierMobile")}
                            rules = {
                                [
                                    {
                                        max: 50,
                                        message: "联系电话不能超过50个字符!"
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