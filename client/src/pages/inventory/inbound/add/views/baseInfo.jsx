import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Row, Col, DatePicker, Radio, Form, Checkbox} from 'antd';
const RadioGroup = Radio.Group;
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {SelectSupplier} from 'pages/supplier/index';
import {SelectCustomer} from 'pages/customer/index';
import {SelectDept} from 'pages/auxiliary/dept';
import {SelectEmployee} from 'pages/auxiliary/employee';
import {Input} from "antd/lib/index";


const cx = classNames.bind(styles);

class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state={
            inboundType: [
                {type: intl.get("inbound.add.baseInfo.purchaseInbound"), value: 0},
                {type: intl.get("inbound.add.baseInfo.saleInbound"), value: 3},
                {type: intl.get("inbound.add.baseInfo.otherInbound"), value: 1},
                {type: intl.get("inbound.add.baseInfo.produceInbound"), value: 5}
            ],
            depId: props.departmentId || '',
            useSystemCode: true,
        };
    }

    //部门选择
    handleDeptChange = (value) => {
        const {setFieldsValue} = this.props.formRef.current;
        //选择部门后人员下拉选项变动
        this.setState({depId: value});
        setFieldsValue({ otherEnterWarehouseContacterName: null });
    };

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
        const { currentInBoundType,match} = this.props;
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
                                            label={"入库单号"}
                                            name="displayBillNo"
                                            rules={[
                                                {
                                                    required: !this.state.useSystemCode,
                                                    message: "入库单号为必填项"
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
                            {...formItemLayout}
                            label={intl.get("inbound.add.baseInfo.enterDate")}
                            name="enterDate"
                            rules={[
                                {
                                    type: 'object',
                                    required: true,
                                    message: intl.get("inbound.add.baseInfo.enterDateMessage")
                                }
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            { ...defaultOptions}
                            name="warehouseName"
                            label={intl.get("inbound.add.baseInfo.warehouseName")}
                            rules={[
                                {
                                    required: true,
                                    message: intl.get("inbound.add.baseInfo.warehouseNameMessage")
                                }
                            ]}
                            required={true}
                        >
                            <SelectDeliveryAddress isWareHouses={true} showEdit={true} />
                        </Form.Item>
                    </Col>
                </Row>
                {
                    currentInBoundType === 0 ?
                        (
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="supplier"
                                        label={intl.get("inbound.add.baseInfo.supplier")}
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
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="supplierContacterName"
                                        label={intl.get("inbound.add.baseInfo.contacterName")}
                                    >
                                        <Input maxLength={25}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="supplierMobile"
                                        label={intl.get("inbound.add.baseInfo.mobile")}
                                    >
                                        <Input maxLength={50}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) : currentInBoundType === 3 ?
                        (
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="customer"
                                        label={intl.get("inbound.add.baseInfo.customer")}
                                    >
                                        <SelectCustomer
                                            maxLength={80}
                                            placeholder={intl.get("inbound.add.baseInfo.customerPlaceholder")}
                                            onSelect={(value)=>this.props.handleSelectCustomer(value.key)}
                                            onBlur={(existCustomer)=>this.props.handleSelectCustomer(existCustomer.key)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="customerContacterName"
                                        label={intl.get("inbound.add.baseInfo.contacterName")}
                                    >
                                        <Input maxLength={25}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="customerTelNo"
                                        label={intl.get("inbound.add.baseInfo.mobile")}
                                    >
                                        <Input maxLength={50}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        ): currentInBoundType === 5 ?  (
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="otherEnterWarehouseName"
                                        label={intl.get("inbound.add.baseInfo.produceDepartment")}
                                    >
                                        <SelectDept
                                            handleDeptChange={this.handleDeptChange}
                                            showEmployeeVisible={true}
                                            showEdit={true}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="otherEnterWarehouseContacterName"
                                        label={intl.get("inbound.add.baseInfo.producePerson")}
                                    >
                                        <SelectEmployee
                                            depId={this.state.depId}
                                            showVisible={true}
                                            showEdit={true}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ): currentInBoundType === 7 ?  (
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="otherEnterWarehouseName"
                                        label={intl.get("inbound.add.baseInfo.produceDepartment")}
                                    >
                                        <SelectDept
                                            handleDeptChange={this.handleDeptChange}
                                            showEmployeeVisible={true}
                                            showEdit={true}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="otherEnterWarehouseContacterName"
                                        label={intl.get("inbound.add.baseInfo.producePerson")}
                                    >
                                        <SelectEmployee
                                            depId={this.state.depId}
                                            showVisible={true}
                                            showEdit={true}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="fkProduceNo"
                                        label={intl.get("inbound.add.baseInfo.upstreamOrder")}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ): (currentInBoundType === 8 || currentInBoundType === 6) ?(
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="supplier"
                                        label={intl.get("inbound.add.baseInfo.supplier")}
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
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="supplierContacterName"
                                        label={intl.get("inbound.add.baseInfo.contacterName")}
                                    >
                                        <Input maxLength={25}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="supplierMobile"
                                        label={intl.get("inbound.add.baseInfo.mobile")}
                                    >
                                        <Input maxLength={50}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="fkProduceNo"
                                        style={{display: "none"}}
                                    >
                                        <Input type={"hidden"} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ):(
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="otherEnterWarehouseName"
                                        label={intl.get("inbound.add.baseInfo.warehouseParty")}
                                    >
                                        <Input maxLength={80}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        {...defaultOptions}
                                        name="otherEnterWarehouseContacterName"
                                        label={intl.get("inbound.add.baseInfo.contacterName")}
                                    >
                                        <Input maxLength={25}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    suggestCustomer: state.getIn(['saleAdd', 'suggestCustomer'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)