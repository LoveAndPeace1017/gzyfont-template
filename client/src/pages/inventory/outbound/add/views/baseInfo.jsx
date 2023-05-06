import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Row, Col, DatePicker, Form, Input, Checkbox} from 'antd';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';

import InnerField from './inner';
import PurchaseField from './purchase';
import SaleField from './sale';
import OtherField from './other';
import {SelectDept} from 'pages/auxiliary/dept';
import {SelectEmployee} from 'pages/auxiliary/employee';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depId: '',
            useSystemCode: true,
        }
    }

    //部门选择
    handleDeptChange = (value) => {
        const {setFieldsValue} = this.props.formRef.current;
        //选择部门后人员下拉选项变动
        this.setState({depId: value});
        setFieldsValue({ usePerson: null });
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
        const {initBaseInfo, outType,match} = this.props;
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
                                        label={"出库单号"}
                                        name="displayBillNo"
                                        rules={[
                                            {
                                                required: !this.state.useSystemCode,
                                                message: "出库单号为必填项"
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
                        name="outDate"
                        rules={[
                            {
                                type: 'object',
                                required: true,
                                message: intl.get("outbound.add.baseInfo.outDateMessage")
                            }
                        ]}
                        label={intl.get("outbound.add.baseInfo.outDate")}
                    >
                        <DatePicker />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        {...formItemLayout}
                        {...defaultOptions}
                        name="warehouseName"
                        rules={[
                            {
                                required: true,
                                message: intl.get("outbound.add.baseInfo.warehouseNameMessage")
                            }
                        ]}
                        label={intl.get("outbound.add.baseInfo.warehouseName")}

                    >
                        <SelectDeliveryAddress isWareHouses={true} showEdit={true}/>
                    </Form.Item>
                </Col>
            </Row>
            {
                outType === 0 ?
                    (
                        <InnerField {...this.props} />
                    ) : outType === 2 ? (
                        <SaleField {...this.props} />
                    ): outType === 3 ? (
                        <PurchaseField {...this.props} initBaseInfo={initBaseInfo}/>
                    ): outType === 6?(
                        <>
                            <PurchaseField {...this.props} initBaseInfo={initBaseInfo}/>
                            <Form.Item
                                name="fkProduceNo"
                                style={{display: "none"}}
                            >
                                <Input type={"hidden"} />
                            </Form.Item>
                        </>
                    ):outType === 7 ? (
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    {...defaultOptions}
                                    name="useDepartment"
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
                                    name="usePerson"
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
                    ):(
                        <OtherField {...this.props} initBaseInfo={initBaseInfo}/>
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